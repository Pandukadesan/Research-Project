
import React, { useState, useEffect, useRef } from 'react';
import { DiagnosisResult, FaultSeverity, User, Vehicle } from '../types';
import { Camera, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { analyzeDashboard } from '../services/gemini';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  image?: string;
  options?: string[];
}

interface Props {
  user: User;
  vehicles: Vehicle[];
  onDiagnosisComplete: (diagnosis: DiagnosisResult) => void;
}

const Chatbot: React.FC<Props> = ({ user, vehicles, onDiagnosisComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: `INITIATING DIAGNOSTIC SESSION...\n\nHi ${user.name}! 👋 I am your AutoCare AI Specialist. I see you are driving a ${vehicles[0].model}. What seems to be the malfunction today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flow State
  const [flow, setFlow] = useState<'IDLE' | 'BRAKE' | 'OVERHEAT'>('IDLE');
  const [step, setStep] = useState(0);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString() }]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    addMessage({ type: 'user', text });
    setInput('');
    setIsTyping(true);

    // AI thinking simulation
    const delay = Math.random() * 1000 + 1000;
    setTimeout(() => {
      processInput(text.toLowerCase());
      setIsTyping(false);
    }, delay);
  };

  const processInput = (text: string) => {
    if (flow === 'IDLE') {
      if (text.includes('brake') || text.includes('grinding')) {
        setFlow('BRAKE');
        setStep(1);
        addMessage({ 
          type: 'bot', 
          text: "SYSTEM ALERT: BRAKE ANOMALY DETECTED.\n\nI understand you're hearing grinding noises from the brakes. This is critical for safety. Let's go through a few questions. Have you parked the car now? Are you safe?",
          options: ['Yes', 'No']
        });
      } else if (text.includes('overheat') || text.includes('engine stopped')) {
        setFlow('OVERHEAT');
        setStep(1);
        addMessage({ 
          type: 'bot', 
          text: "🛑 CRITICAL ALERT: ENGINE THERMAL EMERGENCY.\n\nYour car has overheated and stopped. Please remain calm. Let me ask critical safety questions first. Have you parked the car now? Are you safe?",
          options: ['Yes', 'No']
        });
      } else {
        addMessage({ type: 'bot', text: "I'm sorry, I specialize in Brake Systems and Engine Overheating for now. Could you describe issues related to those?" });
      }
      return;
    }

    if (flow === 'BRAKE') handleBrakeFlow(text);
    if (flow === 'OVERHEAT') handleOverheatFlow(text);
  };

  const handleBrakeFlow = (text: string) => {
    switch (step) {
      case 1:
        addMessage({ type: 'bot', text: "Are you inside or outside the vehicle right now?", options: ['Inside', 'Outside'] });
        setStep(2);
        break;
      case 2:
        addMessage({ type: 'bot', text: "How fast were you driving when the noise occurred?", options: ['Low speed (<30km/h)', 'Moderate speed', 'High speed (>80km/h)'] });
        setStep(3);
        break;
      case 3:
        addMessage({ type: 'bot', text: "Is the brake warning light illuminated on your dashboard?", options: ['Yes', 'No'] });
        setStep(4);
        break;
      case 4:
        addMessage({ type: 'bot', text: "How does the brake pedal feel when you press it?", options: ['Normal', 'Soft/Spongy', 'Hard to press', 'Goes to floor'] });
        setStep(5);
        break;
      case 5:
        addMessage({ type: 'bot', text: "When do you hear the grinding noise?", options: ['Every time I brake', 'Only at high speeds', 'Only when stopping', 'Only in the morning'] });
        setStep(6);
        break;
      case 6:
        addMessage({ type: 'bot', text: "Is the vehicle still running normally? Can you drive it safely at low speeds?", options: ['Yes, runs fine', 'No, something\'s wrong'] });
        setStep(7);
        break;
      case 7:
        addMessage({ type: 'bot', text: "📸 SCAN REQUIRED: Please upload a clear photo of your dashboard with the ignition ON so I can inspect warning lights via AI Vision." });
        setStep(8);
        break;
    }
  };

  const handleOverheatFlow = (text: string) => {
    switch (step) {
      case 1:
        addMessage({ type: 'bot', text: "Are you inside or outside the vehicle right now?", options: ['Inside', 'Outside'] });
        setStep(2);
        break;
      case 2:
        addMessage({ type: 'bot', text: "Is there steam or white smoke coming from the bonnet?", options: ['Yes, I see steam', 'No steam visible'] });
        setStep(3);
        break;
      case 3:
        addMessage({ type: 'bot', text: "⚠️ PROTOCOL ALERT: Do NOT open the bonnet or restart the engine. High pressure steam is dangerous. How fast were you driving when this happened?", options: ['Low speed', 'High speed'] });
        setStep(4);
        break;
      case 4:
        addMessage({ type: 'bot', text: "📸 SCAN REQUIRED: Thank you. Now please upload a photo of your dashboard so I can see the warning lights and temp gauge." });
        setStep(5);
        break;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      addMessage({ type: 'user', text: "Uploading dashboard photo...", image: base64 });
      setIsTyping(true);

      const analysis = await analyzeDashboard(base64);
      addMessage({ 
        type: 'bot', 
        text: `🤖 ANALYZING VISUAL TELEMETRY...\n\n✓ Scan Complete!\n\nAI Findings:\n- Warning Lights: ${analysis.warningLights?.join(', ') || 'None Detected'}\n- Temperature: ${analysis.temperature}\n- Status: ${analysis.summary}\n\nCompiling Final Diagnosis Report...`
      });

      // Show report after delay
      setTimeout(() => {
        const vehicle = vehicles[0] || { model: 'Suzuki Alto', year: 2018, mileage: 45000, transmission: 'Manual', id: '1', registration: 'WP-CAS-1234' };
        
        const result: DiagnosisResult = flow === 'BRAKE' ? {
          vehicle,
          faultCategory: 'BRAKE SYSTEM',
          faultType: 'Brake Pad Wear',
          severity: FaultSeverity.MODERATE,
          partsRequired: ['Brake Pads (Front)', 'Brake Pads (Rear)'],
          isDrivable: true,
          symptoms: ['Grinding noise when braking', 'Low pad life indicators', 'Dashboard inspection clear'],
          confidence: 87,
          repairTimeEstimate: '1.2 - 1.5 hours',
          urgency: 'MEDIUM',
          safetyInstructions: [
            'Drive at moderate speeds (< 60 km/h)',
            'Increase following distance',
            'Avoid sudden braking',
            'Seek repair within 2-3 days'
          ]
        } : {
          vehicle,
          faultCategory: 'ENGINE COOLING SYSTEM',
          faultType: 'Radiator/Coolant Failure',
          severity: FaultSeverity.MAJOR,
          partsRequired: ['Radiator', 'Coolant Fluid', 'Thermostat'],
          isDrivable: false,
          symptoms: [
            'Engine completely stopped',
            'Steam/white smoke from bonnet',
            'Coolant leakage confirmed',
            'Temperature warning RED',
            'Hissing sound (pressure release)'
          ],
          confidence: 95,
          repairTimeEstimate: '2.5 - 3.0 hours',
          urgency: 'EMERGENCY',
          safetyInstructions: [
            'Do NOT restart the engine',
            'Do NOT open the bonnet',
            'Wait for professional mechanic'
          ],
          likelyCauses: [
            'Radiator leakage/failure',
            'Water pump malfunction',
            'Thermostat failure'
          ]
        };
        onDiagnosisComplete(result);
      }, 3500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-36 scroll-smooth custom-scrollbar">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.type === 'bot' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
            <div className={`flex items-start max-w-[88%] ${m.type === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                m.type === 'bot' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'
              }`}>
                {m.type === 'bot' ? <Bot size={20} /> : <UserIcon size={20} />}
              </div>
              <div className="mx-3 space-y-3">
                <div className={`p-5 rounded-3xl shadow-sm text-sm font-bold leading-relaxed whitespace-pre-wrap transition-all ${
                  m.type === 'bot' 
                  ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' 
                  : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  {m.text}
                  {m.image && (
                    <div className="mt-4 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md">
                      <img src={m.image} alt="Dashboard scan" className="w-full h-40 object-cover" />
                    </div>
                  )}
                </div>
                {m.options && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in duration-500 delay-200">
                    {m.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleSend(opt)}
                        className="bg-white border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start items-center space-x-3 text-slate-400">
            <div className="w-9 h-9 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <Loader2 className="animate-spin text-blue-500" size={18} />
            </div>
            <span className="text-[10px] italic font-black uppercase tracking-[0.3em] animate-pulse">AutoBot Processing...</span>
          </div>
        )}
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex items-center space-x-3 z-20 safe-area-inset-bottom">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 active:scale-90 transition-all border border-slate-200"
        >
          <Camera size={26} />
        </button>
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Type repair details..."
            className="w-full bg-slate-100 px-6 py-4 rounded-[1.5rem] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 border border-slate-200"
          />
        </div>
        <button 
          onClick={() => handleSend(input)}
          className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-90 transition-all shadow-[0_10px_25px_rgba(37,99,235,0.3)]"
        >
          <Send size={26} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
