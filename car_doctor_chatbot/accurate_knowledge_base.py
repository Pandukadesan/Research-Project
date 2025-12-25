# accurate_knowledge_base.py - Suzuki Alto Specific (2010-2025)

# ============================================
# SUZUKI ALTO FAULT DATABASE (2010-2025)
# ============================================

SUZUKI_ALTO_FAULTS = {
    "Engine": {
        "keywords": ["overheating", "steam", "temperature", "coolant", "knocking", 
                     "shaking", "power", "misfiring", "check engine", "smoke"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Oil leak (Gasket)",
                    "symptoms": ["oil_spot_ground", "oil_smell"],
                    "drivable": True,
                    "reason": "Engine runs fine, just leaking slowly"
                },
                {
                    "name": "Spark plug worn",
                    "symptoms": ["slight_misfire", "check_engine_light"],
                    "drivable": True,
                    "reason": "Engine still runs, just rough idle"
                },
                {
                    "name": "Air filter clogged",
                    "symptoms": ["power_loss_gradual"],
                    "drivable": True,
                    "reason": "Reduced performance but car drives"
                },
                {
                    "name": "Throttle body dirty",
                    "symptoms": ["rough_idle", "hesitation"],
                    "drivable": True,
                    "reason": "Car drives, just not smoothly"
                }
            ],
            
            "Moderate": [
                {
                    "name": "Engine misfiring",
                    "symptoms": ["check_engine_light", "shaking", "engine_running"],
                    "drivable": True,
                    "reason": "Engine running despite misfire - can drive carefully"
                },
                {
                    "name": "Coolant leak (small)",
                    "symptoms": ["coolant_leak_small", "temp_normal", "engine_running"],
                    "drivable": True,
                    "reason": "Leak is small, engine not overheating yet"
                },
                {
                    "name": "Crankshaft sensor issue",
                    "symptoms": ["stalling", "hard_start", "check_engine_light"],
                    "drivable": True,
                    "reason": "May stall but restarts - drive to garage carefully"
                },
                {
                    "name": "High fuel consumption",
                    "symptoms": ["check_engine_light", "poor_mileage"],
                    "drivable": True,
                    "reason": "Engine works, just inefficient"
                }
            ],
            
            "Major": [
                {
                    "name": "Severe overheating - Radiator failure",
                    "symptoms": ["temp_light_red", "steam", "coolant_leak_large", "engine_stopped"],
                    "drivable": False,
                    "reason": "Engine stopped due to overheating - will cause damage if driven"
                },
                {
                    "name": "Moderate overheating - Thermostat stuck",
                    "symptoms": ["temp_light_on", "temp_gauge_high", "no_steam", "engine_running"],
                    "drivable": True,
                    "reason": "Engine hot but running - can drive SHORT distance to garage with AC off"
                },
                {
                    "name": "Timing belt failure",
                    "symptoms": ["engine_stopped", "wont_start", "rattling_before_stop"],
                    "drivable": False,
                    "reason": "Engine mechanically damaged - cannot run"
                },
                {
                    "name": "Head gasket leak",
                    "symptoms": ["white_smoke", "coolant_in_oil", "engine_running"],
                    "drivable": True,
                    "reason": "Engine runs but losing coolant - drive SHORT distance only"
                },
                {
                    "name": "Water pump failure",
                    "symptoms": ["overheating", "coolant_leak_front", "engine_running"],
                    "drivable": True,
                    "reason": "Engine hot but runs - SHORT drive to garage immediately"
                }
            ]
        }
    },
    
    "Electrical": {
        "keywords": ["battery", "start", "crank", "lights", "dead", "alternator", 
                     "charging", "dashboard", "flickering"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Battery slightly weak",
                    "symptoms": ["slow_crank", "lights_dim_starting", "engine_starts"],
                    "drivable": True,
                    "reason": "Engine starts and runs - battery just weak"
                },
                {
                    "name": "Bulb blown",
                    "symptoms": ["light_not_working", "engine_fine"],
                    "drivable": True,
                    "reason": "Cosmetic issue, car functions normally"
                },
                {
                    "name": "Fuse blown",
                    "symptoms": ["component_not_working", "engine_fine"],
                    "drivable": True,
                    "reason": "One system affected, car drives"
                }
            ],
            
            "Moderate": [
                {
                    "name": "Alternator weak",
                    "symptoms": ["battery_light_on", "lights_dim_running", "engine_running"],
                    "drivable": True,
                    "reason": "Battery not charging but engine runs - drive to garage before battery dies"
                },
                {
                    "name": "Starter motor issue",
                    "symptoms": ["clicking_sound", "no_crank", "lights_on"],
                    "drivable": False,
                    "reason": "Engine won't start - need jump start or new starter"
                },
                {
                    "name": "Ignition coil failure",
                    "symptoms": ["misfire", "check_engine_light", "engine_running"],
                    "drivable": True,
                    "reason": "Engine runs on remaining cylinders"
                }
            ],
            
            "Major": [
                {
                    "name": "Battery completely dead",
                    "symptoms": ["no_crank", "no_lights", "no_dashboard"],
                    "drivable": False,
                    "reason": "No power, engine cannot start"
                },
                {
                    "name": "Alternator completely failed",
                    "symptoms": ["battery_light_on", "engine_dies_while_driving"],
                    "drivable": False,
                    "reason": "Battery drained, engine will stop soon"
                }
            ]
        }
    },
    
    "Brake": {
        "keywords": ["brake", "braking", "squealing", "grinding", "soft", "pedal", 
                     "stopping", "pulling"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Brake pad wear (early stage)",
                    "symptoms": ["squealing_light", "brake_works", "pedal_normal"],
                    "drivable": True,
                    "reason": "Brakes work, just worn pads making noise"
                },
                {
                    "name": "Brake dust buildup",
                    "symptoms": ["squeaking", "brake_works"],
                    "drivable": True,
                    "reason": "Normal braking function"
                }
            ],
            
            "Moderate": [
                {
                    "name": "Brake pad completely worn",
                    "symptoms": ["grinding_noise", "reduced_braking", "pedal_normal"],
                    "drivable": True,
                    "reason": "Brakes still work but metal-on-metal - drive SLOWLY to garage"
                },
                {
                    "name": "Brake disc warped",
                    "symptoms": ["vibration_braking", "brake_works"],
                    "drivable": True,
                    "reason": "Brakes functional, just vibration"
                },
                {
                    "name": "ABS sensor fault",
                    "symptoms": ["abs_light_on", "brake_works"],
                    "drivable": True,
                    "reason": "Normal brakes work, ABS disabled"
                }
            ],
            
            "Major": [
                {
                    "name": "Brake fluid leak",
                    "symptoms": ["soft_pedal", "brake_warning_light", "pedal_spongy"],
                    "drivable": False,
                    "reason": "Brake failure imminent - VERY DANGEROUS"
                },
                {
                    "name": "Master cylinder failure",
                    "symptoms": ["soft_pedal", "pedal_to_floor", "poor_braking"],
                    "drivable": False,
                    "reason": "Brakes barely work - UNSAFE"
                },
                {
                    "name": "Brake booster failure",
                    "symptoms": ["hard_pedal", "requires_strong_force"],
                    "drivable": True,
                    "reason": "Brakes work but need more force - drive carefully"
                }
            ]
        }
    },
    
    "Transmission": {
        "keywords": ["gear", "clutch", "slipping", "grinding", "transmission", 
                     "shift", "stuck"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Gear linkage loose",
                    "symptoms": ["sloppy_shifter", "gears_work"],
                    "drivable": True,
                    "reason": "Can still change gears"
                },
                {
                    "name": "Clutch cable adjustment needed",
                    "symptoms": ["high_biting_point", "clutch_works"],
                    "drivable": True,
                    "reason": "Clutch functions, just adjustment needed"
                }
            ],
            
            "Moderate": [
                {
                    "name": "Clutch wearing",
                    "symptoms": ["slipping_slight", "gear_changes_work"],
                    "drivable": True,
                    "reason": "Clutch still engages, just weak - avoid hills"
                },
                {
                    "name": "Gear grinding (synchro worn)",
                    "symptoms": ["grinding_changing", "gears_eventually_engage"],
                    "drivable": True,
                    "reason": "Can change gears with double-clutching"
                },
                {
                    "name": "Gearbox oil low",
                    "symptoms": ["difficult_shifting", "grinding_sometimes"],
                    "drivable": True,
                    "reason": "Gears work, just stiff shifting"
                }
            ],
            
            "Major": [
                {
                    "name": "Clutch completely failed",
                    "symptoms": ["no_gear_engagement", "engine_revs_no_movement"],
                    "drivable": False,
                    "reason": "Power not transmitted to wheels"
                },
                {
                    "name": "Reverse gear broken",
                    "symptoms": ["reverse_not_working", "forward_gears_work"],
                    "drivable": True,
                    "reason": "Can drive forward - just can't reverse"
                },
                {
                    "name": "Transmission seized",
                    "symptoms": ["stuck_in_gear", "cannot_shift"],
                    "drivable": False,
                    "reason": "Cannot change gears at all"
                }
            ]
        }
    },
    
    "Suspension": {
        "keywords": ["vibration", "clunking", "steering", "bumps", "pulling", 
                     "shaking", "noise_bumps"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Wheel alignment off",
                    "symptoms": ["pulling_one_side", "car_drives"],
                    "drivable": True,
                    "reason": "Car drives, just needs alignment"
                },
                {
                    "name": "Tire pressure low",
                    "symptoms": ["pulling", "handling_poor"],
                    "drivable": True,
                    "reason": "Inflate tires and drive"
                }
            ],
            
            "Moderate": [
                {
                    "name": "Shock absorbers worn",
                    "symptoms": ["bouncing", "poor_handling", "vibration_bumps"],
                    "drivable": True,
                    "reason": "Car drives but uncomfortable - reduce speed"
                },
                {
                    "name": "Ball joint worn",
                    "symptoms": ["clunking_bumps", "steering_loose"],
                    "drivable": True,
                    "reason": "Drive carefully to garage - avoid rough roads"
                },
                {
                    "name": "Tie rod worn",
                    "symptoms": ["steering_vibration", "wandering"],
                    "drivable": True,
                    "reason": "Can drive carefully at low speed"
                }
            ],
            
            "Major": [
                {
                    "name": "Control arm broken",
                    "symptoms": ["severe_clunk", "cannot_steer_properly"],
                    "drivable": False,
                    "reason": "Steering unsafe - dangerous"
                }
            ]
        }
    },
    
    "AC": {
        "keywords": ["ac", "air conditioning", "cooling", "warm", "cold", 
                     "blowing", "compressor"],
        
        "faults": {
            "Minor": [
                {
                    "name": "AC gas low",
                    "symptoms": ["cooling_weak", "blows_slightly_cold"],
                    "drivable": True,
                    "reason": "Comfort issue only"
                },
                {
                    "name": "AC filter clogged",
                    "symptoms": ["weak_airflow", "some_cooling"],
                    "drivable": True,
                    "reason": "AC works, just reduced flow"
                },
                {
                    "name": "AC belt loose",
                    "symptoms": ["ac_not_engaging", "squealing"],
                    "drivable": True,
                    "reason": "AC doesn't work but car drives fine"
                }
            ],
            
            "Moderate": [
                {
                    "name": "AC compressor weak",
                    "symptoms": ["warm_air", "clicking_sometimes"],
                    "drivable": True,
                    "reason": "AC doesn't work, car drives normally"
                },
                {
                    "name": "Condenser leak",
                    "symptoms": ["no_cooling", "ac_blows_warm"],
                    "drivable": True,
                    "reason": "Comfort issue, doesn't affect driving"
                }
            ],
            
            "Major": [
                {
                    "name": "AC compressor seized",
                    "symptoms": ["loud_grinding", "ac_wont_turn_on"],
                    "drivable": True,
                    "reason": "AC dead but car drives - just hot inside"
                }
            ]
        }
    },
    
    "Body": {
        "keywords": ["door", "window", "mirror", "lock", "rust", "lights", 
                     "glass", "stuck"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Window stuck",
                    "symptoms": ["window_not_moving"],
                    "drivable": True,
                    "reason": "Doesn't affect driving"
                },
                {
                    "name": "Door lock broken",
                    "symptoms": ["lock_not_working"],
                    "drivable": True,
                    "reason": "Security issue, not driving issue"
                },
                {
                    "name": "Mirror broken",
                    "symptoms": ["mirror_loose"],
                    "drivable": True,
                    "reason": "Visibility reduced but can drive"
                },
                {
                    "name": "Tail light out",
                    "symptoms": ["light_not_working"],
                    "drivable": True,
                    "reason": "Drive carefully, get fixed soon"
                }
            ]
        }
    }
}

