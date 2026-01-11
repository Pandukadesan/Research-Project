
import React, { useState, useEffect, useRef } from 'react';
import { Garage, GarageRegistrationStatus, Job, MechanicStaff, UserRole, FaultSeverity } from '../types';
import { SLIIT_LOCATION } from '../constants';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  Building2, User, Mail, Phone, Clock, FileCheck, MapPin, 
  ChevronRight, CheckCircle, AlertCircle, LayoutDashboard, 
  Wrench, Users, Wallet, Power, Bell, MoreVertical, 
  ArrowLeft, Upload, Check, X, Camera, Plus, LogOut, Loader2,
  Star, Car, Trash2, Navigation, Info
} from 'lucide-react';

// --- Types & Interfaces ---
interface RegistrationForm {
  name: string;
  owner: string;
  email: string;
  phone: string;
  type: 'Local' | 'Authorized';
  regNumber: string;
  address: string;
  location: [number, number];
  operatingHours: string;
}

// --- Main Portal Component ---
const GaragePortal: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [status, setStatus] = useState<GarageRegistrationStatus>(GarageRegistrationStatus.UNVERIFIED);
  const [garageProfile, setGarageProfile] = useState<Garage | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'mechanics' | 'earnings'>('dashboard');

  // Registration handlers
  const handleStartRegistration = (email: string) => {
    // Skipping VERIFYING_OTP as requested
    setStatus(GarageRegistrationStatus.REGISTERING);
  };

  const handleFinalSubmit = (profile: Garage) => {
    setGarageProfile(profile);
    setStatus(GarageRegistrationStatus.PENDING_APPROVAL);
  };

  // Logic rendering
  if (status === GarageRegistrationStatus.UNVERIFIED) return <VerificationScreen onVerify={handleStartRegistration} onBack={onExit} />;
  if (status === GarageRegistrationStatus.REGISTERING) return <RegistrationFlow onSubmit={handleFinalSubmit} onBack={() => setStatus(GarageRegistrationStatus.UNVERIFIED)} />;
  if (status === GarageRegistrationStatus.PENDING_APPROVAL) return <PendingApprovalScreen onComplete={() => setStatus(GarageRegistrationStatus.APPROVED)} onBack={onExit} />;

  // Main Operations View
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 overflow-hidden shadow-2xl relative text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md px-5 py-4 flex justify-between items-center border-b border-white/5 z-50">
        <div>
          <h1 className="text-lg font-black tracking-tight text-blue-400">Workshop Console</h1>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{garageProfile?.name || 'Precision Motors'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center relative border border-white/10">
            <Bell size={20} className="text-slate-300" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          <button onClick={onExit} className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500 active:scale-95 transition-all">
             <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-4 pt-6 space-y-6 scroll-smooth">
        {activeTab === 'dashboard' && <GarageDashboard profile={garageProfile!} />}
        {activeTab === 'jobs' && <JobManager />}
        {activeTab === 'mechanics' && <MechanicManagement />}
        {activeTab === 'earnings' && <EarningsTracking />}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 py-5 px-6 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <NavButton active={activeTab === 'dashboard'} icon={LayoutDashboard} label="Control" onClick={() => setActiveTab('dashboard')} />
        <NavButton active={activeTab === 'jobs'} icon={Wrench} label="Workload" onClick={() => setActiveTab('jobs')} />
        <NavButton active={activeTab === 'mechanics'} icon={Users} label="Staff" onClick={() => setActiveTab('mechanics')} />
        <NavButton active={activeTab === 'earnings'} icon={Wallet} label="Revenue" onClick={() => setActiveTab('earnings')} />
      </nav>
    </div>
  );
};

// --- Sub-screens ---

