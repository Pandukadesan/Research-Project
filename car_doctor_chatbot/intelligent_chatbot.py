# enhanced_intelligent_chatbot.py - USER-FRIENDLY AI CHATBOT WITH STRUCTURED FLOW

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
GEMINI_API_KEY = "AIzaSyB1lr8oWPxbcOywiptJD0qLpPb3kj2L0_s"
genai.configure(api_key=GEMINI_API_KEY)

try:
    chat_model = genai.GenerativeModel('gemini-1.5-flash')
    vision_model = genai.GenerativeModel('gemini-1.5-flash')
except:
    chat_model = genai.GenerativeModel('gemini-pro')
    vision_model = genai.GenerativeModel('gemini-pro-vision')

# ============================================
# PREDEFINED SCENARIO PATTERNS
# ============================================

PREDEFINED_SCENARIOS = {
    "brake_grinding": {
        "triggers": [
            "brakes are making grinding",
            "brake grinding",
            "grinding noise brake",
            "grinding when brake",
            "grinding sound brake"
        ],
        "category": "Brake",
        "severity": "urgent",
        "questions": [
            {
                "text": "Have you parked the car now? Are you safe?",
                "key": "safety_status",
                "buttons": ["Yes, I'm safe", "No, still driving"]
            },
            {
                "text": "Are you inside or outside the vehicle right now?",
                "key": "location_status",
                "buttons": ["Inside", "Outside"]
            },
            {
                "text": "How fast were you driving when the noise occurred?",
                "key": "speed_when_occurred",
                "buttons": ["Low speed", "Moderate speed", "High speed"]
            },
            {
                "text": "Is the brake warning light illuminated on your dashboard?",
                "key": "brake_warning_light",
                "buttons": ["Yes", "No"]
            },
            {
                "text": "How does the brake pedal feel when you press it?",
                "key": "pedal_feel",
                "buttons": ["Normal", "Soft/Spongy", "Hard to press", "Goes to floor"]
            },
            {
                "text": "When do you hear the grinding noise?",
                "key": "noise_timing",
                "buttons": ["Every time I brake", "Only at high speeds", "Only when stopping completely", "Only in the morning"]
            },
            {
                "text": "Is the vehicle still running normally? Can you drive it safely at low speeds?",
                "key": "vehicle_operational",
                "buttons": ["Yes, runs fine", "No, something's wrong"]
            }
        ],
        "symptoms_mapping": {
            "grinding_noise": True,
            "vehicle_operational": True,
            "pedal_normal": True
        }
    },
    
    "engine_overheating": {
        "triggers": [
            "car is overheating",
            "engine overheating",
            "overheating and stopped",
            "car stopped overheating",
            "overheated and stopped"
        ],
        "category": "Engine",
        "severity": "critical",
        "questions": [
            {
                "text": "🚨 Have you parked the car now? Are you safe?",
                "key": "safety_status",
                "buttons": ["Yes, I'm safe", "No, still moving"],
                "style": "urgent"
            },
            {
                "text": "Are you inside or outside the vehicle right now?",
                "key": "location_status",
                "buttons": ["Inside", "Outside"]
            },
            {
                "text": "Is there steam or white smoke coming from the bonnet?",
                "key": "steam_visible",
                "buttons": ["Yes, I see steam", "No steam visible"]
            },
            {
                "text": "How fast were you driving when this happened?",
                "key": "speed_before_failure",
                "input_type": "text",
                "placeholder": "e.g., About 60 km/h on the highway"
            },
            {
                "text": "Did the engine completely stop, or is it still running?",
                "key": "engine_status",
                "buttons": ["Completely stopped", "Still running but rough"]
            },
            {
                "text": "Can you see any fluid leaking under the car? Please check safely from outside the vehicle.",
                "key": "fluid_leak",
                "buttons": ["Yes, I see coolant (green/yellow liquid)", "Yes, I see oil (dark liquid)", "No visible leaks", "I can't check safely"]
            },
            {
                "text": "Before the engine stopped, did you hear any unusual noises?",
                "key": "unusual_sounds",
                "buttons": ["Knocking/banging sounds", "Hissing sound", "No unusual sounds", "Not sure"]
            },
            {
                "text": "How is your current location? Are you in a safe place?",
                "key": "location_safety",
                "buttons": ["On main road - safe shoulder", "Highway - safe emergency lane", "Side road - safe area", "Unsafe location - need help urgently"]
            }
        ],
        "symptoms_mapping": {
            "engine_stopped": True,
            "steam": True,
            "temp_warning_on": True,
            "coolant_leak_large": True
        }
    }
}