# ============================================
# CRITICAL DRIVABILITY RULES
# ============================================

DRIVABILITY_RULES = {
    "NOT_DRIVABLE_IF": [
        {
            "condition": "Engine stopped + won't restart + steam",
            "symptoms": ["engine_stopped", "wont_start", "steam"],
            "reason": "Severe overheating - engine damage imminent"
        },
        {
            "condition": "Brake pedal soft/spongy + brake fluid leak",
            "symptoms": ["soft_pedal", "brake_fluid_leak"],
            "reason": "Brake system failure - VERY DANGEROUS"
        },
        {
            "condition": "Clutch completely failed + no movement",
            "symptoms": ["no_gear_engagement", "engine_revs_no_movement"],
            "reason": "Cannot transfer power to wheels"
        },
        {
            "condition": "Battery dead + engine won't start",
            "symptoms": ["no_crank", "no_lights", "no_dashboard"],
            "reason": "No electrical power"
        },
        {
            "condition": "Steering failure",
            "symptoms": ["cannot_steer", "control_arm_broken"],
            "reason": "Cannot control vehicle direction"
        },
        {
            "condition": "Transmission seized",
            "symptoms": ["stuck_in_gear", "cannot_shift_at_all"],
            "reason": "Cannot change gears"
        }
    ],
    
    "DRIVABLE_BUT_URGENT": [
        {
            "condition": "Overheating but engine running",
            "symptoms": ["temp_high", "engine_running", "no_steam"],
            "reason": "Can drive SHORT distance with AC off - URGENT"
        },
        {
            "condition": "Brake pads completely worn (grinding)",
            "symptoms": ["grinding_brakes", "brake_works"],
            "reason": "Brakes work but metal-on-metal - drive SLOWLY"
        },
        {
            "condition": "Alternator failed but battery has charge",
            "symptoms": ["battery_light_on", "engine_running"],
            "reason": "Battery will die soon - go to garage immediately"
        },
        {
            "condition": "Clutch slipping badly",
            "symptoms": ["clutch_slipping", "gears_still_engage"],
            "reason": "Avoid hills, drive flat roads to garage"
        }
    ],
    
    "DRIVABLE_CAREFULLY": [
        {
            "condition": "Check engine light + engine running",
            "symptoms": ["check_engine_light", "engine_running"],
            "reason": "Engine has issue but runs - get diagnosed soon"
        },
        {
            "condition": "Brake squealing but pedal normal",
            "symptoms": ["brake_noise", "pedal_normal", "brake_works"],
            "reason": "Worn pads, needs replacement but brakes work"
        },
        {
            "condition": "AC not working",
            "symptoms": ["no_cooling"],
            "reason": "Comfort issue, doesn't affect safety"
        }
    ]
}