const VerificationScreen = ({ onVerify, onBack }: any) => {
  const [email, setEmail] = useState('');
  return (
    <div className="h-screen max-w-md mx-auto bg-slate-950 flex flex-col justify-center p-8 space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <button onClick={onBack} className="absolute top-12 left-8 text-slate-500 flex items-center space-x-2 font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/><span>Exit Portal</span></button>
      
      <div className="text-center relative z-10">
        <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-[0_20px_50px_rgba(59,130,246,0.3)] mb-8 transform rotate-6 scale-110">
          <Building2 size={48} className="-rotate-6" />
        </div>
        <h2 className="text-4xl font-black text-white italic tracking-tighter">Workshop<br/><span className="text-blue-500">Registration</span></h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-6 leading-relaxed">Join the AI-powered network of<br/>authorized repair centers</p>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="space-y-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Work Email Address</p>
           <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="garage@example.com"
            className="w-full bg-slate-900 border-2 border-slate-800 p-6 rounded-[2rem] text-white font-bold outline-none focus:border-blue-600 focus:bg-slate-800 transition-all placeholder:text-slate-700"
          />
        </div>
        <button 
          onClick={() => email && onVerify(email)}
          className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
        >
          Create Workshop Account
        </button>
        <p className="text-center text-slate-600 text-[9px] font-bold uppercase tracking-widest">By continuing you agree to service level terms</p>
      </div>
    </div>
  );
};

