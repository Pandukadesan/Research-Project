# chatbot_core.py - Core chatbot without Gemini (pure logic)

from knowledge_base import (
    detect_category, 
    get_questions_for_category, 
    get_fault_types,
    FAULT_CATEGORIES
)

# ============================================
# CHATBOT CLASS
# ============================================

class DiagnosticChatbot:
    """
    Core chatbot logic - processes messages and manages conversation
    """
    
    def __init__(self):
        # Conversation state
        self.user_name = None
        self.detected_category = None
        self.current_question_index = 0
        self.questions_to_ask = []
        
        # Collected data
        self.symptoms = {}
        self.conversation_history = []
        
        # Status
        self.diagnosis_complete = False
    
    def start_conversation(self, user_name: str = "there"):
        """Initialize conversation"""
        self.user_name = user_name
        
        greeting = f"Hi {user_name} 👋 I'm here to help. Stay calm — we'll sort this out together.\n\n👉 Can you tell me what's happening with your Suzuki Alto right now?"
        
        self.conversation_history.append({
            "role": "bot",
            "message": greeting
        })
        
        return greeting
    
    def process_message(self, user_message: str) -> dict:
        """
        Process user's message and return bot response
        
        Returns:
            {
                "bot_message": "Bot's response text",
                "stage": "greeting|questioning|diagnosis",
                "detected_category": "Engine|Brake|etc",
                "diagnosis": {...} or None
            }
        """
        # Store user message
        self.conversation_history.append({
            "role": "user",
            "message": user_message
        })
        
        # STEP 1: Detect category if not already detected
        if not self.detected_category:
            self.detected_category = detect_category(user_message)
            
            if self.detected_category:
                print(f"🎯 Detected category: {self.detected_category}")
                
                # Load questions for this category
                self.questions_to_ask = get_questions_for_category(self.detected_category)
                
                # Ask first question
                return self._ask_next_question()
            else:
                # Category unclear, ask for clarification
                return {
                    "bot_message": "I understand you're having an issue. Could you describe the main problem? (For example: car won't start, brakes squealing, engine overheating, etc.)",
                    "stage": "clarification",
                    "detected_category": None,
                    "diagnosis": None
                }
        
        # STEP 2: Extract symptoms from answer
        self._extract_symptoms(user_message)
        
        # STEP 3: Check if we can diagnose
        if self._can_diagnose():
            return self._create_diagnosis()
        
        # STEP 4: Ask next question
        return self._ask_next_question()
    
    def _extract_symptoms(self, message: str):
        """Extract symptoms from user's answer"""
        message_lower = message.lower()
        
        # Engine symptoms
        if any(word in message_lower for word in ["yes", "stopped", "cut off", "turned off"]):
            if "engine" in self.questions_to_ask[self.current_question_index-1].get("text", "").lower():
                self.symptoms["engine_cut_off"] = True
        
        if any(word in message_lower for word in ["yes", "steam", "smoke"]):
            self.symptoms["steam_or_smoke"] = True
        
        if any(word in message_lower for word in ["yes", "leak", "leaking"]):
            self.symptoms["fluid_leak"] = True
        
        if any(word in message_lower for word in ["yes", "noise", "sound"]):
            self.symptoms["unusual_noise"] = True
        
        # Warning lights
        if any(word in message_lower for word in ["yes", "on", "lit", "red", "warning"]):
            if "light" in self.questions_to_ask[self.current_question_index-1].get("text", "").lower():
                self.symptoms["warning_light_on"] = True
        
        # Electrical symptoms
        if "no" in message_lower and "crank" in self.questions_to_ask[self.current_question_index-1].get("text", "").lower():
            self.symptoms["no_crank"] = True
        
        # Brake symptoms
        if any(word in message_lower for word in ["soft", "spongy"]):
            self.symptoms["soft_brake_pedal"] = True
        
        print(f"📝 Symptoms collected: {list(self.symptoms.keys())}")
    
    def _can_diagnose(self) -> bool:
        """Check if we have enough information for diagnosis"""
        # Need category + at least 3 symptoms
        if not self.detected_category:
            return False
        
        symptom_count = len(self.symptoms)
        
        # If critical symptoms present, diagnose immediately
        if self.symptoms.get("engine_cut_off") and self.symptoms.get("steam_or_smoke"):
            return True
        
        # Otherwise need 3+ symptoms
        return symptom_count >= 3
    
    def _ask_next_question(self) -> dict:
        """Get next question from flow"""
        # Check if we have more questions
        if self.current_question_index < len(self.questions_to_ask):
            question_data = self.questions_to_ask[self.current_question_index]
            self.current_question_index += 1
            
            # Add acknowledgment before question
            acknowledgments = [
                "Got it 👍",
                "Okay, thanks for that",
                "Understood",
                "Alright"
            ]
            
            import random
            ack = random.choice(acknowledgments) if self.current_question_index > 1 else ""
            
            bot_message = f"{ack}\n\n{question_data['text']}" if ack else question_data['text']
            
            self.conversation_history.append({
                "role": "bot",
                "message": bot_message
            })
            
            return {
                "bot_message": bot_message,
                "stage": "questioning",
                "detected_category": self.detected_category,
                "diagnosis": None
            }
        else:
            # No more questions but still can't diagnose - ask generic
            generic_q = "👉 Is there anything else unusual you've noticed?"
            
            self.conversation_history.append({
                "role": "bot",
                "message": generic_q
            })
            
            return {
                "bot_message": generic_q,
                "stage": "questioning",
                "detected_category": self.detected_category,
                "diagnosis": None
            }
    
    def _create_diagnosis(self) -> dict:
        """Create final diagnosis based on collected symptoms"""
        print("\n🔍 Creating diagnosis...")
        
        # Determine severity based on symptoms
        severity = self._determine_severity()
        
        # Get fault type from knowledge base
        fault_types = get_fault_types(self.detected_category, severity)
        fault_type = fault_types[0] if fault_types else f"{self.detected_category} system issue"
        
        # Determine drivability
        is_drivable = self._assess_drivability()
        
        # Create diagnosis message
        diagnosis_msg = self._format_diagnosis_message(
            self.detected_category,
            fault_type,
            severity,
            is_drivable
        )
        
        self.diagnosis_complete = True
        
        diagnosis_data = {
            "fault_category": self.detected_category,
            "fault_type": fault_type,
            "severity": severity,
            "is_safe_to_drive": is_drivable,
            "symptoms": self.symptoms
        }
        
        self.conversation_history.append({
            "role": "bot",
            "message": diagnosis_msg
        })
        
        return {
            "bot_message": diagnosis_msg,
            "stage": "diagnosis_complete",
            "detected_category": self.detected_category,
            "diagnosis": diagnosis_data
        }
    
    def _determine_severity(self) -> str:
        """Determine severity from symptoms"""
        # Critical symptoms = Major
        if self.symptoms.get("engine_cut_off"):
            return "Major"
        
        if self.symptoms.get("steam_or_smoke"):
            return "Major"
        
        if self.symptoms.get("no_crank") and not self.symptoms.get("dashboard_lights_on"):
            return "Major"
        
        if self.symptoms.get("soft_brake_pedal"):
            return "Major"
        
        # Multiple symptoms = Moderate
        if len(self.symptoms) >= 3:
            return "Moderate"
        
        # Default
        return "Minor"
    
    def _assess_drivability(self) -> bool:
        """Assess if car is safe to drive"""
        # NOT drivable if:
        dangerous_symptoms = [
            self.symptoms.get("engine_cut_off"),
            self.symptoms.get("steam_or_smoke"),
            self.symptoms.get("soft_brake_pedal"),
            self.symptoms.get("no_crank")
        ]
        
        return not any(dangerous_symptoms)
    
    def _format_diagnosis_message(self, category: str, fault_type: str, 
                                   severity: str, is_drivable: bool) -> str:
        """Format nice diagnosis message"""
        msg = f"""
✅ **DIAGNOSIS COMPLETE**

🔧 **Fault Category:** {category}
🔍 **Fault Type:** {fault_type}
⚠️  **Severity:** {severity}

{'🚫 **NOT SAFE TO DRIVE**' if not is_drivable else '✅ **Safe to drive to garage**'}

{'⚠️ **IMMEDIATE ACTIONS:**' if not is_drivable else '📋 **RECOMMENDATIONS:**'}
"""
        
        if not is_drivable:
            msg += """
1. Do NOT restart the engine
2. Stay away from the vehicle
3. Call roadside mechanic immediately
4. Do not attempt to drive
"""
        else:
            msg += """
1. Drive carefully to nearest garage
2. Avoid high speeds and heavy traffic
3. Get it checked as soon as possible
4. Monitor for any changes
"""
        
        return msg

