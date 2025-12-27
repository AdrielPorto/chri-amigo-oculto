
import React, { useState, useMemo, useEffect } from 'react';
import { KeyRound, Lock, ArrowRight, Gift, LogOut, ChevronDown, Sparkles, Users, PartyPopper } from 'lucide-react';
import type { ParticipantOption } from '../utils/supabaseApi';
import { revealParticipant } from '../utils/supabaseApi';

interface ParticipantPortalProps {
  participantOptions: ParticipantOption[];
  autoReveal?: { pid: string; key: string } | null;
}

export const ParticipantPortal: React.FC<ParticipantPortalProps> = ({ participantOptions = [], autoReveal }) => {
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ drawnName: string; eventName: string } | null>(null);

  const allParticipants = useMemo(() => {
    return [...participantOptions].sort((a, b) => a.name.localeCompare(b.name));
  }, [participantOptions]);

  // Handle auto-reveal from URL parameters
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!autoReveal?.pid || !autoReveal?.key) return;
      try {
        const res = await revealParticipant(autoReveal.pid, autoReveal.key);
        if (!cancelled) setResult({ drawnName: res.drawnName, eventName: res.eventName });
      } catch {
        // Não mostra erro automaticamente no auto-link; só ignora.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [autoReveal]);

  const handleReveal = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const participantInfo = allParticipants.find(p => p.id === selectedParticipantId);
    
    if (!participantInfo) {
      setError('Escolha seu nome para continuar.');
      return;
    }

    if (!participantInfo.eventIsDrawn) {
      setError(`O sorteio de "${participantInfo.eventName}" está sendo preparado!`);
      return;
    }

    (async () => {
      try {
        const res = await revealParticipant(selectedParticipantId, password);
        setResult({ drawnName: res.drawnName, eventName: res.eventName });
      } catch {
        setError('Essa senha não confere. Tente novamente!');
      }
    })();
  };

  const handleReset = () => {
    setResult(null);
    setPassword('');
    setSelectedParticipantId('');
    setError('');
  };

  if (result) {
    return (
      <div className="max-w-lg mx-auto animate-in zoom-in-95 fade-in duration-700">
        <div className="bg-white rounded-[48px] shadow-2xl shadow-indigo-200/50 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-16 text-center text-white relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-10 left-10 animate-bounce">✨</div>
              <div className="absolute bottom-10 right-10 animate-pulse text-2xl">🥂</div>
              <div className="absolute top-20 right-20 animate-spin duration-1000">❄️</div>
            </div>
            
            <PartyPopper className="w-16 h-16 mx-auto mb-6 text-amber-300 drop-shadow-glow animate-bounce" />
            
            <h3 className="text-xl font-bold opacity-90 mb-2 uppercase tracking-[0.2em]">
              Amigo Oculto 2026
            </h3>
            <div className="h-px w-12 bg-amber-400 mx-auto mb-8 opacity-50"></div>
            
            <p className="text-lg font-medium opacity-70 mb-2 italic">Você tirou...</p>
            <p className="text-6xl font-black tracking-tighter uppercase drop-shadow-2xl">
              {result.drawnName}
            </p>
          </div>
          
          <div className="p-12 space-y-8 bg-white">
            <div className="bg-indigo-50/50 p-8 rounded-[32px] text-center border border-indigo-100 relative">
              <Sparkles className="absolute -top-3 -right-3 text-indigo-400 w-8 h-8" />
              <p className="text-indigo-900 font-bold text-lg leading-relaxed italic">
                "C-H-R-I na veia: Celebrando a amizade que atravessa calendários e fortalece o futuro."
              </p>
            </div>
            
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-3 py-6 rounded-[24px] bg-gray-900 text-white font-black text-xl hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              <LogOut size={22} /> FECHAR REVELAÇÃO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100/50 border border-gray-100 p-12 relative overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-amber-400 via-indigo-600 to-violet-600"></div>
        
        <div className="flex justify-center mb-10">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl shadow-inner ring-1 ring-indigo-100">
            <KeyRound className="text-indigo-600 w-12 h-12" />
          </div>
        </div>

        <h3 className="text-center text-2xl font-black text-gray-900 mb-8 tracking-tight uppercase">
          Portal de Acesso <span className="text-indigo-600">2026</span>
        </h3>
        
        <form onSubmit={handleReveal} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Users size={16} className="text-indigo-500" /> SELECIONE SEU NOME
            </label>
            <div className="relative group">
              <select
                value={selectedParticipantId}
                onChange={(e) => {
                  setSelectedParticipantId(e.target.value);
                  setError('');
                }}
                className="w-full px-6 py-5 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all bg-gray-50/50 appearance-none font-bold text-gray-700 cursor-pointer text-lg"
                required
              >
                <option value="">Clique para escolher...</option>
                {allParticipants.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} {events.length > 1 ? `— ${p.eventName}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" size={24} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Lock size={16} className="text-indigo-500" /> SUA SENHA EXCLUSIVA
            </label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                maxLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 LETRAS"
                className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-gray-200 font-mono text-center tracking-[0.8em] text-xl uppercase font-black text-indigo-600 bg-gray-50/50"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-5 rounded-2xl border border-red-100 font-bold text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-6 rounded-[24px] font-black text-xl hover:shadow-2xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all active:scale-95 group"
          >
            REVELAR MEU AMIGO <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </form>
      </div>
      
      {allParticipants.length === 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-100 text-gray-500 font-bold text-sm">
            <PartyPopper size={16} /> Aguardando o início das festividades...
          </div>
        </div>
      )}
    </div>
  );
};