# ============================================
# HELPER FUNCTIONS
# ============================================

def get_fault_by_symptoms(category: str, symptoms: dict) -> dict:
    """
    Match symptoms to specific fault
    
    Args:
        category: "Engine", "Brake", etc.
        symptoms: {"engine_stopped": True, "steam": True, ...}
    
    Returns:
        {
            "fault_name": "...",
            "severity": "...",
            "drivable": True/False,
            "reason": "..."
        }
    """
    if category not in SUZUKI_ALTO_FAULTS:
        return None
    
    category_data = SUZUKI_ALTO_FAULTS[category]["faults"]
    
    # Check all severities
    for severity in ["Major", "Moderate", "Minor"]:
        faults = category_data.get(severity, [])
        
        for fault in faults:
            # Count matching symptoms
            required_symptoms = set(fault["symptoms"])
            user_symptoms = set([k for k, v in symptoms.items() if v])
            
            # If majority of required symptoms match
            matches = required_symptoms.intersection(user_symptoms)
            if len(matches) >= len(required_symptoms) * 0.6:  # 60% match
                return {
                    "fault_name": fault["name"],
                    "severity": severity,
                    "drivable": fault["drivable"],
                    "reason": fault["reason"]
                }
    
    # Default fallback
    return {
        "fault_name": f"{category} system issue",
        "severity": "Moderate",
        "drivable": True,
        "reason": "Issue detected, recommend garage visit"
    }

