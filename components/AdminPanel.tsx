
import React, { useState } from 'react';
import type { Participant, SecretSantaEvent } from '../types';
import {
  UserPlus,
  Trash2,
  Play,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  Link as LinkIcon,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AdminPanelProps {
  event: SecretSantaEvent;
  onAddParticipant: (eventId: string, name: string) => Promise<void> | void;
  onRemoveParticipant: (participantId: string) => Promise<void> | void;
  onDrawEvent: (eventId: string) => Promise<void> | void;
  onResetEvent: (eventId: string) => Promise<void> | void;
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  event,
  onAddParticipant,
  onRemoveParticipant,
  onDrawEvent,
  onResetEvent,
  onBack
}) => {
  const [newName, setNewName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [visibleDrawnFor, setVisibleDrawnFor] = useState<Record<string, boolean>>({});

  const addParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await onAddParticipant(event.id, newName.trim());
    setNewName('');
  };

  const removeParticipant = async (id: string) => {
    await onRemoveParticipant(id);
  };

  const handleDraw = async () => {
    if (event.participants.length < 2) {
      alert("Adicione pelo menos 2 participantes para o sorteio.");
      return;
    }
    if (event.participants.length % 2 !== 0) {
      alert("Para este sorteio, a quantidade de participantes precisa ser PAR.");
      return;
    }
    await onDrawEvent(event.id);
  };

  const resetDraw = async () => {
    if (confirm("Isso apagará todas as senhas e sorteios deste evento. Tem certeza?")) {
      await onResetEvent(event.id);
    }
  };

  const copyToClipboard = (p: Participant) => {
    const text = `Seu amigo oculto (${event.name}):\nNome: ${p.name}\nSenha: ${p.password}\nAcesse: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyLinkToClipboard = (p: Participant) => {
    const url = `${window.location.origin}?pid=${p.id}&key=${p.password}`;
    navigator.clipboard.writeText(url);
    setCopiedLinkId(p.id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const getDrawnName = (id?: string) => {
    return event.participants.find(p => p.id === id)?.name || '---';
  };

  const canDraw = event.participants.length >= 2 && event.participants.length % 2 === 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-400">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{event.name}</h3>
          <p className="text-sm text-gray-500">Configurações e Sorteio</p>
        </div>
      </div>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h4 className="text-lg font-bold flex items-center gap-2 mb-4">
            <UserPlus className="text-indigo-600 w-5 h-5" /> Adicionar Pessoas
          </h4>
          
          <form onSubmit={addParticipant} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do participante"
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Add
            </button>
          </form>
        </div>

        <div className="border-t border-gray-50 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-4 sm:px-6 py-4">Nome</th>
                {!event.isDrawn ? (
                  <th className="px-4 sm:px-6 py-4 text-right">Ação</th>
                ) : (
                  <>
                    <th className="px-4 sm:px-6 py-4">Senha</th>
                    <th className="px-4 sm:px-6 py-4">Tirou</th>
                    <th className="px-4 sm:px-6 py-4 text-right">Ações de Compartilhamento</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {event.participants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-300 italic">
                    Nenhum participante.
                  </td>
                </tr>
              ) : (
                event.participants.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                    
                    {!event.isDrawn ? (
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <button 
                          onClick={() => removeParticipant(p.id)}
                          className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    ) : (
                      <>
                        <td className="px-4 sm:px-6 py-4 font-mono text-indigo-600 font-bold uppercase">{p.password}</td>
                        <td className="px-4 sm:px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {visibleDrawnFor[p.id] ? getDrawnName(p.drawnId) : '••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setVisibleDrawnFor((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                              }
                              title={visibleDrawnFor[p.id] ? 'Ocultar' : 'Exibir'}
                              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              {visibleDrawnFor[p.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right flex justify-end gap-2">
                          <button 
                            onClick={() => copyToClipboard(p)}
                            title="Copiar texto de acesso"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-2 rounded-xl transition-colors"
                          >
                            {copiedId === p.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            {copiedId === p.id ? 'Copiado' : 'Texto'}
                          </button>
                          <button 
                            onClick={() => copyLinkToClipboard(p)}
                            title="Copiar link de revelação automática"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl transition-colors"
                          >
                            {copiedLinkId === p.id ? <Check size={14} className="text-green-600" /> : <LinkIcon size={14} />}
                            {copiedLinkId === p.id ? 'Link Copiado' : 'Gerar Link'}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 justify-center py-4">
        {!event.isDrawn ? (
          <button
            onClick={handleDraw}
            disabled={!canDraw}
            className="flex items-center justify-center gap-3 bg-green-600 text-white px-12 py-5 rounded-3xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-30 disabled:shadow-none"
          >
            <Play size={24} fill="currentColor" /> REALIZAR SORTEIO
          </button>
        ) : (
          <button
            onClick={resetDraw}
            className="flex items-center justify-center gap-2 bg-white text-red-500 border border-red-50 px-8 py-4 rounded-3xl font-bold hover:bg-red-50 transition-all"
          >
            <RefreshCw size={20} /> Resetar Sorteio
          </button>
        )}
      </div>

      {event.isDrawn && (
        <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-lg border border-indigo-800">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <ExternalLink size={18} /> Sorteio Concluído!
          </h4>
          <p className="text-indigo-100 text-sm opacity-80 leading-relaxed">
            Agora você tem duas opções: enviar os dados de acesso (nome + senha) ou <strong>gerar um link direto</strong> que já abre o resultado para o participante!
          </p>
        </div>
      )}

      {!event.isDrawn && event.participants.length >= 2 && event.participants.length % 2 !== 0 && (
        <div className="bg-amber-50 text-amber-800 p-5 rounded-3xl border border-amber-100 font-bold text-center">
          Para habilitar o sorteio, adicione/remova 1 participante para ficar com quantidade <strong>par</strong>.
        </div>
      )}
    </div>
  );
};
