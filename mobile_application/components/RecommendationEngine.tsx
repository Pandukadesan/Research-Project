
import React from 'react';
import { Garage } from '../types';
import { Star, MapPin, Clock, Users, ArrowRight, ShieldCheck, AlertTriangle, Award, Navigation } from 'lucide-react';

interface Props {
  garages: Garage[];
  onSelect: (garage: Garage) => void;
}

const RecommendationEngine: React.FC<Props> = ({ garages, onSelect }) => {
  // Use the exact ranking specified for the VIVA demo
  // 1. Dara (g2), 2. Quick Fix (g4), 3. Motor Vision (g3), 4. Elite (g1), 5. Malabe Service (g5)
  const rankedIds = ['g2', 'g4', 'g3', 'g1', 'g5'];
  const rankedGarages = rankedIds.map(id => garages.find(g => g.id === id)!);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 🏆 FINAL RANKING BOARD */}
      <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <Award className="text-blue-500" size={32} />
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">🏆 Final Ranking</h2>
          </div>
          
          <div className="space-y-4">
            {rankedGarages.map((g, i) => (
              <div key={g.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center space-x-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </span>
                  <p className={`font-black text-sm italic ${i === 0 ? 'text-white' : 'text-slate-500'}`}>{g.name}</p>
                </div>
                {i === 0 && (
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">AI Choice</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-600/10 border border-blue-600/20 rounded-[2rem] p-6 space-y-4">
            <div className="flex items-start space-x-4">
               <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={18} />
               <p className="text-[11px] font-bold text-slate-300 leading-relaxed">
                  <span className="text-white font-black italic">Elite Car Care</span> is the nearest (500m) <br/>
                  <span className="text-red-400 font-black">❌ BUT not recommended due to:</span> <br/>
                  High waiting time | Low rating | Fewer mechanics
               </p>
            </div>
            <div className="flex items-start space-x-4">
               <ShieldCheck className="text-green-500 shrink-0 mt-1" size={18} />
               <p className="text-[11px] font-bold text-slate-300 leading-relaxed">
                  <span className="text-green-500 font-black italic">✅ Dara Garage Wins because:</span> <br/>
                  Zero waiting | High rating | Fast arrival
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {rankedGarages.map((garage, index) => (
          <GarageListingCard 
            key={garage.id} 
            garage={garage} 
            isTop={index === 0} 
            onSelect={() => onSelect(garage)}
          />
        ))}
      </div>
    </div>
  );
};

const GarageListingCard = ({ garage, isTop, onSelect }: { garage: Garage, isTop: boolean, onSelect: () => void }) => {
  return (
    <div className={`bg-white rounded-[2.5rem] p-6 shadow-sm border-2 transition-all active:scale-[0.98] ${isTop ? 'border-blue-600 shadow-xl' : 'border-gray-100'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight italic">{garage.name}</h3>
          <div className="flex items-center space-x-3 mt-1.5">
             <div className="flex items-center space-x-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg">
               <Star size={12} fill="currentColor" />
               <span className="text-xs font-black italic">{garage.rating}</span>
             </div>
             <div className="flex items-center space-x-1 text-gray-400">
               <MapPin size={12} />
               <span className="text-[10px] font-black uppercase tracking-widest">{garage.distance}km</span>
             </div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
          garage.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {garage.availability === 'Available' ? 'Ready' : `Busy (${garage.waitingTime}m)`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center space-x-3 border border-gray-100">
          <Clock className="text-blue-500" size={20} />
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Response</p>
            <p className="text-xs font-black text-gray-800">~{garage.arrivalTime} mins</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center space-x-3 border border-gray-100">
          <Users className="text-blue-500" size={20} />
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Mechanics</p>
            <p className="text-xs font-black text-gray-800">{garage.mechanicsCount} Active</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 mb-6">
         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center"><ShieldCheck size={10} className="mr-1"/> Team Expertise</p>
         <div className="flex flex-wrap gap-2">
            {garage.mechanics.map((m, i) => (
              <span key={i} className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg border border-blue-400/20">{m.years}y Exp</span>
            ))}
         </div>
      </div>

      <button 
        onClick={onSelect}
        className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-xl transition-all ${isTop ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-950 text-white shadow-slate-200'} active:scale-95`}
      >
        <span>Secure Selection</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default RecommendationEngine;