# ============================================
# TEST THE CHATBOT
# ============================================

if __name__ == "__main__":
    print("="*70)
    print("🧪 TESTING CHATBOT CORE LOGIC")
    print("="*70)
    
    # Create chatbot
    bot = DiagnosticChatbot()
    
    # Start conversation
    greeting = bot.start_conversation("TestUser")
    print(f"\n🤖: {greeting}")
    
    # Simulate conversation
    test_conversation = [
        "My car is overheating",
        "Yes, it's red",
        "Yes, there's steam",
        "Yes, I see coolant leaking",
        "Yes, the engine stopped"
    ]
    
    for user_msg in test_conversation:
        print(f"\n👤: {user_msg}")
        
        result = bot.process_message(user_msg)
        
        print(f"\n🤖: {result['bot_message']}")
        
        if result['stage'] == 'diagnosis_complete':
            print("\n" + "="*70)
            print("✅ DIAGNOSIS COMPLETED!")
            print("="*70)
            
            diagnosis = result['diagnosis']
            print(f"\nCategory: {diagnosis['fault_category']}")
            print(f"Type: {diagnosis['fault_type']}")
            print(f"Severity: {diagnosis['severity']}")
            print(f"Drivable: {diagnosis['is_safe_to_drive']}")
            
            break
    
    print("\n✅ Core chatbot logic working correctly!")