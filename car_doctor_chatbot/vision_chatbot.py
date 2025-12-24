# vision_chatbot.py - FINAL COMPLETE CHATBOT WITH VISION

import google.generativeai as genai
from chatbot_core import DiagnosticChatbot
from knowledge_base import WARNING_LIGHTS
from PIL import Image
import json

# ============================================
# CONFIGURATION
# ============================================

GEMINI_API_KEY = "AIzaSyC_ivC6pXf1Hamzgc6OvF-VxHgbEXqQjqE"  # ← PUT YOUR KEY HERE
genai.configure(api_key=GEMINI_API_KEY)

vision_model = genai.GenerativeModel('gemini-flash-latest')

#s ============================================
# FINAL CHATBOT CLASS
# ============================================

class FinalChatbot(DiagnosticChatbot):
    """
    Complete production chatbot with vision capability
    """
    
    def __init__(self):
        super().__init__()
        self.vision_model = vision_model
        self.dashboard_analyzed = False
        self.warning_lights_detected = []
    
    def analyze_dashboard_image(self, image_path: str) -> dict:
        """
        Analyze dashboard photo and detect warning lights
        
        Args:
            image_path: Path to dashboard image file
        
        Returns:
            {
                "success": True/False,
                "warning_lights": [list of detected lights],
                "summary": "Text summary"
            }
        """
        print("\n📷 Analyzing dashboard image...")
        
        try:
            # Load image
            img = Image.open(image_path)
            
            # Create vision prompt
            vision_prompt = """Analyze this Suzuki Alto dashboard image.

IDENTIFY all warning lights that are ON (illuminated/lit).

Common Suzuki Alto warning lights:
- Temperature Warning (red thermometer symbol)
- Check Engine Light (yellow/orange engine symbol)
- Battery Warning (red battery symbol)
- Brake Warning (red BRAKE text or circle with !)
- Oil Pressure Warning (red oil can symbol)
- ABS Warning (yellow ABS text)

Respond in this JSON format:
{
  "warning_lights": [
    {
      "name": "Temperature Warning",
      "color": "Red"
    }
  ]
}

Respond with ONLY JSON, nothing else."""

            # Send to Gemini Vision
            response = self.vision_model.generate_content([vision_prompt, img])
            result_text = response.text.strip()
            
            # Clean JSON
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0].strip()
            
            result = json.loads(result_text)
            
            self.warning_lights_detected = result.get('warning_lights', [])
            self.dashboard_analyzed = True
            
            # Create summary
            summary = self._create_warning_summary()
            
            print(f"✓ Detected {len(self.warning_lights_detected)} warning lights")
            
            return {
                "success": True,
                "warning_lights": self.warning_lights_detected,
                "summary": summary
            }
            
        except Exception as e:
            print(f"❌ Image analysis error: {e}")
            return {
                "success": False,
                "error": str(e),
                "summary": "I had trouble reading the image. Could you describe which warning lights are ON?"
            }
    
    def _create_warning_summary(self) -> str:
        """Create human-readable summary of detected lights"""
        if not self.warning_lights_detected:
            return "✓ I can see your dashboard. No critical warning lights detected."
        
        summary = "📊 **Dashboard Analysis Complete**\n\n"
        summary += "⚠️ **Warning Lights Detected:**\n\n"
        
        for light in self.warning_lights_detected:
            name = light['name']
            color = light.get('color', 'Unknown')
            
            # Get info from knowledge base
            if name in WARNING_LIGHTS:
                info = WARNING_LIGHTS[name]
                icon = "🔴" if color == "Red" else "🟡"
                summary += f"{icon} **{name}** ({color})\n"
                summary += f"   Meaning: {info['meaning']}\n"
                summary += f"   Severity: {info['severity']}\n\n"
            else:
                summary += f"• **{name}** ({color})\n\n"
        
        summary += "Thanks for the photo 👍 This helps me understand better.\n"
        
        return summary
    
    def process_with_image(self, user_message: str, image_path: str) -> dict:
        """
        Process message with dashboard image
        
        Usage:
            result = bot.process_with_image("Here's my dashboard", "./dashboard.jpg")
        """
        # Analyze image
        image_result = self.analyze_dashboard_image(image_path)
        
        if not image_result['success']:
            return {
                "bot_message": image_result['summary'],
                "stage": "image_error",
                "detected_category": self.detected_category,
                "diagnosis": None
            }
        
        # Update category based on detected lights
        if not self.detected_category and self.warning_lights_detected:
            # Determine category from warning lights
            for light in self.warning_lights_detected:
                if light['name'] in WARNING_LIGHTS:
                    self.detected_category = WARNING_LIGHTS[light['name']]['category']
                    print(f"🎯 Category from dashboard: {self.detected_category}")
                    
                    # Load questions for this category
                    from knowledge_base import get_questions_for_category
                    self.questions_to_ask = get_questions_for_category(self.detected_category)
                    break
        
        # Return summary + next question
        next_q = self._ask_next_question()
        
        bot_message = image_result['summary'] + "\n\n" + next_q['bot_message']
        
        return {
            "bot_message": bot_message,
            "stage": "questioning",
            "detected_category": self.detected_category,
            "diagnosis": None,
            "warning_lights": self.warning_lights_detected
        }

# ============================================
# INTERACTIVE MODE
# ============================================

def run_interactive():
    """Run interactive chatbot"""
    print("="*70)
    print("🚗 SUZUKI ALTO AI VEHICLE DOCTOR")
    print("="*70)
    print("\nCommands:")
    print("  - Type normally to chat")
    print("  - Type 'upload:path/to/image.jpg' to upload dashboard photo")
    print("  - Type 'quit' to exit")
    print("\n" + "="*70)
    
    user_name = input("\nWhat's your name? ").strip() or "there"
    
    bot = FinalChatbot()
    greeting = bot.start_conversation(user_name)
    
    print(f"\n🤖: {greeting}")
    
    while True:
        user_input = input(f"\n👤 {user_name}: ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'q']:
            print("\n👋 Stay safe! Drive carefully!")
            break
        
        if not user_input:
            continue
        
        # Check for image upload
        if user_input.lower().startswith('upload:'):
            image_path = user_input.split('upload:')[1].strip()
            result = bot.process_with_image("Dashboard photo", image_path)
        else:
            result = bot.process_message(user_input)
        
        print(f"\n🤖: {result['bot_message']}")
        
        # Check if diagnosis complete
        if result.get('stage') == 'diagnosis_complete':
            diagnosis = result['diagnosis']
            
            print("\n" + "="*70)
            print("📋 SUMMARY")
            print("="*70)
            print(f"Category: {diagnosis['fault_category']}")
            print(f"Type: {diagnosis['fault_type']}")
            print(f"Severity: {diagnosis['severity']}")
            print(f"Drivable: {'No - Call mechanic' if not diagnosis['is_safe_to_drive'] else 'Yes - Drive to garage'}")
            print("="*70)
            
            again = input("\nStart new diagnosis? (y/n): ")
            if again.lower() != 'y':
                break
            
            bot = FinalChatbot()
            greeting = bot.start_conversation(user_name)
            print(f"\n🤖: {greeting}")

# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    run_interactive()