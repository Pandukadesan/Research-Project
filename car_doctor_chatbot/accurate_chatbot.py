# accurate_chatbot.py - FINAL PRODUCTION CHATBOT

from accurate_knowledge_base import (
    SUZUKI_ALTO_FAULTS,
    get_fault_by_symptoms,
    assess_drivability
)
import google.generativeai as genai

# CONFIGURATION
# ============================================

GEMINI_API_KEY = "AIzaSyC_ivC6pXf1Hamzgc6OvF-VxHgbEXqQjqE"  # ← PUT YOUR KEY HERE
genai.configure(api_key=GEMINI_API_KEY)
vision_model = genai.GenerativeModel('gemini-flash-latest')

# ============================================
# QUESTION FLOWS (COMPLETE & ACCURATE)
# ============================================

QUESTION_FLOWS = {
    "Engine": [
        {
            "id": "temp_warning",
            "text": "👉 Is the temperature warning light ON on your dashboard?",
            "symptom_map": {"yes": "temp_warning_on", "no": "temp_warning_off"}
        },
        {
            "id": "engine_running",
            "text": "👉 Is the engine still running right now?",
            "symptom_map": {"yes": "engine_running", "no": "engine_stopped", "stopped": "engine_stopped", "turned off": "engine_stopped"}
        },
        {
            "id": "steam",
            "text": "👉 Do you see any steam or smoke coming from the bonnet?",
            "symptom_map": {"yes": "steam", "no": "no_steam"}
        },
        {
            "id": "coolant_leak",
            "text": "👉 Can you see coolant or water leaking under the car?",
            "symptom_map": {"yes": "coolant_leak_large", "a little": "coolant_leak_small", "no": "no_leak"}
        },
        {
            "id": "check_engine",
            "text": "👉 Is the check engine light ON?",
            "symptom_map": {"yes": "check_engine_light", "no": "no_check_engine"}
        },
        {
            "id": "shaking",
            "text": "👉 Is the engine shaking or vibrating?",
            "symptom_map": {"yes": "shaking", "no": "no_shaking"}
        }
    ],
    
    "Electrical": [
        {
            "id": "crank",
            "text": "👉 When you turn the key, does the engine try to crank (make turning sounds)?",
            "symptom_map": {"yes": "engine_cranks", "no": "no_crank"}
        },
        {
            "id": "dashboard_lights",
            "text": "👉 Are the dashboard lights turning on?",
            "symptom_map": {"yes": "lights_on", "no": "no_lights"}
        },
        {
            "id": "dim_lights",
            "text": "👉 Are the headlights or dashboard lights looking dim or weak?",
            "symptom_map": {"yes": "lights_dim", "no": "lights_normal"}
        },
        {
            "id": "battery_light",
            "text": "👉 Is the battery warning light ON?",
            "symptom_map": {"yes": "battery_light_on", "no": "battery_light_off"}
        }
    ],
    
    "Brake": [
        {
            "id": "brake_warning",
            "text": "👉 Is the brake warning light ON?",
            "symptom_map": {"yes": "brake_warning_light", "no": "no_brake_warning"}
        },
        {
            "id": "pedal_feel",
            "text": "👉 How does the brake pedal feel? (Normal / Soft and spongy / Hard)",
            "symptom_map": {"soft": "soft_pedal", "spongy": "soft_pedal", "normal": "pedal_normal", "hard": "hard_pedal"}
        },
        {
            "id": "brake_noise",
            "text": "👉 Do you hear any noise when braking? (Squealing / Grinding / No noise)",
            "symptom_map": {"squealing": "squealing_light", "grinding": "grinding_noise", "no": "no_noise"}
        },
        {
            "id": "brake_works",
            "text": "👉 Do the brakes still work (car stops)?",
            "symptom_map": {"yes": "brake_works", "no": "brake_not_working"}
        }
    ],
    
    "Transmission": [
        {
            "id": "gear_difficulty",
            "text": "👉 Is it difficult to change gears?",
            "symptom_map": {"yes": "difficult_shifting", "no": "shifts_normal"}
        },
        {
            "id": "grinding",
            "text": "👉 Do you hear grinding when changing gears?",
            "symptom_map": {"yes": "grinding_changing", "no": "no_grinding"}
        },
        {
            "id": "clutch_engagement",
            "text": "👉 Does the engine rev (RPM goes up) but the car doesn't move much?",
            "symptom_map": {"yes": "engine_revs_no_movement", "no": "movement_normal"}
        },
        {
            "id": "gears_engage",
            "text": "👉 Can you still change gears even if difficult?",
            "symptom_map": {"yes": "gears_eventually_engage", "no": "no_gear_engagement"}
        }
    ],
    
    "Suspension": [
        {
            "id": "vibration",
            "text": "👉 Does the steering wheel vibrate while driving?",
            "symptom_map": {"yes": "steering_vibration", "no": "no_vibration"}
        },
        {
            "id": "vibration_speed",
            "text": "👉 Is the vibration worse at high speeds (above 60 km/h)?",
            "symptom_map": {"yes": "high_speed_vibration", "no": "low_speed_vibration"}
        },
        {
            "id": "clunking",
            "text": "👉 Do you hear clunking or knocking sounds over bumps?",
            "symptom_map": {"yes": "clunking_bumps", "no": "no_clunking"}
        }
    ],
    
    "AC": [
        {
            "id": "ac_blowing",
            "text": "👉 Is the AC blowing air?",
            "symptom_map": {"yes": "ac_blowing", "no": "ac_not_blowing"}
        },
        {
            "id": "air_temp",
            "text": "👉 Is the air coming out warm or cold?",
            "symptom_map": {"warm": "blows_warm", "cold": "blows_cold", "slightly cold": "cooling_weak"}
        },
        {
            "id": "ac_noise",
            "text": "👉 Do you hear any clicking or rattling when AC is ON?",
            "symptom_map": {"yes": "clicking_sometimes", "no": "no_ac_noise"}
        }
    ],
    
    "Body": [
        {
            "id": "component",
            "text": "👉 Which part has the issue? (Door / Window / Mirror / Lights)",
            "symptom_map": {"door": "door_issue", "window": "window_stuck", "mirror": "mirror_broken", "lights": "light_issue"}
        }
    ]
}

