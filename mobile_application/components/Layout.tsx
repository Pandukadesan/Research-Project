
import React from 'react';
import { UserRole } from '../types';
import { Home, MessageSquare, MapPin, User, Settings, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, userName }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'map', icon: MapPin, label: 'Near Me' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-bold text-blue-600">AutoCare AI</h1>
          <p className="text-xs text-gray-500 font-medium">{role} - {userName}</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 scroll-smooth">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="bg-white border-t flex justify-around items-center py-2 px-4 fixed bottom-0 w-full max-w-md z-50 safe-area-inset-bottom">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
              activeTab === item.id ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