# ============================================
# ENHANCED CHATBOT CLASS
# ============================================

class EnhancedChatbot:
    """User-friendly chatbot with structured flow and button options"""
    
    def __init__(self):
        self.user_name = None
        self.vehicle_info = {
            "model": "Suzuki Alto",
            "year": 2018,
            "mileage": 45000,
            "transmission": "Manual"
        }
        self.detected_scenario = None
        self.detected_category = None
        self.current_question_index = 0
        self.answers = {}
        self.symptoms = {}
        self.conversation_history = []
        self.dashboard_image_data = None
        self.dashboard_analysis = None
        self.user_location = None
        self.awaiting_image = False
        
    def start_conversation(self, user_name: str = "Kavindu"):
        """Start conversation"""
        self.user_name = user_name
        greeting = f"Hi {user_name}! 👋 I'm here to help with your Suzuki Alto.\n\nWhat seems to be the problem today?"
        
        self.conversation_history.append({"role": "assistant", "content": greeting})
        return {
            "message": greeting,
            "stage": "initial",
            "show_typing_indicator": False
        }
    
    def process_message(self, user_message: str, image_data=None) -> dict:
        """Process user message with structured flow"""
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Handle image upload
        if image_data or self.awaiting_image:
            return self._process_dashboard_image(image_data)
        
        # First message - detect scenario
        if not self.detected_scenario:
            return self._detect_and_start_scenario(user_message)
        
        # Process answer to current question
        return self._process_answer(user_message)
    
    def _detect_and_start_scenario(self, user_message: str) -> dict:
        """Detect if message matches predefined scenario"""
        user_message_lower = user_message.lower()
        
        # Check each predefined scenario
        for scenario_name, scenario_data in PREDEFINED_SCENARIOS.items():
            for trigger in scenario_data["triggers"]:
                if trigger in user_message_lower:
                    self.detected_scenario = scenario_name
                    self.detected_category = scenario_data["category"]
                    
                    # Extract location if mentioned
                    location_match = re.search(r'near\s+(\w+)', user_message_lower)
                    if location_match:
                        self.user_location = location_match.group(1).title()
                    
                    # Start first question
                    return self._ask_next_question()
        
        # No predefined scenario matched - use AI extraction
        return self._handle_general_query(user_message)
    
    def _ask_next_question(self) -> dict:
        """Ask the next question in the scenario"""
        scenario_data = PREDEFINED_SCENARIOS[self.detected_scenario]
        questions = scenario_data["questions"]
        
        if self.current_question_index >= len(questions):
            # All questions answered - request dashboard image
            return self._request_dashboard_image()
        
        question = questions[self.current_question_index]
        
        # Add acknowledgment before question (except first one)
        prefix = ""
        if self.current_question_index > 0:
            acks = ["Got it 👍", "Understood.", "Okay, thanks.", "Alright.", "I see."]
            import random
            prefix = random.choice(acks) + "\n\n"
        
        # Format message
        if self.detected_scenario == "engine_overheating" and self.current_question_index == 0:
            message = f"⚠️ I understand this is urgent. Your car has overheated and stopped.\nLet me ask critical safety questions first.\n\n🚨 SAFETY CHECK:\n\n{question['text']}"
        elif self.detected_scenario == "brake_grinding" and self.current_question_index == 0:
            message = f"I understand you're hearing grinding noises from the brakes.\nLet's go through a few questions to diagnose this properly.\n\n{question['text']}"
        else:
            message = prefix + question['text']
        
        response = {
            "message": message,
            "stage": "questioning",
            "question_key": question["key"],
            "question_index": self.current_question_index,
            "show_typing_indicator": False
        }
        
        # Add buttons or input type
        if question.get("input_type") == "text":
            response["input_type"] = "text"
            response["placeholder"] = question.get("placeholder", "Type your answer...")
        elif "buttons" in question:
            response["buttons"] = question["buttons"]
        
        # Add urgent style for critical scenarios
        if question.get("style") == "urgent":
            response["style"] = "urgent"
        
        return response
    
    def _process_answer(self, answer: str) -> dict:
        """Process user's answer and move to next question"""
        scenario_data = PREDEFINED_SCENARIOS[self.detected_scenario]
        questions = scenario_data["questions"]
        
        if self.current_question_index < len(questions):
            question = questions[self.current_question_index]
            
            # Store answer
            self.answers[question["key"]] = answer
            
            # Update symptoms based on answer
            self._update_symptoms_from_answer(question["key"], answer)
            
            # Move to next question
            self.current_question_index += 1
        
        # Ask next question or request image
        return self._ask_next_question()
    
    def _update_symptoms_from_answer(self, key: str, answer: str):
        """Update symptoms based on user's answer"""
        answer_lower = answer.lower()
        
        # Map answers to symptoms
        symptom_mappings = {
            "brake_warning_light": {
                "yes": {"brake_warning_light": True},
                "no": {"no_brake_warning": True}
            },
            "pedal_feel": {
                "normal": {"pedal_normal": True},
                "soft": {"soft_pedal": True},
                "hard": {"hard_pedal": True},
                "floor": {"pedal_to_floor": True}
            },
            "noise_timing": {
                "every time": {"noise_constant": True},
                "high speeds": {"noise_high_speed": True}
            },
            "vehicle_operational": {
                "yes": {"vehicle_operational": True},
                "fine": {"vehicle_operational": True}
            },
            "steam_visible": {
                "yes": {"steam": True},
                "no": {"no_steam": True}
            },
            "engine_status": {
                "stopped": {"engine_stopped": True},
                "running": {"engine_running": True}
            },
            "fluid_leak": {
                "coolant": {"coolant_leak_large": True},
                "oil": {"oil_leak": True},
                "no": {"no_visible_leaks": True}
            },
            "unusual_sounds": {
                "hissing": {"hissing_sound": True},
                "knocking": {"knocking_sound": True}
            }
        }
        
        if key in symptom_mappings:
            for keyword, symptoms in symptom_mappings[key].items():
                if keyword in answer_lower:
                    self.symptoms.update(symptoms)
                    break
    
    def _request_dashboard_image(self) -> dict:
        """Request dashboard photo"""
        self.awaiting_image = True
        
        if self.detected_scenario == "engine_overheating":
            message = "Thank you. Now please upload a photo of your dashboard so I can see the warning lights.\n\n📸 Please upload a clear photo of your dashboard with the ignition ON."
        else:
            message = "Perfect! Let's also take a look at your dashboard.\n\n📸 Please upload a clear photo of your dashboard with the ignition ON."
        
        return {
            "message": message,
            "stage": "requesting_image",
            "action": "upload_image",
            "show_typing_indicator": False
        }
    
    def _process_dashboard_image(self, image_data) -> dict:
        """Analyze dashboard image using Gemini Vision"""
        if not image_data:
            return {
                "message": "Please upload the dashboard image to continue.",
                "stage": "requesting_image",
                "action": "upload_image"
            }
        
        self.dashboard_image_data = image_data
        self.awaiting_image = False
        
        try:
            # Show processing message
            print("📊 Analyzing dashboard image...")
            time.sleep(1)
            
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
            warning_lights_str = str(self.dashboard_analysis.get("warning_lights", [])).lower()
            if "temperature" in warning_lights_str or "temp" in warning_lights_str:
                self.symptoms["temp_warning_on"] = True
            if "brake" in warning_lights_str:
                self.symptoms["brake_warning_light"] = True
            if "engine" in warning_lights_str or "check engine" in warning_lights_str:
                self.symptoms["check_engine_light"] = True
            
            # Format result based on scenario
            if self.detected_scenario == "engine_overheating":
                warning_list = self.dashboard_analysis.get("warning_lights", [])
                if warning_list:
                    result_msg = "📊 Analyzing dashboard image...\n\n⚠️ Critical Warnings Detected:\n\n"
                    for warning in warning_list[:3]:
                        if "temperature" in warning.lower():
                            result_msg += "🔴 Temperature Warning Light (RED)\n"
                        elif "engine" in warning.lower():
                            result_msg += "🟡 Check Engine Light (YELLOW)\n"
                        else:
                            result_msg += f"⚠️ {warning}\n"
                    result_msg += "\nAnalysis: Engine overheating condition confirmed\n\nContinuing diagnosis..."
                else:
                    result_msg = "✓ Dashboard image analyzed.\n\nContinuing diagnosis..."
            else:
                warning_list = self.dashboard_analysis.get("warning_lights", [])
                if not warning_list:
                    warning_list = ["✓ No warning lights detected"]
                
                result_msg = "✓ Analysis Complete!\n\n**Dashboard Status:**\n"
                for warning in warning_list[:5]:
                    result_msg += f"- {warning}\n"
                result_msg += f"\n**Temperature:** {self.dashboard_analysis.get('temperature_status', 'normal').title()}\n"
                result_msg += f"**Fuel:** {self.dashboard_analysis.get('fuel_level', 'adequate').title()}\n\n"
                result_msg += "Now let me create your complete diagnosis..."
            
            time.sleep(1)
            
            # Add scenario-specific symptoms
            scenario_data = PREDEFINED_SCENARIOS[self.detected_scenario]
            self.symptoms.update(scenario_data["symptoms_mapping"])
            
            return {
                "message": result_msg,
                "stage": "image_analyzed",
                "dashboard_analysis": self.dashboard_analysis,
                "next_action": "create_diagnosis",
                "show_typing_indicator": True,
                "processing_duration": 2
            }
            
        except Exception as e:
            print(f"❌ Image analysis error: {e}")
            
            # Fallback - still create diagnosis
            scenario_data = PREDEFINED_SCENARIOS[self.detected_scenario]
            self.symptoms.update(scenario_data["symptoms_mapping"])
            
            return {
                "message": "I had trouble analyzing the image, but I have enough information to diagnose the issue.\n\nLet me create your diagnosis...",
                "stage": "image_analysis_failed",
                "next_action": "create_diagnosis",
                "show_typing_indicator": True,
                "processing_duration": 2
            }
    
    def create_diagnosis(self) -> dict:
        """Create comprehensive diagnosis with progressive display"""
        print("\n🔍 Creating comprehensive diagnosis...")
        time.sleep(2)
        
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
                "dashboard_analysis": self.dashboard_analysis,
                "causes": fault_info.get('causes', [])
            },
            "show_typing_indicator": False
        }
    
    def _format_diagnosis_card(self, fault_info, drivability, parts, repair_time) -> str:
        """Format diagnosis as comprehensive card"""
        
        severity_emoji = {
            "Minor": "🟢",
            "Moderate": "🟡",
            "Major": "🔴"
        }
        
        # Header based on severity
        if fault_info['severity'] == "Major":
            header = "🚨 CRITICAL DIAGNOSIS RESULT"
        else:
            header = "🔍 DIAGNOSIS COMPLETE"
        
        card = f"""
┌{'─'*50}┐
│  {header:<48}│
├{'─'*50}┤
│                                                  │
│ 🚗 Vehicle Details:                              │
│  • Model: {self.vehicle_info['model']:<37}│
│  • Model Year: {self.vehicle_info['year']:<33}│
│  • Mileage: {self.vehicle_info['mileage']:,} km{' '*(37-len(f"{self.vehicle_info['mileage']:,} km"))}│
│  • Transmission: {self.vehicle_info['transmission']:<30}│"""
        
        if self.user_location:
            card += f"\n│  • Current Location: Near {self.user_location:<22}│"
        
        card += f"""
│                                                  │
│ ⚠️ Fault Information:                            │
│  • Fault Category: {self.detected_category.upper():<30}│
│  • Fault Type: {fault_info['fault_name'][:38]:<38}│
│  • Severity: {severity_emoji.get(fault_info['severity'], '⚠️')} {fault_info['severity'].upper():<37}│
│                                                  │
│ 📋 Symptoms Detected:                            │"""

        # Add confirmed symptoms (max 6)
        symptoms_to_show = [k for k, v in self.symptoms.items() if v][:6]
        if not symptoms_to_show:
            card += f"\n│  ✓ {'Issue detected and analyzed':<44}│"
        else:
            for symptom_key in symptoms_to_show:
                display_name = symptom_key.replace('_', ' ').title()
                card += f"\n│  ✓ {display_name[:44]:<44}│"
        
        card += f"""
│                                                  │
│ 🚦 Drivability Assessment:                       │
│  {'🛑 NOT DRIVABLE' if not drivability['is_drivable'] else '✅ DRIVABLE WITH CAUTION':<48}│"""

        # Add condition if critical
        if fault_info['severity'] == "Major" and not drivability['is_drivable']:
            card += f"\n│  • Condition: EMERGENCY{' '*27}│"
        
        card += f"""
│                                                  │"""

        # Safety instructions
        instruction_header = "⚠️ Immediate Safety Instructions:" if not drivability['is_drivable'] else "✓ Safety Instructions:"
        card += f"""
│ {instruction_header:<48}│"""
        
        for instruction in drivability['instructions'][:5]:
            # Wrap long instructions
            if len(instruction) > 44:
                card += f"\n│  • {instruction[:42]:<42}│"
                remaining = instruction[42:]
                while remaining:
                    card += f"\n│    {remaining[:44]:<44}│"
                    remaining = remaining[44:]
            else:
                card += f"\n│  • {instruction[:44]:<44}│"
        
        # Causes (if Major fault)
        if fault_info.get('causes') and fault_info['severity'] == "Major":
            card += f"""
│                                                  │
│ 🔍 Likely Causes:                                │"""
            for cause in fault_info['causes'][:4]:
                if len(cause) > 44:
                    card += f"\n│  • {cause[:42]:<42}│"
                    card += f"\n│    {cause[42:86]:<44}│"
                else:
                    card += f"\n│  • {cause[:44]:<44}│"
        
        # Parts required
        if parts:
            card += f"""
│                                                  │
│ 🧩 Parts Required:                               │"""
            for part in parts[:5]:
                card += f"\n│  • {part[:44]:<44}│"
        
        # Urgency and time
        card += f"""
│                                                  │
│ ⚡ Urgency Level: {drivability['urgency'].upper():<30}│
│                                                  │
│ ⏱ Estimated Repair Time:                         │
│  {repair_time:<48}│
│  (Based on ML prediction model){' '*19}│
│                                                  │"""

        # Action button
        if drivability['is_drivable']:
            card += f"""
│  [Find Nearby Garages →]                         │"""
        else:
            card += f"""
│  [Request Roadside Mechanic →]                   │"""
        
        card += f"""
│                                                  │
└{'─'*50}┘
"""
        
        return card
    
    def _handle_general_query(self, user_message: str) -> dict:
        """Handle queries that don't match predefined scenarios"""
        
        # Use AI to extract category
        extraction = self._ai_extract_category(user_message)
        
        if extraction.get("category"):
            self.detected_category = extraction["category"]
            return {
                "message": f"I understand you're experiencing a {self.detected_category.lower()} issue. Let me ask you some questions to diagnose this properly.\n\nHave you parked the car now? Are you safe?",
                "stage": "questioning",
                "buttons": ["Yes, I'm safe", "No, still driving"]
            }
        
        return {
            "message": "Could you describe the issue in more detail? For example:\n- Is it a brake problem?\n- Engine issue?\n- Electrical problem?\n- Something else?",
            "stage": "clarification"
        }
    
    def _ai_extract_category(self, user_message: str) -> dict:
        """Extract category using AI"""
        prompt = f"""Analyze this vehicle issue and return JSON:
{{"category": "Engine/Brake/Electrical/Transmission/Suspension/AC", "keywords": ["key", "words"]}}

Message: "{user_message}"

Return only valid JSON."""

        try:
            response = chat_model.generate_content(prompt)
            response_text = response.text.strip()
            response_text = re.sub(r'```json\n?', '', response_text)
            response_text = re.sub(r'```\n?', '', response_text)
            return json.loads(response_text)
        except:
            return {}