const RegistrationFlow = ({ onSubmit, onBack }: any) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegistrationForm>({
    name: '', owner: '', email: '', phone: '', type: 'Local',
    regNumber: '', address: '', location: SLIIT_LOCATION, operatingHours: '8:00 AM - 6:00 PM'
  });

  const next = () => setStep(step + 1);

  const MapSelector = () => {
    const map = useMapEvents({
      click(e) {
        setForm({...form, location: [e.latlng.lat, e.latlng.lng]});
      },
    });
    return form.location ? <Marker position={form.location} /> : null;
  };

  return (
    <div className="h-screen max-w-md mx-auto bg-slate-950 flex flex-col p-8 overflow-y-auto pb-32 scroll-smooth">
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => step > 1 ? setStep(step - 1) : onBack()} className="text-slate-500 bg-slate-900 w-10 h-10 rounded-full flex items-center justify-center border border-white/5"><ArrowLeft size={18} /></button>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Progress</span>
          <div className="flex space-x-1 mt-1">
             {[1,2,3,4].map(i => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 w-6' : 'bg-slate-800 w-3'}`}></div>)}
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
           <div className="space-y-2">
             <h3 className="text-3xl font-black italic">Identity</h3>
             <p className="text-slate-500 text-xs font-bold">Business and ownership details.</p>
           </div>
           <div className="space-y-5">
              <RegInput label="Workshop Legal Name" value={form.name} onChange={(v) => setForm({...form, name: v})} placeholder="Ex: Precision Motors Ltd" />
              <RegInput label="Primary Owner" value={form.owner} onChange={(v) => setForm({...form, owner: v})} placeholder="Ex: Kavindu Perera" />
              <RegInput label="Direct Contact #" value={form.phone} onChange={(v) => setForm({...form, phone: v})} placeholder="+94 77 123 4567" />
           </div>
           <button onClick={next} className="w-full bg-blue-600 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] mt-8 shadow-xl shadow-blue-600/10 active:scale-95 transition-all">Proceed to Step 2</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
           <div className="space-y-2">
             <h3 className="text-3xl font-black italic">Verification</h3>
             <p className="text-slate-500 text-xs font-bold">Registration and legal proof.</p>
           </div>
           <div className="space-y-5">
              <div className="flex space-x-3">
                 <button onClick={() => setForm({...form, type: 'Authorized'})} className={`flex-1 p-6 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex flex-col items-center space-y-2 ${form.type === 'Authorized' ? 'border-blue-600 bg-blue-600/10 text-blue-400 shadow-xl shadow-blue-600/10' : 'border-slate-900 bg-slate-900/50 text-slate-600'}`}>
                    <CheckCircle size={18} />
                    <span>Authorized</span>
                 </button>
                 <button onClick={() => setForm({...form, type: 'Local'})} className={`flex-1 p-6 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex flex-col items-center space-y-2 ${form.type === 'Local' ? 'border-blue-600 bg-blue-600/10 text-blue-400 shadow-xl shadow-blue-600/10' : 'border-slate-900 bg-slate-900/50 text-slate-600'}`}>
                    <Wrench size={18} />
                    <span>Local Shop</span>
                 </button>
              </div>
              <RegInput label="Business Reg Number" value={form.regNumber} onChange={(v) => setForm({...form, regNumber: v})} placeholder="BR-XXXXXXX" />
              <div className="p-10 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 bg-slate-900/30 group hover:border-blue-500/50 transition-all cursor-pointer">
                 <div className="p-4 bg-slate-800 rounded-2xl text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-all"><Upload size={24} /></div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Cert</p>
                    <p className="text-[8px] font-bold text-slate-600 mt-1 uppercase">PDF, JPG or PNG (Max 5MB)</p>
                 </div>
              </div>
           </div>
           <button onClick={next} className="w-full bg-blue-600 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] mt-4 shadow-xl shadow-blue-600/10 active:scale-95 transition-all">Upload & Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-300 h-full flex flex-col">
           <div className="space-y-2">
             <h3 className="text-3xl font-black italic">Mapping</h3>
             <p className="text-slate-500 text-xs font-bold">Pinpoint your exact location.</p>
           </div>
           <RegInput label="Official Address" value={form.address} onChange={(v) => setForm({...form, address: v})} placeholder="Ex: 123/A, Kaduwela Rd, Malabe" />
           <div className="flex-1 min-h-[300px] rounded-[2.5rem] overflow-hidden border-2 border-slate-900 relative shadow-2xl">
              <MapContainer center={SLIIT_LOCATION} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapSelector />
              </MapContainer>
              <div className="absolute top-4 right-4 z-[1000] bg-white text-slate-900 p-2 rounded-xl shadow-xl">
                 <MapPin size={20} />
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-xl p-4 rounded-3xl z-[1000] border border-white/5 flex items-center space-x-4">
                 {/* Fix: Navigation icon is now imported */}
                 <div className="bg-blue-600 w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0"><Navigation size={20} className="animate-pulse" /></div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">Tap the map to position your shop's GPS coordinate accurately for drivers.</p>
              </div>
           </div>
           <button onClick={next} className="w-full bg-blue-600 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] mt-6 shadow-xl shadow-blue-600/10 active:scale-95 transition-all">Set GPS Origin</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
           <div className="space-y-2">
             <h3 className="text-3xl font-black italic">Review</h3>
             <p className="text-slate-500 text-xs font-bold">Final check before validation.</p>
           </div>
           <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <SummaryItem label="Workshop" value={form.name} />
              <SummaryItem label="Ownership" value={form.owner} />
              <SummaryItem label="Auth Type" value={form.type} />
              <SummaryItem label="Base Hours" value={form.operatingHours} />
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Location Data</p>
                <div className="flex items-center space-x-3 text-xs font-bold text-slate-400">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span>Coordinate Locked: {form.location[0].toFixed(4)}, {form.location[1].toFixed(4)}</span>
                </div>
              </div>
           </div>
           <div className="p-5 bg-blue-600/5 rounded-3xl border border-blue-600/10">
              <p className="text-[10px] font-medium text-blue-400/80 italic leading-relaxed">Account activation requires 24-48 hours for document verification. You will be notified via email.</p>
           </div>
           <button 
            onClick={() => onSubmit({
              ...form, id: 'g_new', regStatus: GarageRegistrationStatus.PENDING_APPROVAL, rating: 0, mechanicsCount: 0, mechanics: [], status: 'Closed', availability: 'Busy', waitingTime: 0
            })} 
            className="w-full bg-green-600 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] mt-8 shadow-2xl shadow-green-600/20 active:scale-95 transition-all"
           >
             Finish & Submit
           </button>
        </div>
      )}
    </div>
  );
};