def assess_drivability(symptoms: dict, category: str = None) -> dict:
    """
    Assess if car is safe to drive based on symptoms
    
    Returns:
        {
            "is_drivable": True/False,
            "urgency": "Critical|Urgent|Soon|Normal",
            "reason": "...",
            "instructions": [...]
        }
    """
    # Check NOT_DRIVABLE conditions
    for rule in DRIVABILITY_RULES["NOT_DRIVABLE_IF"]:
        required = rule["symptoms"]
        if all(symptoms.get(s, False) for s in required):
            return {
                "is_drivable": False,
                "urgency": "Critical",
                "reason": rule["reason"],
                "instructions": [
                    "Do NOT attempt to drive",
                    "Call roadside mechanic",
                    "Stay away from vehicle if overheating"
                ]
            }
    
    # Check URGENT but drivable
    for rule in DRIVABILITY_RULES["DRIVABLE_BUT_URGENT"]:
        required = rule["symptoms"]
        if all(symptoms.get(s, False) for s in required):
            return {
                "is_drivable": True,
                "urgency": "Urgent",
                "reason": rule["reason"],
                "instructions": [
                    "Drive to garage IMMEDIATELY",
                    "SHORT distance only",
                    "Avoid high speeds",
                    "Turn off AC if overheating"
                ]
            }
    
    # Check CAREFUL driving
    for rule in DRIVABILITY_RULES["DRIVABLE_CAREFULLY"]:
        required = rule["symptoms"]
        if any(symptoms.get(s, False) for s in required):
            return {
                "is_drivable": True,
                "urgency": "Soon",
                "reason": rule["reason"],
                "instructions": [
                    "Drive carefully to garage",
                    "Get it checked soon",
                    "Monitor for changes"
                ]
            }
    
    # Default: drivable
    return {
        "is_drivable": True,
        "urgency": "Normal",
        "reason": "Minor issue, safe to drive",
        "instructions": [
            "Schedule garage visit",
            "Normal driving is safe"
        ]
    }

