
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import RepairEstimateCard from './components/RepairEstimateCard';
import RecommendationEngine from './components/RecommendationEngine';
import ActiveServiceFlow from './components/ActiveServiceFlow';
import GaragePortal from './components/GaragePortal';
import { UserRole, User, Vehicle, DiagnosisResult, Garage } from './types';
import { MOCK_DRIVER, DUMMY_GARAGES, SLIIT_LOCATION } from './constants';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Car, Wrench, ShieldCheck, Map as MapIcon, ChevronRight, Star, History, DollarSign, User as UserIcon, Settings, MapPin, CheckCircle } from 'lucide-react';

// --- Custom Components for Map ---

const MidpointETAMarker = ({ pos1, pos2, time }: { pos1: [number, number], pos2: [number, number], time: string }) => {
  const midpoint: [number, number] = [
    (pos1[0] + pos2[0]) / 2,
    (pos1[1] + pos2[1]) / 2
  ];
  
  return (
    <Marker position={midpoint} icon={new L.DivIcon({
      className: 'eta-label',
      html: `
        <div class="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl border-2 border-white flex items-center space-x-1 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>${time}m ETA</span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [35, 12]
    })} />
  );
};

const MapController = ({ driverLoc, targetLoc }: { driverLoc: [number, number], targetLoc?: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (targetLoc) {
      const bounds = L.latLngBounds([driverLoc, targetLoc]);
      map.fitBounds(bounds, { padding: [80, 80], animate: true, duration: 1.5 });
    } else {
      map.setView(driverLoc, 15, { animate: true });
    }
  }, [driverLoc, targetLoc, map]);

  return null;
};

// --- Main App ---

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [vehicles] = useState<Vehicle[]>([
    { id: '1', model: 'Suzuki Alto', year: 2018, mileage: 45000, transmission: 'Manual', registration: 'WP-CAS-1234' }
  ]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Icons Configuration
  const driverIcon = useMemo(() => new L.DivIcon({
    className: 'custom-driver-icon',
    html: `
      <div class="relative">
        <div class="driver-marker-pulse"></div>
        <div style="background-color: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5); display: flex; align-items: center; justify-content: center; color: white;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  }), []);

  const getGarageIcon = (garage: Garage) => {
    const isBest = garage.id === 'g2';
    const isSelected = selectedGarage?.id === garage.id;
    const color = isSelected ? '#3b82f6' : (isBest ? '#10b981' : '#1f2937');
    const size = isSelected ? 48 : 38;

    return new L.DivIcon({
      className: 'custom-garage-icon',
      html: `
        <div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 14px; border: 3px solid white; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center; color: white; transform: rotate(45deg); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
          <div style="transform: rotate(-45deg);">
            <svg xmlns="http://www.w3.org/2000/svg" width="${size - 18}" height="${size - 18}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  const handleServiceComplete = () => {
    setDiagnosis(null);
    setShowRecommendation(false);
    setSelectedGarage(null);
    setActiveTab('home');
  };

  if (!role) {
    return <RoleSelector onSelect={(r) => { setRole(r); if (r === UserRole.DRIVER) setUser(MOCK_DRIVER); }} />;
  }

  if (role === UserRole.GARAGE) {
    return <GaragePortal onExit={() => setRole(null)} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} role={role} userName={user?.name || 'Guest'}>
      {activeTab === 'home' && (
        <div className="p-4 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-1 italic">Ready for the road?</h2>
              <p className="text-blue-100 text-sm font-medium opacity-80 uppercase tracking-widest text-[10px]">Active Vehicle: Suzuki Alto</p>
              <div className="mt-6">
                 <button onClick={() => { setActiveTab('chat'); setDiagnosis(null); setShowRecommendation(false); }} className="bg-white text-blue-700 px-8 py-3 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center space-x-2">
                    <Wrench size={18}/>
                    <span>Start Diagnosis</span>
                 </button>
              </div>
            </div>
            <Car size={180} className="absolute -right-12 -bottom-12 text-white/10 rotate-12" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={MapPin} label="Nearby" value="12" sub="Active Garages" color="bg-blue-500" />
            <StatCard icon={ShieldCheck} label="Health Score" value="94%" sub="Optimal Condition" color="bg-green-500" />
          </div>

          <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-black text-gray-800">Recent Service History</h3>
               <button className="text-blue-600 font-bold text-xs uppercase">History</button>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-gray-50 last:border-0">
                   <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><CheckCircle size={18} /></div>
                      <div>
                        <p className="text-sm font-bold">Brake Service</p>
                        <p className="text-[10px] text-gray-400 font-bold">12 Sep 2024</p>
                      </div>
                   </div>
                   <span className="text-sm font-black text-gray-700">LKR 12,400</span>
                </div>
             </div>
          </section>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="h-full flex flex-col relative overflow-hidden">
          {!diagnosis ? (
            <Chatbot user={user!} vehicles={vehicles} onDiagnosisComplete={setDiagnosis} />
          ) : !showRecommendation ? (
            <div className="p-4 flex-1">
              <RepairEstimateCard diagnosis={diagnosis} onContinue={() => setShowRecommendation(true)} />
            </div>
          ) : (
            <div className="h-full w-full bg-gray-50 flex flex-col relative">
              {/* Map Layer */}
              <div className="absolute inset-0 z-0">
                <MapContainer center={SLIIT_LOCATION} zoom={15} className="h-full w-full" zoomControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  <Marker position={SLIIT_LOCATION} icon={driverIcon} />

                  {DUMMY_GARAGES.map((g) => (
                    <Marker key={g.id} position={g.location} icon={getGarageIcon(g)} />
                  ))}

                  {selectedGarage && (
                    <>
                      <Polyline positions={[SLIIT_LOCATION, selectedGarage.location]} color="#3b82f6" weight={6} opacity={0.6} lineCap="round" dashArray="10, 15" />
                      <MidpointETAMarker pos1={SLIIT_LOCATION} pos2={selectedGarage.location} time={selectedGarage.arrivalTime?.toString() || "2"} />
                      <MapController driverLoc={SLIIT_LOCATION} targetLoc={selectedGarage.location} />
                    </>
                  )}
                  {!selectedGarage && <MapController driverLoc={SLIIT_LOCATION} />}
                </MapContainer>
              </div>

              {/* Top Status Bar */}
              <div className="absolute top-4 left-4 right-4 z-[1000]">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2 rounded-xl text-white"><MapPin size={20}/></div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                        <p className="text-xs font-black text-gray-800">{selectedGarage ? 'Routing to Site' : 'Finding Nearby Hubs'}</p>
                      </div>
                   </div>
                   {!selectedGarage && (
                     <button onClick={() => setShowRecommendation(false)} className="bg-gray-100 p-2 rounded-xl text-gray-500"><History size={18}/></button>
                   )}
                </div>
              </div>

              {/* The "Swipeable" Sheet logic */}
              <div 
                className={`absolute bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] transition-all duration-500 ease-in-out flex flex-col ${isSheetOpen || selectedGarage ? 'h-[88vh]' : 'h-[140px]'}`}
              >
                {/* Drag Handle */}
                <div className="w-full py-4 flex flex-col items-center cursor-pointer" onClick={() => setIsSheetOpen(!isSheetOpen)}>
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-4"></div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-12 no-scrollbar">
                  {selectedGarage ? (
                    <ActiveServiceFlow 
                      garage={selectedGarage} 
                      onCancel={() => setSelectedGarage(null)} 
                      onFinish={handleServiceComplete}
                    />
                  ) : (
                    <RecommendationEngine 
                      garages={DUMMY_GARAGES} 
                      onSelect={(g) => {
                        setSelectedGarage(g);
                        setIsSheetOpen(true);
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'map' && (
        <div className="h-full relative">
           <MapContainer center={SLIIT_LOCATION} zoom={15} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={SLIIT_LOCATION} icon={driverIcon} />
            {DUMMY_GARAGES.map(g => (
              <Marker key={g.id} position={g.location} icon={getGarageIcon(g)}>
                <Popup>
                  <div className="p-2">
                    <h4 className="font-black text-gray-900">{g.name}</h4>
                    <p className="text-xs text-gray-500 font-bold">{g.status} • {g.rating} ⭐</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="p-6 space-y-6 pb-32">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-[2rem] bg-blue-600 border-4 border-white shadow-2xl flex items-center justify-center text-white text-3xl font-black mb-4 transform rotate-6 relative">
              <span className="-rotate-6">K</span>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                 <ShieldCheck size={14} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-800">Kavindu Perera</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verified Driver • Elite Member</p>
          </div>
          <div className="space-y-3">
             <MenuLink label="Service Records" sub="Manage maintenance history" icon={History} />
             <MenuLink label="Connected Vehicles" sub="Suzuki Alto, Toyota Vitz" icon={Car} />
             <MenuLink label="App Settings" sub="Preferences & Security" icon={Settings} />
          </div>
          <button onClick={() => setRole(null)} className="w-full bg-red-50 text-red-600 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] border-2 border-red-100 active:scale-95 transition-all mt-4">
            Sign Out Securely
          </button>
        </div>
      )}
    </Layout>
  );
};

// --- Sub-components ---

const RoleSelector = ({ onSelect }: { onSelect: (r: UserRole) => void }) => (
  <div className="h-screen max-w-md mx-auto bg-white flex flex-col justify-center p-8 space-y-10 relative overflow-hidden">
    <div className="text-center relative z-10">
      <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-[0_20px_50px_rgba(59,130,246,0.3)] mb-10 transform rotate-6 scale-110">
        <Car size={50} strokeWidth={2.5} className="-rotate-6" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 leading-tight mb-2 tracking-tighter italic">AutoCare<span className="text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-8">AI</span></h1>
      <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4">Intelligent Pit Stop</p>
    </div>
    <div className="space-y-4 relative z-10">
      <RoleButton icon={UserIcon} label="I am a Driver" desc="Smart AI Repair Diagnostics" onClick={() => onSelect(UserRole.DRIVER)} color="blue" />
      <RoleButton icon={Wrench} label="I am a Garage" desc="Manage Bookings & Workshop" onClick={() => onSelect(UserRole.GARAGE)} color="purple" />
    </div>
  </div>
);

const RoleButton = ({ icon: Icon, label, desc, onClick, color }: any) => {
  const colors: any = {
    blue: 'border-blue-100 hover:bg-blue-50 text-blue-600',
    purple: 'border-purple-100 hover:bg-purple-50 text-purple-600'
  };
  return (
    <button onClick={onClick} className={`w-full text-left p-6 border-2 rounded-[2.5rem] transition-all active:scale-[0.97] shadow-sm flex items-center space-x-6 bg-white ${colors[color]}`}>
      <div className="p-4 rounded-2xl bg-white shadow-xl border border-inherit">
        <Icon size={28} />
      </div>
      <div>
        <p className="font-black text-gray-800 text-xl leading-none mb-1">{label}</p>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{desc}</p>
      </div>
    </button>
  );
};

const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-inherit/20`}>
      <Icon size={24} />
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">{label}</p>
    <p className="text-2xl font-black text-gray-800 leading-none">{value}</p>
    <p className="text-[9px] font-black text-gray-400 mt-2 uppercase tracking-tight truncate">{sub}</p>
  </div>
);

const MenuLink = ({ label, sub, icon: Icon }: { label: string, sub: string, icon: any }) => (
  <button className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] shadow-sm border border-gray-50 active:bg-gray-50 active:scale-[0.98] transition-all">
     <div className="flex items-center space-x-5">
       <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
          <Icon size={22} />
       </div>
       <div className="text-left">
         <p className="text-sm font-black text-gray-800 leading-tight mb-0.5">{label}</p>
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sub}</p>
       </div>
     </div>
     <ChevronRight className="text-gray-300" size={20} />
  </button>
);

export default App;
