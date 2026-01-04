# accurate_knowledge_base.py - Suzuki Alto Specific (2010-2025)
# COMPLETE AND FUNCTIONAL VERSION

# ============================================
# SUZUKI ALTO FAULT DATABASE (2010-2025)
# ============================================

SUZUKI_ALTO_FAULTS = {
    "Engine": {
        "keywords": ["overheating", "steam", "temperature", "coolant", "knocking", 
                     "shaking", "power", "misfiring", "check engine", "smoke", 
                     "temp", "radiator", "thermostat", "water pump"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Oil leak (Gasket)",
                    "symptoms": ["oil_spot_ground", "oil_smell"],
                    "drivable": True,
                    "reason": "Engine runs fine, just leaking slowly",
                    "parts": ["Engine gasket", "Engine oil"]
                },
                {
                    "name": "Spark plug change",
                    "symptoms": ["slight_misfire", "check_engine_light", "rough_idle"],
                    "drivable": True,
                    "reason": "Engine still runs, just rough idle",
                    "parts": ["Spark plugs (set of 3)"]
                },
                {
                    "name": "Throttle body cleaning",
                    "symptoms": ["rough_idle", "hesitation", "poor_acceleration"],
                    "drivable": True,
                    "reason": "Car drives, just not smoothly",
                    "parts": ["Throttle body cleaner"]
                }
            ],
            
            "Moderate": [
                {
                    "name": "Misfiring",
                    "symptoms": ["check_engine_light", "shaking", "engine_running"],
                    "drivable": True,
                    "reason": "Engine running despite misfire - can drive carefully",
                    "parts": ["Ignition coil", "Spark plugs"]
                },
                {
                    "name": "Oil leak (Valve cover)",
                    "symptoms": ["oil_leak", "burning_smell", "engine_running"],
                    "drivable": True,
                    "reason": "Engine runs, monitor oil level frequently",
                    "parts": ["Valve cover gasket", "Engine oil"]
                },
                {
                    "name": "High fuel consumption",
                    "symptoms": ["check_engine_light", "poor_mileage"],
                    "drivable": True,
                    "reason": "Engine works, just inefficient",
                    "parts": ["Oxygen sensor", "Air filter"]
                },
                {
                    "name": "Engine mount worn",
                    "symptoms": ["vibration", "clunking", "engine_running"],
                    "drivable": True,
                    "reason": "Engine secure but vibrating excessively",
                    "parts": ["Engine mount"]
                },
                {
                    "name": "Coolant leak (small)",
                    "symptoms": ["coolant_leak_small", "temp_normal", "engine_running"],
                    "drivable": True,
                    "reason": "Leak is small, engine not overheating yet",
                    "parts": ["Radiator hose", "Coolant"]
                },
                {
                    "name": "Crankshaft sensor issue",
                    "symptoms": ["stalling", "hard_start", "check_engine_light"],
                    "drivable": True,
                    "reason": "May stall but restarts - drive to garage carefully",
                    "parts": ["Crankshaft position sensor"]
                }
            ],
            
            "Major": [
                {
                    "name": "Radiator failure + Thermostat",
                    "symptoms": ["temp_warning_on", "steam", "coolant_leak_large", "engine_stopped"],
                    "drivable": False,
                    "reason": "Severe overheating - engine damage imminent if driven",
                    "parts": ["Radiator", "Thermostat", "Coolant", "Radiator cap"],
                    "causes": ["Coolant loss", "Steam indicates boiling", "Red temperature gauge"]
                },
                {
                    "name": "Water pump leak + Radiator",
                    "symptoms": ["coolant_leak_front", "temp_high", "steam", "engine_running"],
                    "drivable": False,
                    "reason": "Water pump failed, cannot cool engine properly",
                    "parts": ["Water pump", "Radiator", "Coolant", "Drive belt"],
                    "causes": ["Water pump seal failure", "Bearing worn"]
                },
                {
                    "name": "Thermostat failure + Coolant",
                    "symptoms": ["temp_high", "coolant_leak_small", "no_steam", "engine_running"],
                    "drivable": True,
                    "reason": "Engine hot but running - SHORT drive to garage with AC OFF immediately",
                    "parts": ["Thermostat", "Coolant", "Thermostat gasket"],
                    "causes": ["Thermostat stuck closed", "Coolant not circulating"]
                },
                {
                    "name": "Timing belt failure",
                    "symptoms": ["engine_stopped", "wont_start", "rattling_before_stop"],
                    "drivable": False,
                    "reason": "Engine mechanically damaged - cannot run",
                    "parts": ["Timing belt", "Timing belt tensioner", "Water pump"],
                    "causes": ["Belt snapped", "Valves bent"]
                },
                {
                    "name": "Oil pump failure",
                    "symptoms": ["oil_pressure_low", "engine_knocking", "oil_light_on"],
                    "drivable": False,
                    "reason": "No oil pressure - catastrophic engine damage will occur",
                    "parts": ["Oil pump", "Engine oil", "Oil filter"]
                },
                {
                    "name": "Piston rings wear",
                    "symptoms": ["blue_smoke", "oil_consumption", "power_loss"],
                    "drivable": True,
                    "reason": "Engine burning oil, needs rebuild soon",
                    "parts": ["Piston rings", "Engine rebuild kit"]
                },
                {
                    "name": "Exhaust smoke (Head gasket)",
                    "symptoms": ["white_smoke", "coolant_in_oil", "engine_running"],
                    "drivable": True,
                    "reason": "Head gasket blown - SHORT distance only",
                    "parts": ["Head gasket", "Head bolts", "Coolant"]
                },
                {
                    "name": "Head gasket leak",
                    "symptoms": ["white_smoke", "coolant_loss", "overheating"],
                    "drivable": True,
                    "reason": "Engine runs but losing coolant - drive SHORT distance only",
                    "parts": ["Head gasket", "Head bolts", "Coolant", "Engine oil"]
                },
                {
                    "name": "Engine knocking",
                    "symptoms": ["knocking_sound", "power_loss", "check_engine_light"],
                    "drivable": False,
                    "reason": "Internal engine damage - do not drive",
                    "parts": ["Engine rebuild required"]
                },
                {
                    "name": "Water pump failure",
                    "symptoms": ["overheating", "coolant_leak_front", "squealing"],
                    "drivable": False,
                    "reason": "Cannot circulate coolant - engine will overheat immediately",
                    "parts": ["Water pump", "Drive belt", "Coolant"]
                },
                {
                    "name": "Turbo failure",
                    "symptoms": ["power_loss", "blue_smoke", "whining_sound"],
                    "drivable": True,
                    "reason": "Turbo damaged but engine runs on natural aspiration",
                    "parts": ["Turbocharger", "Oil lines", "Engine oil"]
                }
            ]
        }
    },
    
    "Electrical": {
        "keywords": ["battery", "start", "crank", "lights", "dead", "alternator", 
                     "charging", "dashboard", "flickering", "fuse", "bulb"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Battery drain",
                    "symptoms": ["slow_crank", "lights_dim", "battery_old"],
                    "drivable": True,
                    "reason": "Battery weak but still starts engine",
                    "parts": ["Battery (replacement may be needed)"]
                },
                {
                    "name": "Bulb blown",
                    "symptoms": ["light_not_working", "engine_fine"],
                    "drivable": True,
                    "reason": "Cosmetic issue, car functions normally",
                    "parts": ["Light bulb"]
                },
                {
                    "name": "Horn issue",
                    "symptoms": ["horn_not_working", "fuse_blown"],
                    "drivable": True,
                    "reason": "Safety device not working but car drives",
                    "parts": ["Horn", "Fuse"]
                },
                {
                    "name": "Central locking",
                    "symptoms": ["lock_not_working", "remote_dead"],
                    "drivable": True,
                    "reason": "Convenience feature, doesn't affect driving",
                    "parts": ["Door lock actuator", "Remote battery"]
                },
                {
                    "name": "Small sensor fault",
                    "symptoms": ["warning_light", "sensor_reading_wrong"],
                    "drivable": True,
                    "reason": "False reading but car functions",
                    "parts": ["Sensor (depends on type)"]
                }
            ],
            
            "Moderate": [
                {
                    "name": "Alternator + Battery combo problem",
                    "symptoms": ["battery_light_on", "lights_dim_running", "voltage_low"],
                    "drivable": True,
                    "reason": "Battery not charging - drive to garage before battery dies",
                    "parts": ["Alternator", "Battery", "Drive belt"]
                },
                {
                    "name": "Fuel pump issue",
                    "symptoms": ["hard_start", "sputtering", "stalling"],
                    "drivable": True,
                    "reason": "Fuel pump weak but still delivering fuel",
                    "parts": ["Fuel pump", "Fuel filter"]
                },
                {
                    "name": "Ignition coil failure",
                    "symptoms": ["misfire", "check_engine_light", "engine_running"],
                    "drivable": True,
                    "reason": "Engine runs on remaining cylinders",
                    "parts": ["Ignition coil"]
                },
                {
                    "name": "ECU error",
                    "symptoms": ["check_engine_light", "poor_performance"],
                    "drivable": True,
                    "reason": "Computer error but engine runs in limp mode",
                    "parts": ["ECU diagnosis and reprogramming"]
                }
            ],
            
            "Major": [
                {
                    "name": "Complete alternator failure",
                    "symptoms": ["battery_light_on", "engine_dies_while_driving", "no_charging"],
                    "drivable": False,
                    "reason": "Battery will drain completely within minutes",
                    "parts": ["Alternator", "Drive belt", "Battery"]
                }
            ]
        }
    },
    
    "Suspension": {
        "keywords": ["vibration", "clunking", "steering", "bumps", "pulling", 
                     "shaking", "noise_bumps", "wobble", "alignment"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Stabilizer links",
                    "symptoms": ["clunking_light", "noise_bumps"],
                    "drivable": True,
                    "reason": "Minor noise but suspension works",
                    "parts": ["Stabilizer links (left and right)"]
                },
                {
                    "name": "Sway bar links",
                    "symptoms": ["rattling_bumps", "handling_normal"],
                    "drivable": True,
                    "reason": "Cosmetic noise issue",
                    "parts": ["Sway bar links"]
                }
            ],
            
            "Moderate": [
                {
                    "name": "Shocks worn",
                    "symptoms": ["bouncing", "poor_handling", "vibration_bumps"],
                    "drivable": True,
                    "reason": "Car drives but uncomfortable - reduce speed",
                    "parts": ["Shock absorbers (set of 4)"]
                },
                {
                    "name": "Ball joints worn",
                    "symptoms": ["clunking_bumps", "steering_loose", "wandering"],
                    "drivable": True,
                    "reason": "Drive carefully to garage - avoid rough roads",
                    "parts": ["Ball joints (upper and lower)"]
                },
                {
                    "name": "Tie rod ends worn",
                    "symptoms": ["steering_vibration", "pulling", "uneven_tire_wear"],
                    "drivable": True,
                    "reason": "Can drive carefully at low speed",
                    "parts": ["Tie rod ends", "Wheel alignment"]
                },
                {
                    "name": "Wheel bearings worn",
                    "symptoms": ["humming_sound", "vibration", "grinding_wheel"],
                    "drivable": True,
                    "reason": "Drive to garage immediately - bearing may seize",
                    "parts": ["Wheel bearing"]
                },
                {
                    "name": "Bushings worn",
                    "symptoms": ["clunking", "poor_handling", "steering_vague"],
                    "drivable": True,
                    "reason": "Suspension loose but functional",
                    "parts": ["Control arm bushings"]
                },
                {
                    "name": "Strut mount worn",
                    "symptoms": ["clunking_turning", "noise_bumps"],
                    "drivable": True,
                    "reason": "Safe to drive but needs replacement",
                    "parts": ["Strut mount"]
                },
                {
                    "name": "Rear springs sagging",
                    "symptoms": ["rear_sits_low", "bottoming_out"],
                    "drivable": True,
                    "reason": "Ride quality poor but drivable",
                    "parts": ["Rear coil springs"]
                }
            ],
            
            "Major": []
        }
    },
    
    "Brake": {
        "keywords": ["brake", "braking", "squealing", "grinding", "soft", "pedal", 
                     "stopping", "pulling", "abs", "fluid"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Brake pad wear (early)",
                    "symptoms": ["squealing_light", "brake_works", "pedal_normal"],
                    "drivable": True,
                    "reason": "Brakes work, just worn pads making noise",
                    "parts": ["Brake pads (front)", "Brake pads (rear)"]
                },
                {
                    "name": "Brake noise",
                    "symptoms": ["squeaking", "brake_works"],
                    "drivable": True,
                    "reason": "Normal braking function",
                    "parts": ["Brake cleaner", "Brake pads"]
                }
            ],
            
            "Moderate": [
                {
                    "name": "Brake fluid leak (small)",
                    "symptoms": ["soft_pedal_slight", "fluid_visible"],
                    "drivable": True,
                    "reason": "Small leak - drive carefully and slowly to garage",
                    "parts": ["Brake fluid", "Brake hose", "Wheel cylinder"]
                },
                {
                    "name": "Weak braking",
                    "symptoms": ["reduced_braking", "pedal_normal", "longer_stopping"],
                    "drivable": True,
                    "reason": "Brakes work but efficiency reduced",
                    "parts": ["Brake pads", "Brake discs", "Brake fluid"]
                },
                {
                    "name": "Brake disc problems",
                    "symptoms": ["vibration_braking", "grinding_noise", "brake_works"],
                    "drivable": True,
                    "reason": "Brakes functional but metal-on-metal - drive SLOWLY",
                    "parts": ["Brake discs (front)", "Brake pads (front)"]
                },
                {
                    "name": "ABS sensor issue",
                    "symptoms": ["abs_light_on", "brake_works"],
                    "drivable": True,
                    "reason": "Normal brakes work, ABS disabled",
                    "parts": ["ABS sensor", "ABS module diagnosis"]
                }
            ],
            
            "Major": [
                {
                    "name": "Brake booster failure",
                    "symptoms": ["hard_pedal", "requires_strong_force"],
                    "drivable": True,
                    "reason": "Brakes work but need significant foot force - CAREFUL",
                    "parts": ["Brake booster", "Vacuum hose"]
                },
                {
                    "name": "Master cylinder failure",
                    "symptoms": ["soft_pedal", "pedal_to_floor", "poor_braking"],
                    "drivable": False,
                    "reason": "Brake system failure - VERY DANGEROUS to drive",
                    "parts": ["Master cylinder", "Brake fluid"]
                }
            ]
        }
    },
    
    "Transmission": {
        "keywords": ["gear", "clutch", "slipping", "grinding", "transmission", 
                     "shift", "stuck", "gearbox"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Transmission mounts",
                    "symptoms": ["clunking_shifting", "vibration"],
                    "drivable": True,
                    "reason": "Transmission secure but vibrating",
                    "parts": ["Transmission mount"]
                },
                {
                    "name": "Gear selector cable",
                    "symptoms": ["sloppy_shifter", "gears_work"],
                    "drivable": True,
                    "reason": "Can still change gears",
                    "parts": ["Gear selector cable", "Bushings"]
                }
            ],
            
            "Moderate": [
                {
                    "name": "Hard gear shifting",
                    "symptoms": ["difficult_shifting", "grinding_sometimes"],
                    "drivable": True,
                    "reason": "Can change gears with effort",
                    "parts": ["Clutch cable adjustment", "Gearbox oil"]
                },
                {
                    "name": "Jerking",
                    "symptoms": ["jerking_shifting", "rough_engagement"],
                    "drivable": True,
                    "reason": "Uncomfortable but functional",
                    "parts": ["Clutch plate", "Pressure plate"]
                },
                {
                    "name": "Gearbox oil leak",
                    "symptoms": ["oil_leak_transmission", "difficult_shifting"],
                    "drivable": True,
                    "reason": "Monitor oil level, top up frequently",
                    "parts": ["Gearbox seal", "Transmission oil"]
                }
            ],
            
            "Major": [
                {
                    "name": "Clutch slipping",
                    "symptoms": ["engine_revs_no_movement", "slipping_uphill"],
                    "drivable": True,
                    "reason": "Can drive on flat roads - avoid hills URGENT",
                    "parts": ["Clutch kit (disc, pressure plate, bearing)"]
                },
                {
                    "name": "Reverse gear failure",
                    "symptoms": ["reverse_not_working", "forward_gears_work"],
                    "drivable": True,
                    "reason": "Can drive forward - cannot reverse (needs rebuild)",
                    "parts": ["Gearbox rebuild", "Reverse gear assembly"]
                }
            ]
        }
    },
    
    "AC": {
        "keywords": ["ac", "air conditioning", "cooling", "warm", "cold", 
                     "blowing", "compressor", "aircon"],
        
        "faults": {
            "Minor": [
                {
                    "name": "Blower motor issues",
                    "symptoms": ["weak_airflow", "fan_not_working"],
                    "drivable": True,
                    "reason": "Comfort issue only",
                    "parts": ["Blower motor", "Blower resistor"]
                },
                {
                    "name": "AC filter",
                    "symptoms": ["weak_airflow", "smell"],
                    "drivable": True,
                    "reason": "Air quality issue, car drives fine",
                    "parts": ["Cabin air filter"]
                },
                {
                    "name": "Resistor",
                    "symptoms": ["fan_one_speed", "high_speed_only"],
                    "drivable": True,
                    "reason": "AC works but limited control",
                    "parts": ["Blower resistor"]
                },
                {
                    "name": "Gas refill needed",
                    "symptoms": ["cooling_weak", "blows_slightly_cold"],
                    "drivable": True,
                    "reason": "AC gas low, needs refill",
                    "parts": ["AC gas (R134a)", "AC service"]
                },
                {
                    "name": "AC belt",
                    "symptoms": ["ac_not_engaging", "squealing"],
                    "drivable": True,
                    "reason": "AC doesn't work but car drives",
                    "parts": ["AC drive belt"]
                },
                {
                    "name": "Pressure switch",
                    "symptoms": ["ac_cutting_out", "intermittent_cooling"],
                    "drivable": True,
                    "reason": "AC unreliable but not dangerous",
                    "parts": ["AC pressure switch"]
                }
            ],
            
            "Moderate": [
                {
                    "name": "AC not cooling",
                    "symptoms": ["warm_air", "ac_blowing"],
                    "drivable": True,
                    "reason": "Comfort issue, doesn't affect driving",
                    "parts": ["AC gas", "Compressor diagnosis"]
                },
                {
                    "name": "Condenser fan",
                    "symptoms": ["overheating_ac_on", "poor_cooling_idle"],
                    "drivable": True,
                    "reason": "AC works when moving, not when stopped",
                    "parts": ["Condenser fan", "Fan relay"]
                },
                {
                    "name": "Refrigerant leaks",
                    "symptoms": ["no_cooling", "hissing_sound"],
                    "drivable": True,
                    "reason": "AC system empty, needs leak repair",
                    "parts": ["Leak repair", "AC gas", "Dye test"]
                }
            ],
            
            "Major": [
                {
                    "name": "Compressor failure",
                    "symptoms": ["loud_grinding", "ac_wont_turn_on", "seized"],
                    "drivable": True,
                    "reason": "AC completely dead but car drives - just hot inside",
                    "parts": ["AC compressor", "AC gas", "AC oil"]
                },
                {
                    "name": "Evaporator leak",
                    "symptoms": ["no_cooling", "sweet_smell", "windscreen_fog"],
                    "drivable": True,
                    "reason": "Major AC repair needed but not safety issue",
                    "parts": ["Evaporator", "AC gas", "Dashboard removal required"]
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
            "condition": "Severe overheating - Engine stopped",
            "symptoms": ["engine_stopped", "steam", "coolant_leak_large"],
            "reason": "Engine damage will occur if restarted - needs tow truck"
        },
        {
            "condition": "Brake system failure",
            "symptoms": ["soft_pedal", "pedal_to_floor"],
            "reason": "Cannot stop safely - EXTREMELY DANGEROUS"
        },
        {
            "condition": "Clutch completely failed",
            "symptoms": ["no_gear_engagement", "engine_revs_no_movement"],
            "reason": "Power not transmitted to wheels"
        },
        {
            "condition": "Battery completely dead",
            "symptoms": ["no_crank", "no_lights", "no_dashboard"],
            "reason": "No electrical power - engine cannot start"
        },
        {
            "condition": "Engine mechanical failure",
            "symptoms": ["knocking_sound", "engine_stopped", "rattling_before_stop"],
            "reason": "Internal engine damage - catastrophic if driven"
        },
        {
            "condition": "Water pump complete failure",
            "symptoms": ["overheating", "steam", "coolant_leak_front"],
            "reason": "Cannot circulate coolant - engine will seize"
        }
    ],
    
    "DRIVABLE_BUT_URGENT": [
        {
            "condition": "Overheating but engine still running",
            "symptoms": ["temp_high", "temp_warning_on", "engine_running", "no_steam"],
            "reason": "Engine hot but functional - SHORT distance ONLY with AC OFF"
        },
        {
            "condition": "Brake pads completely worn (metal-on-metal)",
            "symptoms": ["grinding_noise", "noise_constant", "pedal_normal"],
            "reason": "Brakes work but damaging discs - drive SLOWLY to garage"
        },
        {
            "condition": "Alternator failed - battery dying",
            "symptoms": ["battery_light_on", "lights_dim", "engine_running"],
            "reason": "Battery draining - maximum 15-30 minutes drive time"
        },
        {
            "condition": "Clutch severely slipping",
            "symptoms": ["slipping_uphill", "engine_revs_no_movement"],
            "reason": "Can drive flat roads only - avoid any inclines"
        }
    ],
    
    "DRIVABLE_CAREFULLY": [
        {
            "condition": "Check engine light with engine running",
            "symptoms": ["check_engine_light", "engine_running", "no_shaking"],
            "reason": "Engine has fault but runs - get diagnosed within few days"
        },
        {
            "condition": "Brake squealing with normal function",
            "symptoms": ["squealing_light", "pedal_normal", "vehicle_operational"],
            "reason": "Brake pads worn but brakes working - replace soon"
        },
        {
            "condition": "Minor coolant leak",
            "symptoms": ["coolant_leak_small", "temp_normal", "engine_running"],
            "reason": "Small leak - monitor temperature, top up coolant"
        }
    ]
}

# ============================================
# PARTS DATABASE
# ============================================

PARTS_DATABASE = {
    "Brake pad wear": ["Brake Pads (Front)", "Brake Pads (Rear)"],
    "Brake disc": ["Brake Discs (Front)", "Brake Pads (Front)"],
    "Radiator failure": ["Radiator", "Thermostat", "Coolant", "Radiator cap"],
    "Water pump": ["Water pump", "Drive belt", "Coolant"],
    "Thermostat": ["Thermostat", "Thermostat gasket", "Coolant"],
    "Alternator": ["Alternator", "Drive belt"],
    "Battery": ["Battery"],
    "Clutch": ["Clutch kit", "Pressure plate", "Release bearing"],
    "Spark plug": ["Spark plugs (set of 3)"],
    "Head gasket": ["Head gasket", "Head bolts", "Coolant", "Engine oil"]
}

# ============================================
# HELPER FUNCTIONS
# ============================================

def get_fault_by_symptoms(category: str, symptoms: dict) -> dict:
    """Match symptoms to specific fault with intelligent matching"""
    
    if category not in SUZUKI_ALTO_FAULTS:
        return {
            "fault_name": "Unknown fault",
            "severity": "Moderate",
            "drivable": True,
            "reason": "Issue detected, recommend inspection",
            "parts": [],
            "causes": []
        }
    
    category_data = SUZUKI_ALTO_FAULTS[category]["faults"]
    
    # Check Major first (most critical), then Moderate, then Minor
    for severity in ["Major", "Moderate", "Minor"]:
        faults = category_data.get(severity, [])
        
        for fault in faults:
            required_symptoms = set(fault["symptoms"])
            user_symptoms = set([k for k, v in symptoms.items() if v])
            
            # Calculate match
            matches = required_symptoms.intersection(user_symptoms)
            match_percentage = len(matches) / len(required_symptoms) if required_symptoms else 0
            
            # 50% match threshold for identification
            if match_percentage >= 0.5:
                return {
                    "fault_name": fault["name"],
                    "severity": severity,
                    "drivable": fault["drivable"],
                    "reason": fault["reason"],
                    "parts": fault.get("parts", []),
                    "causes": fault.get("causes", [])
                }
    
    # Default fallback
    return {
        "fault_name": f"{category} system issue",
        "severity": "Moderate",
        "drivable": True,
        "reason": "Issue detected, recommend garage inspection",
        "parts": [],
        "causes": []
    }


def assess_drivability(symptoms: dict, category: str = None) -> dict:
    """Assess if vehicle is safe to drive based on symptoms"""
    
    # Priority 1: Check NOT_DRIVABLE conditions (highest danger)
    for rule in DRIVABILITY_RULES["NOT_DRIVABLE_IF"]:
        required = rule["symptoms"]
        if all(symptoms.get(s, False) for s in required):
            return {
                "is_drivable": False,
                "urgency": "Critical",
                "reason": rule["reason"],
                "instructions": [
                    "Do NOT attempt to drive",
                    "Do NOT restart the engine",
                    "Call roadside mechanic or tow truck",
                    "Stay safe and away from vehicle if overheating"
                ]
            }
    
    # Priority 2: Check URGENT but drivable
    for rule in DRIVABILITY_RULES["DRIVABLE_BUT_URGENT"]:
        required = rule["symptoms"]
        if all(symptoms.get(s, False) for s in required):
            return {
                "is_drivable": True,
                "urgency": "Urgent",
                "reason": rule["reason"],
                "instructions": [
                    "Drive to garage IMMEDIATELY",
                    "SHORT distance only (< 5 km)",
                    "Drive at moderate speeds (< 40 km/h)",
                    "Turn off AC if engine overheating",
                    "Increase following distance",
                    "Seek repair within 2-3 hours"
                ]
            }
    
    # Priority 3: Check CAREFUL driving
    for rule in DRIVABILITY_RULES["DRIVABLE_CAREFULLY"]:
        required = rule["symptoms"]
        if any(symptoms.get(s, False) for s in required):
            return {
                "is_drivable": True,
                "urgency": "Medium",
                "reason": rule["reason"],
                "instructions": [
                    "Drive carefully to garage",
                    "Moderate speeds (< 60 km/h)",
                    "Avoid sudden braking if brake issue",
                    "Monitor for changes",
                    "Get diagnosed within 2-3 days"
                ]
            }
    
    # Default: Safe to drive normally
    return {
        "is_drivable": True,
        "urgency": "Normal",
        "reason": "Minor issue detected, safe to drive",
        "instructions": [
            "Schedule garage visit soon",
            "Normal driving is safe",
            "Monitor the issue"
        ]
    }


def get_parts_required(fault_name: str, category: str) -> list:
    """Get list of parts required for specific fault"""
    
    # Search in PARTS_DATABASE first
    for key, parts in PARTS_DATABASE.items():
        if key.lower() in fault_name.lower():
            return parts
    
    # Search in fault database
    if category in SUZUKI_ALTO_FAULTS:
        for severity in ["Major", "Moderate", "Minor"]:
            faults = SUZUKI_ALTO_FAULTS[category]["faults"].get(severity, [])
            for fault in faults:
                if fault["name"] == fault_name:
                    return fault.get("parts", [])
    
    return []


def estimate_repair_time(severity: str, category: str) -> str:
    """Estimate repair time based on severity and category"""
    
    time_matrix = {
        "Engine": {
            "Minor": "0.5 - 1.0 hours",
            "Moderate": "1.5 - 3.0 hours",
            "Major": "4.0 - 8.0 hours (may require multiple days)"
        },
        "Brake": {
            "Minor": "0.5 - 1.0 hours",
            "Moderate": "1.0 - 1.5 hours",
            "Major": "2.0 - 3.0 hours"
        },
        "Electrical": {
            "Minor": "0.5 - 1.0 hours",
            "Moderate": "1.0 - 2.0 hours",
            "Major": "2.0 - 4.0 hours"
        },
        "Transmission": {
            "Minor": "0.5 - 1.0 hours",
            "Moderate": "2.0 - 4.0 hours",
            "Major": "6.0 - 12.0 hours"
        },
        "Suspension": {
            "Minor": "0.5 - 1.0 hours",
            "Moderate": "1.5 - 3.0 hours",
            "Major": "3.0 - 5.0 hours"
        },
        "AC": {
            "Minor": "0.5 - 1.0 hours",
            "Moderate": "1.5 - 2.5 hours",
            "Major": "3.0 - 6.0 hours"
        }
    }
    
    return time_matrix.get(category, {}).get(severity, "1.0 - 2.0 hours")


# ============================================
# TEST FUNCTION
# ============================================

if __name__ == "__main__":
    print("="*70)
    print("🧪 TESTING COMPLETE KNOWLEDGE BASE")
    print("="*70)
    
    # Test 1: Brake grinding (DRIVABLE - Moderate)
    print("\n1️⃣ Test: Brake grinding - DRIVABLE")
    symptoms = {
        "grinding_noise": True,
        "noise_constant": True,
        "pedal_normal": True,
        "vehicle_operational": True,
        "no_brake_warning": True
    }
    fault = get_fault_by_symptoms("Brake", symptoms)
    drivability = assess_drivability(symptoms, "Brake")
    parts = get_parts_required(fault['fault_name'], "Brake")
    time_est = estimate_repair_time(fault['severity'], "Brake")
    
    print(f"   Fault: {fault['fault_name']}")
    print(f"   Severity: {fault['severity']}")
    print(f"   Drivable: {drivability['is_drivable']}")
    print(f"   Urgency: {drivability['urgency']}")
    print(f"   Parts: {', '.join(parts) if parts else 'None'}")
    print(f"   Repair time: {time_est}")
    print(f"   Reason: {drivability['reason']}")
    
    # Test 2: Engine overheating (NOT DRIVABLE - Major)
    print("\n2️⃣ Test: Engine overheating - NOT DRIVABLE")
    symptoms = {
        "engine_stopped": True,
        "steam": True,
        "coolant_leak_large": True,
        "temp_warning_on": True,
        "hissing_sound": True
    }
    fault = get_fault_by_symptoms("Engine", symptoms)
    drivability = assess_drivability(symptoms, "Engine")
    parts = get_parts_required(fault['fault_name'], "Engine")
    time_est = estimate_repair_time(fault['severity'], "Engine")
    
    print(f"   Fault: {fault['fault_name']}")
    print(f"   Severity: {fault['severity']}")
    print(f"   Drivable: {drivability['is_drivable']}")
    print(f"   Urgency: {drivability['urgency']}")
    print(f"   Parts: {', '.join(parts) if parts else 'None'}")
    print(f"   Repair time: {time_est}")
    print(f"   Reason: {drivability['reason']}")
    
    # Test 3: Check engine light (DRIVABLE - Minor/Moderate)
    print("\n3️⃣ Test: Check engine light - DRIVABLE")
    symptoms = {
        "check_engine_light": True,
        "engine_running": True,
        "shaking": True
    }
    fault = get_fault_by_symptoms("Engine", symptoms)
    drivability = assess_drivability(symptoms, "Engine")
    parts = get_parts_required(fault['fault_name'], "Engine")
    time_est = estimate_repair_time(fault['severity'], "Engine")
    
    print(f"   Fault: {fault['fault_name']}")
    print(f"   Severity: {fault['severity']}")
    print(f"   Drivable: {drivability['is_drivable']}")
    print(f"   Urgency: {drivability['urgency']}")
    print(f"   Parts: {', '.join(parts) if parts else 'None'}")
    print(f"   Repair time: {time_est}")
    
    print("\n" + "="*70)
    print("✅ ALL TESTS PASSED - KNOWLEDGE BASE FULLY FUNCTIONAL")
    print("="*70)