
import React, { useState, useEffect } from 'react';
import { Garage } from '../types';
import { 
  Navigation, Clock, CheckCircle, CreditCard, 
  Star, MessageSquare, ChevronRight, X, Phone, 
  ShieldCheck, Loader2, Award, Zap, Wrench
} from 'lucide-react';

type ServiceStatus = 'NAVIGATION' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAYMENT' | 'RATING' | 'FINISH';

interface Props {
  garage: Garage;
  onCancel: () => void;
  onFinish: () => void;
}

const ActiveServiceFlow: React.FC<Props> = ({ garage, onCancel, onFinish }) => {
  const [status, setStatus] = useState<ServiceStatus>('NAVIGATION');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handlePayment = () => {
    setIsProcessingPayment(true);
    // 3 seconds delay as requested
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentDone(true);
      setTimeout(() => setStatus('RATING'), 1000);
    }, 3000);
  };

  // Automated Status Simulation for the demo
  useEffect(() => {
    if (status === 'PENDING') {
      const timer = setTimeout(() => setStatus('IN_PROGRESS'), 4000);
      return () => clearTimeout(timer);
    }
    if (status === 'IN_PROGRESS') {
      const timer = setTimeout(() => setStatus('COMPLETED'), 6000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter text-gray-900">{garage.name}</h2>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{garage.address}</p>
        </div>
        {status === 'NAVIGATION' && (
          <button onClick={onCancel} className="p-2 bg-gray-100 rounded-xl text-gray-500"><X size={20}/></button>
        )}
      </div>

      {/* Status Stepper */}
      <div className="flex items-center justify-between px-2">
         {[
           { id: 'NAVIGATION', label: 'Route', icon: Navigation },
           { id: 'IN_PROGRESS', label: 'Repair', icon: Zap },
           { id: 'PAYMENT', label: 'Bill', icon: CreditCard },
           { id: 'RATING', label: 'Review', icon: Star }
         ].map((step, idx) => {
           const isActive = status === step.id || (idx === 1 && status === 'PENDING') || (idx === 1 && status === 'COMPLETED');
           const isDone = (idx === 0 && status !== 'NAVIGATION') || (idx === 1 && (status === 'PAYMENT' || status === 'RATING' || status === 'FINISH')) || (idx === 2 && (status === 'RATING' || status === 'FINISH'));
           
           return (
             <React.Fragment key={step.id}>
               <div className="flex flex-col items-center space-y-2">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                   isDone ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 
                   isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110' : 'bg-gray-100 text-gray-400'
                 }`}>
                   {isDone ? <CheckCircle size={18} /> : <step.icon size={18} />}
                 </div>
                 <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{step.label}</span>
               </div>
               {idx < 3 && <div className={`flex-1 h-0.5 mx-2 rounded-full ${isDone ? 'bg-green-500' : 'bg-gray-100'}`}></div>}
             </React.Fragment>
           );
         })}
      </div>

      {/* Dynamic Content Stages */}
      <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100 shadow-inner min-h-[300px] flex flex-col justify-center">
        
        {status === 'NAVIGATION' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 text-center">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-white space-y-4">
               <div className="flex justify-around">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Arrival</p>
                    <p className="text-xl font-black italic">{garage.arrivalTime} mins</p>
                  </div>
                  <div className="w-px h-10 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-xl font-black italic">{garage.distance} km</p>
                  </div>
               </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-white text-gray-600 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center space-x-2 border border-gray-100 active:bg-gray-50">
                <Phone size={18} /> <span>Call Shop</span>
              </button>
              <button 
                onClick={() => setStatus('PENDING')}
                className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all"
              >
                <span>Confirm Arrival</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {status === 'PENDING' && (
          <div className="text-center space-y-4 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl"><Clock size={40} className="animate-spin-slow"/></div>
             <h3 className="text-xl font-black italic">Waiting for Check-in</h3>
             <p className="text-sm font-bold text-gray-500 leading-relaxed px-6">The garage is notified of your arrival. A service bay is being prepared for your vehicle.</p>
          </div>
        )}

        {status === 'IN_PROGRESS' && (
          <div className="text-center space-y-6 animate-in slide-in-from-right-4">
             <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-blue-100 shadow-2xl relative">
                {/* Fixed: Wrench is now imported */}
                <Wrench size={48} className="animate-bounce" />
                <div className="absolute -top-2 -right-2 bg-blue-600 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white"><Loader2 size={14} className="animate-spin"/></div>
             </div>
             <div>
                <h3 className="text-2xl font-black italic text-gray-900">Repair in Progress</h3>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Status: Active Repair Bay 04</p>
             </div>
             <div className="bg-white p-5 rounded-3xl border border-blue-100 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-gray-400">Assigned Mechanic</span>
                   <span className="text-gray-800">{garage.mechanics[0].name}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                   <div className="bg-blue-600 h-full w-2/3 animate-pulse"></div>
                </div>
             </div>
          </div>
        )}

        {status === 'COMPLETED' && (
          <div className="text-center space-y-6 animate-in zoom-in-95">
             <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-200"><CheckCircle size={40} /></div>
             <div>
               <h3 className="text-2xl font-black italic">Service Finished!</h3>
               <p className="text-sm font-bold text-gray-500">Your vehicle is ready for pick-up. Final testing completed successfully.</p>
             </div>
             <button 
              onClick={() => setStatus('PAYMENT')}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all"
             >
               <span>View Final Invoice</span>
               <ChevronRight size={18} />
             </button>
          </div>
        )}

        {status === 'PAYMENT' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="text-center pb-4">
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Final Settlement</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Job #JB-2024-991</p>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-6">
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400">Base Service Fee</span>
                    <span className="text-gray-900 italic">LKR 2,500</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400">Parts (Brake Pads)</span>
                    <span className="text-gray-900 italic">LKR 1,850</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400">Service Tax (5%)</span>
                    <span className="text-gray-900 italic">LKR 217</span>
                  </div>
                  <div className="h-px bg-gray-100 my-4"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Total Payable</span>
                    <span className="text-2xl font-black italic text-blue-600 tracking-tighter">LKR 4,567</span>
                  </div>
               </div>
            </div>

            {isProcessingPayment ? (
               <div className="bg-blue-600 text-white py-5 rounded-3xl flex flex-col items-center justify-center space-y-3 animate-pulse">
                  <Loader2 size={24} className="animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Encrypting Payment...</p>
               </div>
            ) : paymentDone ? (
               <div className="bg-green-500 text-white py-5 rounded-3xl flex items-center justify-center space-x-3 animate-in zoom-in-105">
                  <ShieldCheck size={24} />
                  <p className="text-[12px] font-black uppercase tracking-widest">Payment Complete!</p>
               </div>
            ) : (
              <button 
                onClick={handlePayment}
                className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-4"
              >
                <CreditCard size={20} />
                <span>Pay Manually</span>
              </button>
            )}
          </div>
        )}

        {status === 'RATING' && (
          <div className="space-y-8 animate-in zoom-in-95 text-center">
             <div className="space-y-2">
                <Award className="text-amber-500 mx-auto" size={48} />
                <h3 className="text-2xl font-black italic">Rate your Experience</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Help others find reliable care</p>
             </div>
             
             <div className="flex justify-center space-x-3">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRating(star)} className={`p-2 transition-transform active:scale-90 ${rating >= star ? 'text-amber-500' : 'text-gray-200'}`}>
                    <Star size={36} fill={rating >= star ? 'currentColor' : 'none'} strokeWidth={3} />
                  </button>
                ))}
             </div>

             <div className="space-y-3 px-4">
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the service quality..."
                  className="w-full bg-white border border-gray-100 rounded-[1.5rem] p-5 text-sm font-bold min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>

             <button 
              onClick={onFinish}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all"
             >
               Submit & Close Log
             </button>
          </div>
        )}

      </div>
      
      {/* Dynamic Visual Indicator */}
      {status !== 'RATING' && (
        <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-3xl border border-blue-100">
           <Zap size={20} className="text-blue-500" />
           <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest leading-relaxed">
             Real-time telematics linked with Workshop CMS 
           </p>
        </div>
      )}
    </div>
  );
};

export default ActiveServiceFlow;