# ============================================
# ACCURATE CHATBOT
# ============================================

class AccurateChatbot:
    """Production chatbot with accurate drivability assessment"""
    
    def __init__(self):
        self.user_name = None
        self.detected_category = None
        self.current_question_index = 0
        self.questions_to_ask = []
        self.symptoms = {}
        self.conversation_history = []
        self.diagnosis_complete = False
    
    def start_conversation(self, user_name: str = "there"):
        """Start conversation"""
        self.user_name = user_name
        greeting = f"Hi {user_name} 👋 I'm here to help. Stay calm — we'll sort this out together.\n\n👉 Can you tell me what's happening with your Suzuki Alto right now?"
        
        self.conversation_history.append({"role": "bot", "message": greeting})
        return greeting
    
    def _detect_category(self, message: str) -> str:
        """Detect category from message"""
        message_lower = message.lower()
        
        for category, data in SUZUKI_ALTO_FAULTS.items():
            for keyword in data["keywords"]:
                if keyword in message_lower:
                    return category
        return None
    
    def process_message(self, user_message: str) -> dict:
        """Process user message"""
        self.conversation_history.append({"role": "user", "message": user_message})
        
        # Detect category if not detected
        if not self.detected_category:
            self.detected_category = self._detect_category(user_message)
            
            if self.detected_category:
                print(f"🎯 Detected: {self.detected_category}")
                self.questions_to_ask = QUESTION_FLOWS.get(self.detected_category, [])
                return self._ask_next_question()
            else:
                return {
                    "bot_message": "Could you describe the main problem? (For example: car won't start, overheating, brakes squealing)",
                    "stage": "clarification"
                }
        
        # Extract symptoms from answer
        self._extract_symptoms_from_answer(user_message)
        
        # Check if can diagnose
        if self._can_diagnose():
            return self._create_accurate_diagnosis()
        
        # Ask next question
        return self._ask_next_question()
    
    def _extract_symptoms_from_answer(self, answer: str):
        """Extract symptoms from user's answer"""
        if self.current_question_index == 0:
            return
        
        answer_lower = answer.lower()
        
        # Get previous question
        prev_question = self.questions_to_ask[self.current_question_index - 1]
        symptom_map = prev_question.get("symptom_map", {})
        
        # Map answer to symptom
        for key, symptom in symptom_map.items():
            if key in answer_lower:
                self.symptoms[symptom] = True
                print(f"📝 Extracted: {symptom}")
                break
    
    def _can_diagnose(self) -> bool:
        """Check if enough info collected"""
        if not self.detected_category:
            return False
        
        # Need at least 3 symptoms
        symptom_count = len(self.symptoms)
        
        # Critical combinations allow early diagnosis
        critical_combos = [
            {"engine_stopped", "steam", "coolant_leak_large"},
            {"soft_pedal", "brake_fluid_leak"},
            {"no_crank", "no_lights"},
            {"no_gear_engagement", "engine_revs_no_movement"}
        ]
        
        symptoms_set = set(self.symptoms.keys())
        for combo in critical_combos:
            if combo.issubset(symptoms_set):
                return True
        
        return symptom_count >= 3
    
    def _ask_next_question(self) -> dict:
        """Ask next question"""
        if self.current_question_index < len(self.questions_to_ask):
            question = self.questions_to_ask[self.current_question_index]
            self.current_question_index += 1
            
            # Add acknowledgment
            ack = ""
            if self.current_question_index > 1:
                acks = ["Got it 👍", "Okay, thanks", "Understood", "Alright"]
                import random
                ack = random.choice(acks) + "\n\n"
            
            bot_message = ack + question["text"]
            
            self.conversation_history.append({"role": "bot", "message": bot_message})
            
            return {
                "bot_message": bot_message,
                "stage": "questioning",
                "detected_category": self.detected_category
            }
        else:
            return {
                "bot_message": "👉 Is there anything else you've noticed?",
                "stage": "questioning"
            }
    
    def _create_accurate_diagnosis(self) -> dict:
        """Create accurate diagnosis using knowledge base"""
        print("\n🔍 Creating diagnosis...")
        
        # Get fault details from knowledge base
        fault_info = get_fault_by_symptoms(self.detected_category, self.symptoms)
        
        # Get drivability assessment
        drivability = assess_drivability(self.symptoms, self.detected_category)
        
        # Create diagnosis message
        diagnosis_msg = f"""
✅ **DIAGNOSIS COMPLETE**

🔧 **Fault Category:** {self.detected_category}
🔍 **Fault Type:** {fault_info['fault_name']}
⚠️  **Severity:** {fault_info['severity']}

{'🚫 **NOT SAFE TO DRIVE**' if not drivability['is_drivable'] else '✅ **Safe to drive to garage**'}

📊 **Assessment:** {drivability['reason']}

⚠️ **Instructions:**
"""
        
        for instruction in drivability['instructions']:
            diagnosis_msg += f"\n   • {instruction}"
        
        self.diagnosis_complete = True
        
        diagnosis_data = {
            "fault_category": self.detected_category,
            "fault_type": fault_info['fault_name'],
            "severity": fault_info['severity'],
            "is_safe_to_drive": drivability['is_drivable'],
            "urgency": drivability['urgency'],
            "reason": drivability['reason'],
            "symptoms": self.symptoms
        }
        
        return {
            "bot_message": diagnosis_msg,
            "stage": "diagnosis_complete",
            "diagnosis": diagnosis_data
        }