# ============================================
# TEST
# ============================================

if __name__ == "__main__":
    print("="*70)
    print("🧪 TESTING ACCURATE KNOWLEDGE BASE")
    print("="*70)
    
    # Test 1: Drivable Major issue (overheating but running)
    print("\n1️⃣ Test: Overheating but engine running")
    symptoms = {
        "temp_high": True,
        "engine_running": True,
        "no_steam": True
    }
    result = assess_drivability(symptoms, "Engine")
    print(f"   Drivable: {result['is_drivable']}")
    print(f"   Urgency: {result['urgency']}")
    print(f"   Reason: {result['reason']}")
    
    # Test 2: NOT drivable (brake failure)
    print("\n2️⃣ Test: Soft brake pedal")
    symptoms = {
        "soft_pedal": True,
        "brake_fluid_leak": True
    }
    result = assess_drivability(symptoms, "Brake")
    print(f"   Drivable: {result['is_drivable']}")
    print(f"   Urgency: {result['urgency']}")
    print(f"   Reason: {result['reason']}")
    
    # Test 3: Drivable Minor issue
    print("\n3️⃣ Test: Brake squealing")
    symptoms = {
        "brake_noise": True,
        "pedal_normal": True,
        "brake_works": True
    }
    result = assess_drivability(symptoms, "Brake")
    print(f"   Drivable: {result['is_drivable']}")
    print(f"   Urgency: {result['urgency']}")
    print(f"   Reason: {result['reason']}")
    
    print("\n✅ Knowledge base loaded successfully!")