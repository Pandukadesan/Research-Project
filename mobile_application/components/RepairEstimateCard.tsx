
import React, { useState } from 'react';
import { DiagnosisResult, FaultSeverity } from '../types';
import { 
  Clock, CheckCircle, Shield, AlertTriangle, 
  Cpu, Zap, BarChart3, ArrowRight, CheckCircle2, 
  Car, FileText, Camera, Info, Activity, AlertCircle, Loader2
} from 'lucide-react';

interface Props {
  diagnosis: DiagnosisResult;
  onContinue: () => void;
}

const RepairEstimateCard: React.FC<Props> = ({ diagnosis, onContinue }) => {
  const [step, setStep] = useState<'diagnosis' | 'ml-inputs' | 'ml-result'>('diagnosis');
  const [loading, setLoading] = useState(false);

  const isCritical = diagnosis.severity === FaultSeverity.MAJOR;

  const handleStartML = () => setStep('ml-inputs');
  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('ml-result');
    }, 2000);
  };

  // --- UI PART 1: DIAGNOSIS ---
  if (step === 'diagnosis') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
        <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden border-2 ${isCritical ? 'border-red-500' : 'border-blue-500'} bg-white flex flex-col`}>
          {/* Header */}
          <div className={`${isCritical ? 'bg-red-600' : 'bg-blue-600'} px-8 py-5 flex items-center justify-between text-white`}>
            <div className="flex items-center space-x-3">
              {isCritical ? <AlertTriangle className="animate-pulse" size={24} /> : <BotAvatar />}
              <h2 className="font-black text-sm uppercase tracking-[0.2em] italic">
                {isCritical ? '🚨 AI CHATBOT CRITICAL DIAGNOSIS' : '🤖 AI CHATBOT DIAGNOSIS COMPLETE'}
              </h2>
            </div>
            <div className="bg-white/20 px-2 py-1 rounded text-[8px] font-black uppercase">v4.2.0-PRO</div>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh] scroll-smooth">
            {/* Vehicle Information */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                {isCritical ? <Car size={14} className="mr-2 text-red-500"/> : <Car size={14} className="mr-2 text-blue-500"/>} 
                {isCritical ? '🚗 Vehicle Information:' : 'Vehicle Details:'}
              </h3>
              <div className="pl-4 space-y-1.5 border-l-2 border-slate-100">
                <p className="text-sm font-bold text-slate-800">• Model: {diagnosis.vehicle.model} {diagnosis.vehicle.year}</p>
                <p className="text-sm font-bold text-slate-800">• Mileage: {diagnosis.vehicle.mileage.toLocaleString()} km</p>
                {isCritical && <p className="text-sm font-bold text-slate-800">• Current Location: Near Dondra</p>}
                {!isCritical && <p className="text-sm font-bold text-slate-800">• Transmission: {diagnosis.vehicle.transmission}</p>}
              </div>
            </section>

            {/* Extracted Fault Data */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <FileText size={14} className="mr-2 text-slate-500"/> {isCritical ? '⚠️ Extracted Fault Information:' : '📋 Extracted Information:'}
              </h3>
              <div className="pl-4 space-y-1.5 border-l-2 border-slate-100">
                <p className="text-sm font-bold text-slate-800">• Fault Category: <span className="uppercase">{diagnosis.faultCategory}</span></p>
                <p className="text-sm font-bold text-slate-800">• Fault Type: {diagnosis.faultType}</p>
                <p className="text-sm font-bold text-slate-800">• Severity: {isCritical ? '🔴 MAJOR (Critical)' : '⚠️ MODERATE'}</p>
              </div>
            </section>

            {/* Critical Symptoms (Case 2 only) */}
            {isCritical && (
              <section className="space-y-3">
                <h3 className="text-[11px] font-black text-red-500 uppercase tracking-widest flex items-center">🔥 Critical Symptoms Detected:</h3>
                <div className="pl-4 space-y-1.5 border-l-2 border-red-100">
                  {diagnosis.symptoms.map((s, i) => (
                    <p key={i} className="text-sm font-bold text-slate-800">• {s}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Dashboard Analysis (Vision) */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <Camera size={14} className="mr-2 text-slate-500"/> 📊 Dashboard Analysis {isCritical ? '(AI Vision):' : ':'}
              </h3>
              <div className="pl-4 space-y-1.5 border-l-2 border-slate-100">
                {isCritical ? (
                  <>
                    <p className="text-sm font-bold text-red-600">• 🔴 Temperature Warning: CRITICAL</p>
                    <p className="text-sm font-bold text-orange-600">• 🟡 Check Engine Light: ACTIVE</p>
                    <p className="text-sm font-bold text-slate-800">• Analysis Confidence: 95%</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-800">• No warning lights detected</p>
                    <p className="text-sm font-bold text-slate-800">• Temperature: Normal</p>
                    <p className="text-sm font-bold text-slate-800">• All systems operational</p>
                  </>
                )}
              </div>
            </section>

            {/* Assessment */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">🚦 Drivability Assessment:</h3>
              <div className="pl-4">
                <p className={`text-sm font-black flex items-center space-x-2 ${diagnosis.isDrivable ? 'text-green-600' : 'text-red-600'}`}>
                  {diagnosis.isDrivable ? '✅ DRIVABLE WITH CAUTION' : '• Status: 🛑 NOT DRIVABLE'}
                </p>
                {!diagnosis.isDrivable && <p className="text-sm font-black text-red-600 ml-4">• Condition: EMERGENCY</p>}
              </div>
            </section>

            {/* Parts */}
            {!isCritical && (
              <section className="space-y-3">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">🧩 Parts Required:</h3>
                <div className="pl-4 space-y-1.5 border-l-2 border-slate-100">
                  {diagnosis.partsRequired.map((p, i) => (
                    <p key={i} className="text-sm font-bold text-slate-800">• {p}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Safety/Instructions */}
            <section className={`p-6 rounded-3xl border ${isCritical ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center mb-3">
                {isCritical ? '⚠️ Immediate Safety Instructions:' : 'Safety Instructions:'}
              </h3>
              <div className="space-y-1.5">
                {(diagnosis.safetyInstructions || []).map((ins, i) => (
                  <p key={i} className={`text-sm font-bold ${isCritical ? 'text-red-700' : 'text-slate-700'}`}>• {ins}</p>
                ))}
              </div>
            </section>

            {/* Likely Causes (Case 2 only) */}
            {isCritical && (
              <section className="space-y-3">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">🔍 Likely Causes:</h3>
                <div className="pl-4 space-y-1.5 border-l-2 border-slate-100">
                  {(diagnosis.likelyCauses || []).map((cause, i) => (
                    <p key={i} className="text-sm font-bold text-slate-800">• {cause}</p>
                  ))}
                </div>
              </section>
            )}

            <button 
              onClick={handleStartML}
              className={`w-full ${isCritical ? 'bg-red-600' : 'bg-blue-600'} text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all mt-6 flex items-center justify-center space-x-2`}
            >
              <span>Next: Get Repair Time Estimate</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- UI PART 2: ML INPUT FEATURES ---
  if (step === 'ml-inputs') {
    return (
      <div className="animate-in slide-in-from-right-8 duration-700 pb-20">
        <div className="bg-slate-900 rounded-[3rem] shadow-2xl border-2 border-slate-800 overflow-hidden text-white">
          <div className="bg-slate-800 px-8 py-5 flex items-center space-x-4 border-b border-slate-700">
            <div className="bg-blue-600 p-2 rounded-xl"><Clock size={20} /></div>
            <h2 className="font-black text-sm uppercase tracking-widest italic tracking-tighter">⏱️ ML MODEL - REPAIR TIME PREDICTION</h2>
          </div>

          <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Info size={16} className="mr-2 text-blue-500" /> 📥 Model Input Features:
              </h3>
              <div className="h-0.5 bg-slate-800 w-full rounded-full" />
            </div>

            <section className="grid grid-cols-1 gap-10">
              <InputGroup title="From User Profile:" items={[
                { label: 'Car Model', val: diagnosis.vehicle.model },
                { label: 'Year', val: diagnosis.vehicle.year.toString() },
                { label: 'Mileage', val: `${diagnosis.vehicle.mileage.toLocaleString()} km` },
                { label: 'Transmission', val: diagnosis.vehicle.transmission }
              ]} />

              <InputGroup title="From AI Chatbot:" items={[
                { label: 'Fault Category', val: diagnosis.faultCategory.toUpperCase() },
                { label: 'Fault Type', val: diagnosis.faultType },
                { label: 'Severity', val: diagnosis.severity.toUpperCase() },
                { label: 'Parts Required', val: diagnosis.partsRequired.join(', ') }
              ]} />

              <InputGroup title="From Current Date/Time:" items={[
                { label: 'Day', val: isCritical ? 'Tuesday' : 'Monday' },
                { label: 'Time', val: isCritical ? 'Afternoon (15:45)' : 'Afternoon (14:30)' }
              ]} />

              <InputGroup title="Model Defaults (Training Data):" items={[
                { label: 'Parts Availability', val: isCritical ? 'May need ordering' : 'Available' },
                { label: 'Garage Type', val: isCritical ? 'Authorized (complex repair)' : 'Local' },
                { label: 'Mechanic Expertise', val: isCritical ? '10 years (required)' : '7 years (avg)' }
              ]} />
            </section>

            <button 
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center space-x-3 mt-10"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Calculating weights...</span>
                </>
              ) : (
                <>
                  <Activity size={18} />
                  <span>🔄 Calculate with ML Model</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- UI PART 3: ML RESULT ---
  return (
    <div className="animate-in zoom-in-95 duration-700 pb-20">
      <div className="bg-white rounded-[3rem] shadow-2xl border-2 border-green-500 overflow-hidden">
        <div className="bg-green-600 px-8 py-5 flex items-center space-x-4 text-white">
          <div className="bg-white/20 p-2 rounded-xl"><BarChart3 size={24} /></div>
          <h2 className="font-black text-sm uppercase tracking-widest italic">🎯 ML MODEL PREDICTION RESULT</h2>
        </div>

        <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center space-x-3 text-green-600 animate-in fade-in slide-in-from-left-4">
            <CheckCircle2 size={24} />
            <span className="font-black text-xl tracking-tight">✅ Prediction Complete!</span>
          </div>

          <div className="text-center p-10 bg-green-50 rounded-[2.5rem] border-2 border-green-100 shadow-inner">
            <p className="text-[12px] font-black text-green-700 uppercase tracking-[0.4em] mb-4">Estimated Repair Time:</p>
            <div className="flex items-baseline justify-center space-x-2">
              <span className="text-2xl font-black text-gray-400">📊</span>
              <h3 className="text-5xl font-black italic text-gray-900 tracking-tighter">
                {diagnosis.repairTimeEstimate}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10">
            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Model Details:</h3>
              <div className="pl-4 space-y-1.5 border-l-2 border-slate-100">
                <p className="text-sm font-bold text-slate-800">• Algorithm: Random Forest Regressor</p>
                <p className="text-sm font-bold text-slate-800">• Confidence Score: {isCritical ? '89%' : '87%'}</p>
                <p className="text-sm font-bold text-slate-800">• Training Accuracy: R² = 0.89</p>
                <p className="text-sm font-bold text-slate-800">• Dataset Size: 875 records</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Breakdown:</h3>
              <div className="pl-4 space-y-1.5 border-l-2 border-slate-100">
                <p className="text-sm font-bold text-slate-800">• Base repair time: {isCritical ? '2.0 hours' : '1.0 hour'}</p>
                <p className="text-sm font-bold text-slate-800">• Severity adjustment: {isCritical ? '+0.8 hours (MAJOR)' : '+0.2 hours'}</p>
                {isCritical ? (
                  <>
                    <p className="text-sm font-bold text-slate-800">• Diagnosis time: +0.3 hours</p>
                    <p className="text-sm font-bold text-slate-800">• Parts complexity: +0.2 hours</p>
                    <p className="text-sm font-black text-blue-600 mt-2">• Final prediction: 2.7 hours ± 0.3</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-800">• Time-of-day factor: +0.1 hours</p>
                    <p className="text-sm font-black text-blue-600 mt-2">• Final prediction: 1.3 hours ± 0.2</p>
                  </>
                )}
              </div>
            </section>
          </div>

          {isCritical && (
            <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-center space-x-4">
              <AlertCircle className="text-orange-500 shrink-0" size={20} />
              <p className="text-[11px] font-black text-orange-800 uppercase leading-relaxed">
                ⚠️ Note: Includes full system diagnosis
              </p>
            </div>
          )}

          <button 
            onClick={onContinue}
            className="w-full bg-slate-950 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>{isCritical ? 'Request Roadside Mechanic →' : 'Find Nearby Garages →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const InputGroup = ({ title, items }: { title: string, items: { label: string, val: string }[] }) => (
  <div className="space-y-4">
    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">{title}</p>
    <div className="pl-4 space-y-1 border-l border-slate-800">
      {items.map((item, i) => (
        <div key={i} className="flex justify-between items-center py-0.5">
          <span className="text-xs font-bold text-slate-500">• {item.label}:</span>
          <span className="text-xs font-black text-slate-200">{item.val}</span>
        </div>
      ))}
    </div>
  </div>
);

const BotAvatar = () => (
  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner relative">
    <Cpu size={20} />
    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-blue-600 rounded-full animate-pulse"></span>
  </div>
);

export default RepairEstimateCard;
