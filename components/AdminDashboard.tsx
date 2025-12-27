
import React, { useState } from 'react';
import { SecretSantaEvent } from '../types';
import { Plus, Calendar, Users, ChevronRight, Trash2, LogOut, LayoutGrid } from 'lucide-react';

interface AdminDashboardProps {
  events: SecretSantaEvent[];
  onSelectEvent: (event: SecretSantaEvent) => void;
  onCreateEvent: (name: string) => void;
  onDeleteEvent: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  events, 
  onSelectEvent, 
  onCreateEvent, 
  onDeleteEvent,
  onLogout
}) => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreateEvent(newName.trim());
      setNewName('');
      setShowNewForm(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl">
            <LayoutGrid className="text-white w-5 h-5" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Eventos Ativos</h3>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} /> Sair
          </button>
          <button 
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-0.5"
          >
            <Plus size={20} strokeWidth={3} /> NOVO SORTEIO
          </button>
        </div>
      </div>

      {showNewForm && (
        <div className="bg-white p-10 rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-indigo-50 animate-in slide-in-from-top-6 duration-500">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome da Celebração</label>
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Natal CHRI 2026"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-indigo-500 transition-all text-lg font-bold"
                required
              />
            </div>
            <div className="flex items-end gap-3">
              <button 
                type="submit" 
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all"
              >
                CRIAR
              </button>
              <button 
                type="button" 
                onClick={() => setShowNewForm(false)}
                className="px-6 py-4 rounded-2xl text-gray-400 font-bold hover:text-gray-900 transition-colors"
              >
                FECHAR
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <div className="sm:col-span-full text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Calendar className="text-gray-300 w-10 h-10" />
            </div>
            <p className="text-gray-400 font-bold text-lg">Nenhum sorteio configurado ainda.</p>
            <button 
              onClick={() => setShowNewForm(true)}
              className="mt-6 text-indigo-600 font-black text-sm hover:underline"
            >
              Começar primeiro sorteio &rarr;
            </button>
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event.id}
              className="bg-white rounded-[32px] shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group overflow-hidden flex flex-col"
            >
              <div 
                className="p-8 cursor-pointer flex-1"
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-widest ${
                    event.isDrawn ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {event.isDrawn ? '• Sorteado' : '• Pendente'}
                  </div>
                </div>
                
                <h4 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-6 leading-tight">
                  {event.name}
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 p-4 rounded-2xl">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grupo</span>
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <Users size={16} className="text-indigo-400" />
                      {event.participants.length}
                    </div>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-2xl">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Data</span>
                    <div className="flex items-center gap-2 font-bold text-gray-700">
                      <Calendar size={16} className="text-indigo-400" />
                      {new Date(event.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50/30 flex justify-between items-center border-t border-gray-100">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEvent(event.id);
                  }}
                  className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={() => onSelectEvent(event)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs hover:bg-indigo-600 hover:text-white transition-all"
                >
                  GERENCIAR <ChevronRight size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
