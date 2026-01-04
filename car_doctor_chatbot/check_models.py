# check_models.py
import google.generativeai as genai
import os

# --- PASTE YOUR API KEY HERE ---
GEMINI_API_KEY = "AIzaSyC_ivC6pXf1Hamzgc6OvF-VxHgbEXqQjqE" 
genai.configure(api_key=GEMINI_API_KEY)

print("🔍 Searching for available models for your API key...")
print("="*50)

try:
    available_models = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ FOUND: {m.name}")
            available_models.append(m.name)
            
    if not available_models:
        print("❌ No text generation models found. Check your API key permissions.")
    else:
        print("="*50)
        print(f"👉 RECOMMENDATION: Open intelligent_chatbot.py and change line 20 to:")
        # We strip the 'models/' prefix for the client code usually
        clean_name = available_models[0].replace("models/", "")
        print(f"chat_model = genai.GenerativeModel('{clean_name}')")

except Exception as e:
    print(f"❌ CONNECTION ERROR: {e}")