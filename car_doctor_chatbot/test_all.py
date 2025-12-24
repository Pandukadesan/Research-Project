# test_all.py - Comprehensive testing

from vision_chatbot import FinalChatbot

def test_scenario(name, messages, expected_category):
    """Test a complete scenario"""
    print(f"\n{'='*70}")
    print(f"🧪 TEST: {name}")
    print(f"{'='*70}")
    
    bot = FinalChatbot()
    bot.start_conversation("TestUser")
    
    for msg in messages:
        print(f"\n👤: {msg}")
        result = bot.process_message(msg)
        print(f"🤖: {result['bot_message'][:100]}...")  # Show first 100 chars
        
        if result.get('stage') == 'diagnosis_complete':
            diagnosis = result['diagnosis']
            
            # Check if correct
            if diagnosis['fault_category'] == expected_category:
                print(f"\n✅ PASS - Correctly identified {expected_category}")
            else:
                print(f"\n❌ FAIL - Expected {expected_category}, got {diagnosis['fault_category']}")
            
            return diagnosis['fault_category'] == expected_category
    
    print("\n❌ FAIL - Diagnosis not completed")
    return False

# Run tests
if __name__ == "__main__":
    print("="*70)
    print("🧪 COMPREHENSIVE CHATBOT TESTING")
    print("="*70)
    
    tests = [
        {
            "name": "Engine Overheating",
            "messages": [
                "My car is overheating",
                "Yes, temperature light is red",
                "Yes, there's steam",
                "Yes, coolant leaking",
                "Yes, engine stopped"
            ],
            "expected": "Engine"
        },
        {
            "name": "Battery Dead",
            "messages": [
                "Car won't start",
                "No, engine doesn't crank",
                "No, dashboard lights are off"
            ],
            "expected": "Electrical"
        },
        {
            "name": "Brake Squealing",
            "messages": [
                "Brakes are squealing",
                "No, brake light is off",
                "Yes, squealing noise when braking"
            ],
            "expected": "Brake"
        }
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test_scenario(test["name"], test["messages"], test["expected"]):
            passed += 1
        input("\nPress Enter to continue...")
    
    print(f"\n{'='*70}")
    print(f"📊 RESULTS: {passed}/{total} tests passed ({passed/total*100:.0f}%)")
    print(f"={'='*70}")