# ============================================
# TESTING WITH YOUR SCENARIOS
# ============================================

def test_scenario(name, initial_msg, answers, expected_category, expected_drivable):
    """Test a specific scenario"""
    print("="*70)
    print(f"🧪 TEST: {name}")
    print("="*70)
    
    bot = AccurateChatbot()
    greeting = bot.start_conversation("TestUser")
    print(f"\n🤖: {greeting}")
    
    # Send initial message
    print(f"\n👤: {initial_msg}")
    result = bot.process_message(initial_msg)
    
    # Answer questions
    for i, answer in enumerate(answers):
        if result.get('stage') == 'diagnosis_complete':
            break
        
        print(f"\n🤖: {result['bot_message']}")
        print(f"\n👤: {answer}")
        result = bot.process_message(answer)
    
    # Check final diagnosis
    if result.get('stage') == 'diagnosis_complete':
        print(f"\n🤖: {result['bot_message']}")
        
        diagnosis = result['diagnosis']
        
        category_correct = diagnosis['fault_category'] == expected_category
        drivable_correct = diagnosis['is_safe_to_drive'] == expected_drivable
        
        print("\n" + "="*70)
        if category_correct and drivable_correct:
            print("✅ TEST PASSED")
        else:
            print("❌ TEST FAILED")
            if not category_correct:
                print(f"   Expected category: {expected_category}, Got: {diagnosis['fault_category']}")
            if not drivable_correct:
                print(f"   Expected drivable: {expected_drivable}, Got: {diagnosis['is_safe_to_drive']}")
        
        print(f"\n📋 Category: {diagnosis['fault_category']}")
        print(f"⚠️  Severity: {diagnosis['severity']}")
        print(f"🚗 Drivable: {diagnosis['is_safe_to_drive']}")
        print(f"⏰ Urgency: {diagnosis['urgency']}")
        print("="*70)
        
        return category_correct and drivable_correct
    else:
        print("\n❌ TEST FAILED: No diagnosis provided")
        return False