# ============================================
# INTERACTIVE TEST
# ============================================

if __name__ == "__main__":
    print("="*70)
    print("🚗 SUZUKI ALTO ENHANCED CHATBOT - User Friendly Version")
    print("="*70)
    print("\nTest Case Options:")
    print("1. Type: 'My brakes are making grinding noises when I press them'")
    print("2. Type: 'My car is overheating and stopped running near Malabe'")
    print("3. Or describe your own issue")
    print("="*70)
    
    bot = EnhancedChatbot()
    
    # Start conversation
    response = bot.start_conversation("Kavindu")
    print(f"\n🤖: {response['message']}")
    
    # Main loop
    while True:
        try:
            user_input = input("\n👤: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("\n🤖: Drive safely! Goodbye.")
                break
            
            if not user_input:
                continue
            
            # Process message
            result = bot.process_message(user_input)
            
            # Show typing indicator if needed
            if result.get('show_typing_indicator'):
                print("\n🤖: [Thinking...]", end='', flush=True)
                time.sleep(result.get('processing_duration', 1))
                print("\r" + " "*50 + "\r", end='')
            
            # Display response
            print(f"\n🤖: {result['message']}")
            
            # Show buttons if present
            if result.get('buttons'):
                print("\nOptions:")
                for i, button in enumerate(result['buttons'], 1):
                    print(f"  {i}. {button}")
            
            # Handle image upload
            if result.get('action') == 'upload_image':
                user_input = input("\n👤: [Type 'upload' to simulate image upload]: ").strip()
                if user_input.lower() == 'upload':
                    print("   📤 Uploading image...")
                    time.sleep(1)
                    result = bot.process_message("", image_data="simulated_image_data")
                    print(f"\n🤖: {result['message']}")
            
            # Create diagnosis if ready
            if result.get('next_action') == 'create_diagnosis':
                time.sleep(2)
                diagnosis_result = bot.create_diagnosis()
                print(f"\n{diagnosis_result['message']}")
                break
            
            # End if diagnosis complete
            if result.get('stage') == 'diagnosis_complete':
                break
                
        except KeyboardInterrupt:
            print("\n\n🤖: Interrupted. Drive safely!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
            break
    
    print("\n" + "="*70)
    print("✅ Session Complete")
    print("="*70)