# intelligent_chatbot.py - TRULY INTELLIGENT AI CHATBOT WITH GEMINI

from accurate_knowledge_base import (
    SUZUKI_ALTO_FAULTS,
    get_fault_by_symptoms,
    assess_drivability,
    get_parts_required,
    estimate_repair_time
)
import google.generativeai as genai
import json
import time
import re

# CONFIGURATION
GEMINI_API_KEY = "AIzaSyC_ivC6pXf1Hamzgc6OvF-VxHgbEXqQjqE"
genai.configure(api_key=GEMINI_API_KEY)
chat_model = genai.GenerativeModel('gemini-1.5-flash-latest')
vision_model = genai.GenerativeModel('gemini-1.5-flash-latest')

# ============================================
# INTELLIGENT CHATBOT WITH GEMINI AI
# ============================================

class IntelligentChatbot:
    """AI-Powered chatbot that understands natural language"""
    
    def __init__(self):
        self.user_name = None
        self.vehicle_info = {
            "model": "Suzuki Alto",
            "year": 2018,
            "mileage": 45000,
            "transmission": "Manual"
        }
        self.detected_category = None
        self.symptoms = {}
        self.conversation_history = []
        self.diagnosis_complete = False
        self.dashboard_image_data = None
        self.dashboard_analysis = None
        self.user_location = None
        self.safety_confirmed = False
        self.questions_asked = []
        self.critical_info_needed = []
        
    def start_conversation(self, user_name: str = "Kavindu"):
        """Start conversation"""
        self.user_name = user_name
        greeting = f"Hi {user_name}! 👋 I'm here to help with your Suzuki Alto.\nWhat seems to be the problem today?"
        
        self.conversation_history.append({"role": "assistant", "content": greeting})
        return {"message": greeting, "stage": "initial"}
    
    def process_message(self, user_message: str, image_data=None) -> dict:
        """Process user message with AI intelligence"""
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Handle image upload
        if image_data:
            return self._process_dashboard_image(image_data)
        
        # Use AI to extract ALL information from message
        extraction = self._ai_extract_information(user_message)
        
        print(f"🤖 AI Extracted: {extraction}")
        
        # Update state with extracted info
        if extraction.get("category"):
            self.detected_category = extraction["category"]
        
        if extraction.get("symptoms"):
            self.symptoms.update(extraction["symptoms"])
        
        if extraction.get("location"):
            self.user_location = extraction["location"]
        
        if extraction.get("safety_status"):
            self.safety_confirmed = extraction["safety_status"] == "safe"
        
        # Determine urgency
        is_urgent = extraction.get("urgency") == "critical"
        
        # Check if need safety questions
        if is_urgent and not self.safety_confirmed:
            return self._ask_safety_questions()
        
        # Check if enough info to diagnose
        if self._can_diagnose_intelligently():
            # Check if need dashboard image
            if self._should_request_dashboard_image():
                return self._request_dashboard_image()
            
            return self._create_comprehensive_diagnosis()
        
        # Ask intelligent follow-up question
        return self._ask_intelligent_question()
    
    def _ai_extract_information(self, user_message: str) -> dict:
        """Use Gemini to extract ALL information from user message"""
        
        prompt = f"""You are a vehicle diagnostic AI assistant. Analyze this message from a Suzuki Alto owner:

Message: "{user_message}"

Extract and return a JSON object with:
1. category: One of [Engine, Brake, Electrical, Transmission, Suspension, AC, null]
2. symptoms: Dict of detected symptoms (use snake_case keys)
3. urgency: "critical", "urgent", or "normal"
4. location: Any location mentioned (or null)
5. safety_status: "safe" if user is parked/safe, "unsafe" if in danger, "unknown"

Symptom keys to use:
ENGINE: engine_stopped, steam, temp_warning_on, coolant_leak_large, coolant_leak_small, hissing_sound, knocking_sound, check_engine_light, shaking, engine_running, no_steam, temp_high, temp_normal
BRAKE: grinding_noise, squealing_light, soft_pedal, hard_pedal, pedal_normal, pedal_to_floor, brake_warning_light, no_brake_warning, noise_constant, noise_high_speed, vehicle_operational
ELECTRICAL: no_crank, no_lights, lights_dim, battery_light_on, engine_cranks, lights_on
TRANSMISSION: difficult_shifting, engine_revs_no_movement, slipping_uphill, no_gear_engagement
SUSPENSION: steering_vibration, clunking_bumps
AC: ac_not_blowing, blows_warm, blows_cold, cooling_weak

Examples:
Input: "My car is overheating and stopped running near Malabe"
Output: {{"category": "Engine", "symptoms": {{"engine_stopped": true, "temp_high": true}}, "urgency": "critical", "location": "Malabe", "safety_status": "unknown"}}

Input: "I hear grinding when I brake but the car still drives fine"
Output: {{"category": "Brake", "symptoms": {{"grinding_noise": true, "vehicle_operational": true}}, "urgency": "urgent", "location": null, "safety_status": "safe"}}

Input: "Yeah I'm parked safely outside, there's steam coming out and it smells like coolant"
Output: {{"category": "Engine", "symptoms": {{"steam": true, "coolant_leak_large": true}}, "urgency": "critical", "location": null, "safety_status": "safe"}}

Now analyze the user's message and return ONLY valid JSON:"""

        try:
            response = chat_model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean response (remove markdown if present)
            response_text = re.sub(r'```json\n?', '', response_text)
            response_text = re.sub(r'```\n?', '', response_text)
            response_text = response_text.strip()
            
            extraction = json.loads(response_text)
            return extraction
            
        except Exception as e:
            print(f"❌ AI extraction error: {e}")
            # Fallback to keyword matching
            return self._fallback_extraction(user_message)
    
    def _fallback_extraction(self, message: str) -> dict:
        """Fallback keyword-based extraction if AI fails"""
        message_lower = message.lower()
        
        extraction = {
            "category": None,
            "symptoms": {},
            "urgency": "normal",
            "location": None,
            "safety_status": "unknown"
        }
        
        # Detect category
        for category, data in SUZUKI_ALTO_FAULTS.items():
            for keyword in data["keywords"]:
                if keyword in message_lower:
                    extraction["category"] = category
                    break
        
        # Detect urgency
        critical_keywords = ["stopped", "won't start", "overheating", "smoke", "steam", "can't stop", "no brakes"]
        if any(k in message_lower for k in critical_keywords):
            extraction["urgency"] = "critical"
        
        # Detect safety
        safe_keywords = ["parked", "safe", "stopped", "outside"]
        if any(k in message_lower for k in safe_keywords):
            extraction["safety_status"] = "safe"
        
        # Extract basic symptoms
        if "grinding" in message_lower:
            extraction["symptoms"]["grinding_noise"] = True
        if "steam" in message_lower or "smoke" in message_lower:
            extraction["symptoms"]["steam"] = True
        if "stopped" in message_lower:
            extraction["symptoms"]["engine_stopped"] = True
        if "overheating" in message_lower or "hot" in message_lower:
            extraction["symptoms"]["temp_high"] = True
        
        return extraction
    
    def _ask_safety_questions(self) -> dict:
        """Ask critical safety questions for urgent cases"""
        
        if "parked" not in self.questions_asked:
            self.questions_asked.append("parked")
            message = "🚨 I understand this is urgent. First, let me check:\n\n**Have you parked the car now? Are you safe?**"
            
            return {
                "message": message,
                "stage": "safety_check",
                "expected_info": "safety_confirmation",
                "buttons": ["Yes, I'm safe", "No, I'm still moving", "I'm stuck"]
            }
        
        if "location_check" not in self.questions_asked:
            self.questions_asked.append("location_check")
            message = "Good. **Are you inside or outside the vehicle right now?**"
            
            return {
                "message": message,
                "stage": "safety_check",
                "expected_info": "user_position",
                "buttons": ["Inside", "Outside"]
            }
        
        # Safety confirmed, continue to diagnosis
        self.safety_confirmed = True
        return self._ask_intelligent_question()
    
    def _ask_intelligent_question(self) -> dict:
        """Ask intelligent follow-up question based on context"""
        
        # Build context for AI
        context = {
            "category": self.detected_category,
            "symptoms_known": list(self.symptoms.keys()),
            "questions_asked": self.questions_asked
        }
        
        prompt = f"""You are helping diagnose a Suzuki Alto vehicle issue.

Current diagnosis state:
- Category detected: {context['category']}
- Symptoms confirmed: {context['symptoms_known']}
- Questions already asked: {context['questions_asked']}

Based on this, what is the MOST IMPORTANT next question to ask to complete the diagnosis?

Rules:
1. Don't ask about symptoms already confirmed
2. Ask specific, clear questions
3. For Engine issues: prioritize temperature, running status, leaks
4. For Brake issues: prioritize pedal feel, noise timing, warning lights
5. For Electrical: prioritize cranking, lights, battery age
6. Keep questions short and conversational

Return JSON:
{{
  "question": "Your question here",
  "symptom_target": "symptom_key_this_reveals",
  "buttons": ["Option 1", "Option 2", "Option 3"]
}}

Examples:
{{"question": "Is the engine still running right now?", "symptom_target": "engine_running", "buttons": ["Yes, running fine", "Yes, but rough", "No, completely stopped"]}}
{{"question": "How does the brake pedal feel?", "symptom_target": "pedal_feel", "buttons": ["Normal", "Soft/Spongy", "Hard to press", "Goes to floor"]}}"""

        try:
            response = chat_model.generate_content(prompt)
            response_text = response.text.strip()
            
            # Clean response
            response_text = re.sub(r'```json\n?', '', response_text)
            response_text = re.sub(r'```\n?', '', response_text)
            
            question_data = json.loads(response_text)
            
            # Add acknowledgment
            ack = ""
            if len(self.questions_asked) > 0:
                acks = ["Got it 👍", "Understood.", "Okay, thanks.", "Alright.", "I see."]
                import random
                ack = random.choice(acks) + "\n\n"
            
            self.questions_asked.append(question_data.get("symptom_target", "unknown"))
            
            return {
                "message": ack + question_data["question"],
                "stage": "questioning",
                "expected_info": question_data.get("symptom_target"),
                "buttons": question_data.get("buttons", [])
            }
            
        except Exception as e:
            print(f"❌ AI question generation error: {e}")
            return self._fallback_question()
    
    def _fallback_question(self) -> dict:
        """Fallback question if AI fails"""
        
        if not self.detected_category:
            return {
                "message": "Could you describe the main issue in more detail?",
                "stage": "clarification"
            }
        
        # Ask category-specific questions
        if self.detected_category == "Engine":
            if "engine_running" not in self.symptoms:
                return {
                    "message": "Is the engine still running right now?",
                    "stage": "questioning",
                    "buttons": ["Yes", "No"]
                }
        
        if self.detected_category == "Brake":
            if "pedal_feel" not in self.symptoms:
                return {
                    "message": "How does the brake pedal feel?",
                    "stage": "questioning",
                    "buttons": ["Normal", "Soft", "Hard"]
                }
        
        return {
            "message": "Can you tell me anything else you've noticed?",
            "stage": "questioning"
        }
    
    def _can_diagnose_intelligently(self) -> bool:
        """Check if enough information collected using AI"""
        
        if not self.detected_category:
            return False
        
        # Critical combinations allow immediate diagnosis
        critical_combos = [
            {"engine_stopped", "steam", "coolant_leak_large"},
            {"soft_pedal", "pedal_to_floor"},
            {"no_crank", "no_lights"},
            {"engine_revs_no_movement"}
        ]
        
        symptoms_set = set(self.symptoms.keys())
        for combo in critical_combos:
            if combo.issubset(symptoms_set):
                return True
        
        # Need minimum symptoms based on category
        min_symptoms = {
            "Engine": 3,
            "Brake": 3,
            "Electrical": 2,
            "Transmission": 2,
            "Suspension": 2,
            "AC": 2
        }
        
        required = min_symptoms.get(self.detected_category, 3)
        return len(self.symptoms) >= required
    
    def _should_request_dashboard_image(self) -> bool:
        """Check if should ask for dashboard image"""
        return (
            not self.dashboard_image_data and
            self.detected_category in ["Engine", "Brake", "Electrical"] and
            len(self.symptoms) >= 2
        )
    
    def _request_dashboard_image(self) -> dict:
        """Request dashboard photo"""
        message = "Perfect! Let's also take a look at your dashboard.\n\n📸 **Please upload a clear photo of your dashboard with the ignition ON.**"
        
        return {
            "message": message,
            "stage": "requesting_image",
            "action": "upload_image"
        }
    
    def _process_dashboard_image(self, image_data) -> dict:
        """Analyze dashboard image using Gemini Vision"""
        self.dashboard_image_data = image_data
        
        try:
            time.sleep(1)  # Simulate processing
            
            prompt = """Analyze this vehicle dashboard image and provide a JSON response:

{
  "warning_lights": ["list of warning lights that are ON"],
  "temperature_status": "normal/high/critical",
  "fuel_level": "full/adequate/low/empty",
  "other_indicators": ["any other notable indicators"],
  "summary": "brief summary"
}

Warning lights to look for:
- Check Engine Light (yellow/orange engine icon)
- Temperature Warning (red thermometer)
- Brake Warning (red "BRAKE" or "!")
- Battery Warning (red battery icon)
- ABS Warning (yellow "ABS")
- Oil Pressure (red oil can)

Be specific and accurate. Only mention lights that are clearly illuminated."""

            response = vision_model.generate_content([prompt, image_data])
            analysis_text = response.text.strip()
            
            # Clean and parse
            analysis_text = re.sub(r'```json\n?', '', analysis_text)
            analysis_text = re.sub(r'```\n?', '', analysis_text)
            
            self.dashboard_analysis = json.loads(analysis_text)
            
            # Update symptoms from dashboard
            if "temperature" in str(self.dashboard_analysis.get("warning_lights", [])).lower():
                self.symptoms["temp_warning_on"] = True
            if "brake" in str(self.dashboard_analysis.get("warning_lights", [])).lower():
                self.symptoms["brake_warning_light"] = True
            if "engine" in str(self.dashboard_analysis.get("warning_lights", [])).lower():
                self.symptoms["check_engine_light"] = True
            
            # Format result
            warning_list = self.dashboard_analysis.get("warning_lights", [])
            if not warning_list:
                warning_list = ["✓ No warning lights detected"]
            
            result_msg = "✓ **Analysis Complete!**\n\n**Dashboard Status:**\n"
            for warning in warning_list[:5]:
                result_msg += f"- {warning}\n"
            result_msg += f"\n**Temperature:** {self.dashboard_analysis.get('temperature_status', 'normal').title()}\n"
            result_msg += f"**Fuel:** {self.dashboard_analysis.get('fuel_level', 'adequate').title()}\n\n"
            result_msg += "Now let me create your complete diagnosis..."
            
            time.sleep(1)
            
            return {
                "message": result_msg,
                "stage": "image_analyzed",
                "dashboard_analysis": self.dashboard_analysis,
                "next_action": "create_diagnosis"
            }
            
        except Exception as e:
            print(f"❌ Image analysis error: {e}")
            return {
                "message": "I had trouble analyzing the image. Let me proceed with the diagnosis based on your answers.",
                "stage": "image_analysis_failed",
                "next_action": "create_diagnosis"
            }
    
    def _create_comprehensive_diagnosis(self) -> dict:
        """Create comprehensive diagnosis"""
        print("\n🔍 Creating comprehensive diagnosis...")
        
        time.sleep(2)  # Simulate AI thinking
        
        # Get fault details
        fault_info = get_fault_by_symptoms(self.detected_category, self.symptoms)
        
        # Get drivability assessment
        drivability = assess_drivability(self.symptoms, self.detected_category)
        
        # Get parts required
        parts = get_parts_required(fault_info['fault_name'], self.detected_category)
        
        # Estimate repair time
        repair_time = estimate_repair_time(fault_info['severity'], self.detected_category)
        
        # Create diagnosis card
        diagnosis_card = self._format_diagnosis_card(
            fault_info, drivability, parts, repair_time
        )
        
        self.diagnosis_complete = True
        
        return {
            "message": diagnosis_card,
            "stage": "diagnosis_complete",
            "diagnosis": {
                "vehicle": self.vehicle_info,
                "fault_category": self.detected_category,
                "fault_type": fault_info['fault_name'],
                "severity": fault_info['severity'],
                "is_drivable": drivability['is_drivable'],
                "urgency": drivability['urgency'],
                "parts_required": parts,
                "repair_time": repair_time,
                "safety_instructions": drivability['instructions'],
                "location": self.user_location,
                "dashboard_analysis": self.dashboard_analysis
            }
        }
    
    def _format_diagnosis_card(self, fault_info, drivability, parts, repair_time) -> str:
        """Format diagnosis as comprehensive card"""
        
        severity_emoji = {
            "Minor": "🟢",
            "Moderate": "🟡",
            "Major": "🔴"
        }
        
        card = f"""
┌{'─'*50}┐
│  🔍 DIAGNOSIS COMPLETE                            │
├{'─'*50}┤
│                                                    │
│ 🚗 Vehicle Details:                               │
│  • Model: {self.vehicle_info['model']}            │
│  • Model Year: {self.vehicle_info['year']}        │
│  • Mileage: {self.vehicle_info['mileage']:,} km   │
│  • Transmission: {self.vehicle_info['transmission']}│
"""
        
        if self.user_location:
            card += f"│  • Current Location: {self.user_location}         │\n"
        
        card += f"""│                                                    │
│ ⚠️ Fault Information:                             │
│  • Category: {self.detected_category.upper()}     │
│  • Fault Type: {fault_info['fault_name'][:35]}    │
│  • Severity: {severity_emoji.get(fault_info['severity'], '⚠️')} {fault_info['severity'].upper()}│
│                                                    │
│ 📋 Symptoms Detected:                             │"""

        # Add confirmed symptoms
        symptom_count = 0
        for symptom_key in list(self.symptoms.keys())[:6]:
            display_name = symptom_key.replace('_', ' ').title()
            card += f"\n│  ✓ {display_name[:44]:<44}│"
            symptom_count += 1
        
        if symptom_count == 0:
            card += f"\n│  ✓ Issue detected and analyzed                    │"
        
        card += f"""
│                                                    │
│ 🚦 Drivability Assessment:                        │
│  {'🛑 NOT DRIVABLE' if not drivability['is_drivable'] else '✅ DRIVABLE WITH CAUTION'}                           │
│                                                    │"""

        # Safety instructions
        if not drivability['is_drivable']:
            card += f"""
│ ⚠️ Immediate Safety Instructions:                 │"""
            for instruction in drivability['instructions'][:4]:
                card += f"\n│  • {instruction[:46]:<46}│"
        else:
            card += f"""
│ ✓ Safety Instructions:                            │"""
            for instruction in drivability['instructions'][:3]:
                card += f"\n│  • {instruction[:46]:<46}│"
        
        # Parts required
        if parts:
            card += f"""
│                                                    │
│ 🧩 Parts Required:                                │"""
            for part in parts[:4]:
                card += f"\n│  • {part[:46]:<46}│"
        
        # Urgency and time
        card += f"""
│                                                    │
│ ⏱ Urgency Level: {drivability['urgency'].upper():<29}│
│                                                    │
│ ⏰ Estimated Repair Time:                          │
│  {repair_time:<48}│
│  (Based on ML prediction model)                   │
│                                                    │"""

        # Action button
        if drivability['is_drivable']:
            card += f"""
│  [Find Nearby Garages →]                          │"""
        else:
            card += f"""
│  [Request Roadside Mechanic →]                    │"""
        
        card += f"""
│                                                    │
└{'─'*50}┘
"""
        
        return card

# ============================================
# INTERACTIVE TEST
# ============================================

def run_intelligent_test():
    """Test intelligent chatbot"""
    print("="*70)
    print("🤖 INTELLIGENT AI CHATBOT - NATURAL LANGUAGE TEST")
    print("="*70)
    
    bot = IntelligentChatbot()
    response = bot.start_conversation("Kavindu")
    print(f"\n🤖: {response['message']}")
    
    # Test with natural language
    test_messages = [
        "My brakes are making grinding noises when I press them",
        "Yeah I'm parked and safe now",
        "I'm outside the car",
        "I was going about 50 km/h when I first heard it",
        "No warning lights on the dashboard",
        "Pedal feels normal, not soft or anything",
        "It happens every single time I brake"
    ]
    
    for msg in test_messages:
        print(f"\n👤: {msg}")
        result = bot.process_message(msg)
        print(f"\n🤖: {result['message']}")
        
        if result.get('stage') == 'diagnosis_complete':
            break
        
        time.sleep(0.5)

if __name__ == "__main__":
    run_intelligent_test()