const PendingApprovalScreen = ({ onComplete }: any) => {
  return (
    <div className="h-screen max-w-md mx-auto bg-slate-950 flex flex-col items-center justify-center p-10 text-center space-y-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="w-32 h-32 bg-blue-600/10 rounded-[3rem] flex items-center justify-center text-blue-500 border-2 border-blue-500/20 animate-pulse relative z-10">
        <Loader2 size={64} className="animate-spin" />
      </div>
      <div className="relative z-10 space-y-4">
        <h2 className="text-4xl font-black italic tracking-tighter">Under Review</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[11px] leading-loose max-w-[280px] mx-auto">Admin is currently verifying your business credentials and GPS location pinpoint.</p>
      </div>
      <button onClick={onComplete} className="relative z-10 text-slate-800 text-[10px] uppercase font-black tracking-[0.3em] hover:text-blue-600 transition-all border border-slate-900 px-6 py-3 rounded-full hover:border-blue-600/30 mt-10">Simulation: Bypass</button>
    </div>
  );
};

// --- Portal Operational Components ---

const GarageDashboard = ({ profile }: { profile: Garage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availability, setAvailability] = useState<'Available' | 'Busy'>('Available');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Availability Control */}
      <section className="bg-slate-900 rounded-[2.5rem] p-7 border border-white/5 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-black italic text-xl text-slate-100">Operation Center</h3>
          <div className={`px-4 py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-[0.2em] ${isOpen ? 'bg-green-500/10 border-green-500/50 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
            {isOpen ? 'Online' : 'Offline'}
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-5 bg-slate-950 rounded-[2rem] border border-white/5 shadow-inner">
             <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-slate-800 text-slate-600'}`}>
                   <Power size={24} />
                </div>
                <div>
                   <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-200 block">Workshop Status</span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{isOpen ? 'Publicly Visible' : 'Hidden from drivers'}</span>
                </div>
             </div>
             <button onClick={() => setIsOpen(!isOpen)} className={`w-16 h-9 rounded-full transition-all relative p-1.5 shadow-xl ${isOpen ? 'bg-blue-600' : 'bg-slate-800'}`}>
                <div className={`w-6 h-6 bg-white rounded-full shadow-2xl transition-all transform ${isOpen ? 'translate-x-7' : 'translate-x-0'}`}></div>
             </button>
          </div>

          {/* Sub Toggles */}
          {isOpen && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-6 duration-300">
               <button 
                onClick={() => setAvailability('Available')}
                className={`p-6 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-[0.2em] flex flex-col items-center space-y-3 transition-all ${availability === 'Available' ? 'bg-blue-600 border-blue-600 text-white shadow-[0_15px_40px_rgba(37,99,235,0.25)] scale-105 z-10' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
               >
                 <div className={`p-3 rounded-2xl ${availability === 'Available' ? 'bg-white/20' : 'bg-slate-800'}`}><CheckCircle size={20} /></div>
                 <span>Available</span>
               </button>
               <button 
                onClick={() => setAvailability('Busy')}
                className={`p-6 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-[0.2em] flex flex-col items-center space-y-3 transition-all ${availability === 'Busy' ? 'bg-orange-600 border-orange-600 text-white shadow-[0_15px_40px_rgba(234,88,12,0.25)] scale-105 z-10' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
               >
                 <div className={`p-3 rounded-2xl ${availability === 'Busy' ? 'bg-white/20' : 'bg-slate-800'}`}><Clock size={20} /></div>
                 <span>Busy Bay</span>
               </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
         <GarageStatCard label="Live Jobs" value="03" sub="Bay Occupancy" icon={Wrench} color="text-blue-500" />
         <GarageStatCard label="Earnings" value="LKR 18.5k" sub="Settled Today" icon={Wallet} color="text-green-500" />
         <GarageStatCard label="Mechanics" value="05" sub="Checked-In" icon={Users} color="text-purple-500" />
         <GarageStatCard label="Reliability" value="98%" sub="Top Tier" icon={CheckCircle} color="text-orange-500" />
      </div>

      {/* Activity Feed */}
      <section className="bg-white/5 border border-white/5 p-7 rounded-[2.5rem] shadow-xl">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
               <Bell size={20} className="text-blue-500" />
               <h3 className="font-black text-xs uppercase tracking-widest text-slate-200">Workshop Alerts</h3>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
         </div>
         <div className="space-y-6">
            <ActivityItem label="Incoming Route" sub="Prius Hybrid • ETA 4m" time="Just now" highlight />
            <ActivityItem label="Job Settlement" sub="JB-992 Complete" time="15m ago" />
            <ActivityItem label="Staff Alert" sub="Amila checked in" time="1h ago" />
         </div>
      </section>
    </div>
  );
};

const JobManager = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'JB-101',
      driverId: 'd1',
      driverName: 'Kavindu Perera',
      driverPhone: '077 123 4567',
      assignedId: 'g1',
      assignedType: UserRole.GARAGE,
      status: 'Pending',
      isPaid: false,
      createdAt: Date.now(),
      diagnosis: {
        vehicle: { model: 'Suzuki Alto', year: 2018, mileage: 45000, transmission: 'Manual', id: '1', registration: 'WP CAS 1234' },
        faultCategory: 'Brakes',
        faultType: 'Pad Wear',
        severity: FaultSeverity.MODERATE,
        partsRequired: ['Brake Pads', 'Sensor'],
        isDrivable: true,
        symptoms: ['Squealing noise'],
        confidence: 89,
        repairTimeEstimate: '1.5 hours',
        urgency: 'MEDIUM'
      }
    }
  ]);

  const updateJobStatus = (id: string, status: any) => {
    setJobs(jobs.map(j => j.id === id ? {...j, status} : j));
  };

  const removeJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between px-2">
         <h3 className="text-2xl font-black italic">Active Pipeline</h3>
         <div className="bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{jobs.length} WORK ORDERS</div>
      </div>
      
      {jobs.length === 0 ? (
        <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-12 text-center space-y-4">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600"><Wrench size={32}/></div>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Bay is clear for intake</p>
        </div>
      ) : jobs.map(job => (
        <div key={job.id} className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl group transition-all">
           <div className="bg-slate-800/60 p-6 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl rotate-3"><Car size={24} className="-rotate-3" /></div>
                 <div>
                    <p className="text-xs font-black uppercase text-slate-100 tracking-widest">{job.diagnosis.vehicle.model}</p>
                    <div className="flex items-center space-x-2 mt-1">
                       <span className="text-[10px] font-bold text-slate-500">{job.diagnosis.vehicle.registration}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                       <span className="text-[10px] font-bold text-blue-400">#ID:{job.id}</span>
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">State</p>
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${job.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 animate-pulse' : 'bg-blue-500/10 text-blue-400'}`}>
                    {job.status}
                 </span>
              </div>
           </div>
           
           <div className="p-7 space-y-7">
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Driver Contact</p>
                    <div className="space-y-1">
                       <p className="text-sm font-black text-slate-200">{job.driverName}</p>
                       <p className="text-[11px] font-bold text-blue-400/80 underline">{job.driverPhone}</p>
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Issue Profile</p>
                    <div className="space-y-1">
                       <p className="text-sm font-black text-slate-200">{job.diagnosis.faultCategory}</p>
                       <p className="text-[10px] font-black text-orange-400/80 uppercase">{job.diagnosis.severity} SEVERITY</p>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-3xl border border-white/5 relative overflow-hidden">
                 {/* Fix: Info icon is now imported */}
                 <div className="absolute top-0 right-0 p-3"><Info size={14} className="text-slate-800" /></div>
                 <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3">AI Diagnostic Summary</p>
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <p className="text-xs font-bold text-slate-400">Repair Window: <span className="text-slate-100">{job.diagnosis.repairTimeEstimate}</span></p>
                       <p className="text-xs font-bold text-slate-400">Confidence: <span className="text-blue-400">{job.diagnosis.confidence}%</span></p>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                       <Clock size={16} className="text-slate-500" />
                    </div>
                 </div>
              </div>

              {job.status === 'Pending' ? (
                <div className="flex space-x-4">
                   <button onClick={() => removeJob(job.id)} className="flex-1 bg-slate-800 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 border border-white/5 active:scale-95 transition-all flex items-center justify-center space-x-2"><X size={14}/><span>Decline</span></button>
                   <button onClick={() => updateJobStatus(job.id, 'Accepted')} className="flex-1 bg-blue-600 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] text-white shadow-2xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center space-x-2"><Check size={14}/><span>Accept Job</span></button>
                </div>
              ) : job.status === 'Accepted' ? (
                <button onClick={() => updateJobStatus(job.id, 'In Progress')} className="w-full bg-blue-500 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl active:scale-95 transition-all">Move to Bay (In Progress)</button>
              ) : (
                <div className="flex items-center justify-between p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl">
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Currently in repair bay</span>
                   <button onClick={() => removeJob(job.id)} className="bg-blue-600 p-2 rounded-lg text-white"><Check size={14} /></button>
                </div>
              )}
           </div>
        </div>
      ))}
    </div>
  );
};

