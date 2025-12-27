
import React from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  viewMode: 'participant' | 'admin';
  onToggleView: () => void;
}

const Logo = () => (
  <div className="flex items-center gap-3 group">
    <div className="relative">
      <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
        <Gift className="text-white w-6 h-6" />
      </div>
      <Sparkles className="absolute -top-1 -right-1 text-amber-400 w-4 h-4 animate-pulse" />
    </div>
    <div className="flex flex-col -space-y-1">
      <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
        C-H-R-I <span className="text-indigo-600 font-extrabold not-italic">2026</span>
      </h1>
      <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase pl-0.5">Na Veia</span>
    </div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, viewMode, onToggleView }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-violet-50 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl">
            <button
              onClick={() => viewMode !== 'participant' && onToggleView()}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                viewMode === 'participant' 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Participante
            </button>
            <button
              onClick={() => viewMode !== 'admin' && onToggleView()}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                viewMode === 'admin' 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 sm:py-20 z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-black text-gray-900 sm:text-7xl tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>
        
        <div className="w-full">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-10 z-10">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="font-black text-xl tracking-tighter">CONEXÃO</span>
             <span className="font-black text-xl tracking-tighter">HONRA</span>
             <span className="font-black text-xl tracking-tighter">RESPEITO</span>
             <span className="font-black text-xl tracking-tighter">IRMANDADE</span>
          </div>
          <div className="text-sm text-gray-400 font-semibold tracking-wide">
            &copy; 2026 C-H-R-I NA VEIA • CELEBRANDO O FUTURO JUNTOS
          </div>
        </div>
      </footer>
    </div>
  );
};