# ============================================
# RUN YOUR TEST SCENARIOS
# ============================================

def run_all_tests():
    """Run all your test scenarios"""
    print("\n🚀 RUNNING COMPREHENSIVE TESTS\n")
    
    tests = [
        {
            "name": "Engine Moderate (Misfiring) - DRIVABLE",
            "initial": "My check engine light is on and the car is shaking a bit",
            "answers": ["No", "Yes", "No", "Yes"],
            "expected_category": "Engine",
            "expected_drivable": True
        },
        {
            "name": "Electrical Moderate (Alternator) - DRIVABLE",
            "initial": "My headlights are dim and the battery light flickered",
            "answers": ["Yes", "Yes", "Yes", "Yes"],
            "expected_category": "Electrical",
            "expected_drivable": True
        },
        {
            "name": "Brake Minor (Squealing) - DRIVABLE",
            "initial": "I hear a loud squealing noise when I brake",
            "answers": ["No", "Normal", "Squealing", "Yes"],
            "expected_category": "Brake",
            "expected_drivable": True
        },
        {
            "name": "Engine Major (Overheating) - NOT DRIVABLE",
            "initial": "My car is overheating",
            "answers": ["Yes", "No", "Yes", "Yes"],
            "expected_category": "Engine",
            "expected_drivable": False
        }
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test_scenario(
            test["name"],
            test["initial"],
            test["answers"],
            test["expected_category"],
            test["expected_drivable"]
        ):
            passed += 1
        
        input("\nPress Enter for next test...")
    
    print(f"\n{'='*70}")
    print(f"📊 FINAL RESULTS: {passed}/{total} tests passed ({passed/total*100:.0f}%)")
    print(f"{'='*70}")

# ============================================
# INTERACTIVE MODE
# ============================================

def run_interactive():
    """Interactive chatbot"""
    print("="*70)
    print("🚗 SUZUKI ALTO ACCURATE DIAGNOSTIC CHATBOT")
    print("="*70)
    
    user_name = input("\nWhat's your name? ").strip() or "there"
    
    bot = AccurateChatbot()
    greeting = bot.start_conversation(user_name)
    
    print(f"\n🤖: {greeting}")
    
    while True:
        user_input = input(f"\n👤 {user_name}: ").strip()
        
        if user_input.lower() in ['quit', 'exit']:
            print("\n👋 Stay safe!")
            break
        
        if not user_input:
            continue
        
        result = bot.process_message(user_input)
        print(f"\n🤖: {result['bot_message']}")
        
        if result.get('stage') == 'diagnosis_complete':
            again = input("\nStart new diagnosis? (y/n): ")
            if again.lower() != 'y':
                break
            bot = AccurateChatbot()
            greeting = bot.start_conversation(user_name)
            print(f"\n🤖: {greeting}")

# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    print("\nSelect mode:")
    print("1. Run test scenarios")
    print("2. Interactive mode")
    
    choice = input("\nChoice (1-2): ").strip()
    
    if choice == "1":
        run_all_tests()
    elif choice == "2":
        run_interactive()