const MechanicManagement = () => {
  const [mechanics, setMechanics] = useState<MechanicStaff[]>([
    { id: 'm1', name: 'Jagath Kumara', years: 12, specialization: 'Engine Specialist', isAvailable: true, attendance: 'Checked-In' },
    { id: 'm2', name: 'Amila Perera', years: 5, specialization: 'Electrical & AC', isAvailable: false, attendance: 'Checked-Out' },
    { id: 'm3', name: 'Saman Gunasekara', years: 8, specialization: 'Body & Paint', isAvailable: true, attendance: 'Checked-In' },
  ]);

  const toggleAttendance = (id: string) => {
    setMechanics(mechanics.map(m => 
      m.id === id ? { ...m, attendance: m.attendance === 'Checked-In' ? 'Checked-Out' : 'Checked-In' } : m
    ));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between px-2">
         <h3 className="text-2xl font-black italic">Staff Roster</h3>
         <button className="bg-blue-600 w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-blue-600/20 active:scale-90 transition-all"><Plus size={24} /></button>
      </div>

      <div className="space-y-5">
         {mechanics.map(m => (
           <div key={m.id} className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-all"></div>
              <div className="flex items-center space-x-5">
                 <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-500 text-xl font-black border border-white/5 shadow-inner">{m.name.charAt(0)}</div>
                 <div>
                    <h4 className="font-black text-base text-slate-100">{m.name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{m.specialization}</p>
                 </div>
              </div>
              <button 
                onClick={() => toggleAttendance(m.id)}
                className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all border-2 ${m.attendance === 'Checked-In' ? 'bg-green-600/10 text-green-500 border-green-600/30' : 'bg-slate-800/50 text-slate-500 border-slate-700/50'}`}
              >
                {m.attendance === 'Checked-In' ? 'ON DUTY' : 'CHECK-IN'}
              </button>
           </div>
         ))}
      </div>
      
      <div className="p-8 bg-blue-600/5 border border-blue-600/10 rounded-[2.5rem] text-center">
         <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Performance Insights</p>
         <p className="text-[11px] font-bold text-slate-500 mt-2">Average Repair Confidence: <span className="text-slate-200">92.4%</span></p>
      </div>
    </div>
  );
};

const EarningsTracking = () => (
  <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
    <h3 className="text-2xl font-black italic">Treasury</h3>
    
    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[3.5rem] text-white shadow-[0_25px_60px_rgba(37,99,235,0.4)] relative overflow-hidden border border-white/20">
       <Wallet size={160} className="absolute -right-12 -bottom-12 opacity-10 rotate-12" />
       <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-4 text-blue-200">Net Receivable</p>
       <h2 className="text-5xl font-black tracking-tighter italic">LKR 45,900</h2>
       <div className="mt-10 grid grid-cols-2 gap-5">
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10">
             <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-2">Today's Flow</p>
             <p className="text-lg font-black text-white">+12.4k</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10">
             <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-2">30 Day Gross</p>
             <p className="text-lg font-black text-white">142.0k</p>
          </div>
       </div>
    </div>

    <section className="bg-slate-900 rounded-[3rem] p-8 border border-white/5 shadow-2xl">
       <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-sm uppercase tracking-[0.2em] text-slate-300">Transaction Ledger</h3>
          <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Download PDF</button>
       </div>
       <div className="space-y-6">
          <TransactionItem label="JB-891: Oil Change" date="12 Oct" amount="+5,200" type="CARD" />
          <TransactionItem label="JB-882: Battery" date="11 Oct" amount="+12,500" type="CASH" />
          <TransactionItem label="JB-871: Suspension" date="10 Oct" amount="+8,400" type="CARD" />
       </div>
    </section>
  </div>
);

// --- Small Utility Components ---

const RegInput = ({ label, value, onChange, placeholder }: any) => (
  <div className="space-y-3">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{label}</p>
    <input 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-900 border-2 border-slate-900 p-6 rounded-[2rem] text-white text-sm font-bold outline-none focus:border-blue-600 focus:bg-slate-900/50 transition-all placeholder:text-slate-700"
    />
  </div>
);

const SummaryItem = ({ label, value }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-slate-100 italic">{value}</span>
  </div>
);

const GarageStatCard = ({ label, value, sub, icon: Icon, color }: any) => (
  <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative group hover:scale-[1.02] transition-all">
    <div className={`p-4 rounded-2xl bg-slate-950 inline-flex items-center justify-center mb-5 border border-white/5 ${color} shadow-inner`}>
       <Icon size={24} />
    </div>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className="text-2xl font-black italic text-slate-100 tracking-tighter">{value}</p>
    <p className="text-[9px] font-bold text-slate-600 uppercase mt-2 tracking-widest">{sub}</p>
  </div>
);

const ActivityItem = ({ label, sub, time, highlight }: any) => (
  <div className="flex justify-between items-center group">
     <div className="flex items-center space-x-4">
        <div className={`w-1.5 h-1.5 rounded-full ${highlight ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-slate-800'}`}></div>
        <div>
           <p className={`text-[12px] font-black ${highlight ? 'text-slate-100' : 'text-slate-400'} group-hover:text-blue-400 transition-colors`}>{label}</p>
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{sub}</p>
        </div>
     </div>
     <p className="text-[9px] font-black text-slate-700 uppercase tracking-tighter italic">{time}</p>
  </div>
);

const TransactionItem = ({ label, date, amount, type }: any) => (
  <div className="flex items-center justify-between group">
     <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-600">{type}</div>
        <div>
           <p className="text-xs font-black text-slate-200 group-hover:text-blue-400 transition-colors">{label}</p>
           <p className="text-[10px] font-bold text-slate-500 uppercase">{date}</p>
        </div>
     </div>
     <p className="text-sm font-black text-green-500 tracking-tight">{amount}</p>
  </div>
);

const NavButton = ({ active, icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-2 transition-all duration-300 ${active ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-400'}`}
  >
    <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-blue-600/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-transparent'}`}>
       <Icon size={22} strokeWidth={active ? 3 : 2} />
    </div>
    <span className="text-[9px] font-black uppercase tracking-[0.3em]">{label}</span>
  </button>
);

export default GaragePortal;
