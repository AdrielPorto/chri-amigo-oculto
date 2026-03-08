
import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, SecretSantaEvent } from './types';
import { Layout } from './components/Layout';
import { AdminPanel } from './components/AdminPanel';
import { ParticipantPortal } from './components/ParticipantPortal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import {
  addParticipant,
  createEvent,
  deleteEvent,
  drawEvent,
  fetchEventsWithParticipants,
  fetchParticipantOptions,
  removeParticipant,
  resetEvent,
  type ParticipantOption,
} from './utils/supabaseApi';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PARTICIPANT);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [events, setEvents] = useState<SecretSantaEvent[]>([]);
  const [participantOptions, setParticipantOptions] = useState<ParticipantOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');

  // Check for auto-reveal parameters in URL
  const [autoReveal, setAutoReveal] = useState<{pid: string, key: string} | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('pid');
    const key = params.get('key');
    if (pid && key) {
      setAutoReveal({ pid, key });
      // Remove params from URL without refreshing for a cleaner experience
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [evs, opts] = await Promise.all([fetchEventsWithParticipants(), fetchParticipantOptions()]);
      setEvents(evs);
      setParticipantOptions(opts);
    } catch (e: any) {
      console.error(e);
      setLoadError(e?.message || 'Falha ao carregar dados do Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleCreateEvent = async (name: string) => {
    const id = await createEvent(name);
    await refreshAll();
    setSelectedEventId(id);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este evento permanentemente?")) {
      await deleteEvent(id);
      await refreshAll();
    }
  };

  const handleAddParticipant = async (eventId: string, name: string) => {
    await addParticipant(eventId, name);
    await refreshAll();
  };

  const handleRemoveParticipant = async (participantId: string) => {
    await removeParticipant(participantId);
    await refreshAll();
  };

  const handleDrawEvent = async (eventId: string) => {
    await drawEvent(eventId);
    await refreshAll();
  };

  const handleResetEvent = async (eventId: string) => {
    await resetEvent(eventId);
    await refreshAll();
  };

  const toggleView = () => {
    setViewMode(prev => prev === ViewMode.ADMIN ? ViewMode.PARTICIPANT : ViewMode.ADMIN);
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const adminPassword = '1q2w3e4r';

  return (
    <Layout
      viewMode={viewMode}
      onToggleView={toggleView}
      title={viewMode === ViewMode.ADMIN ? "Painel de Controle" : "C-H-R-I na veia"}
      subtitle={
        viewMode === ViewMode.ADMIN 
          ? "Gerencie os sorteios da irmandade com segurança." 
          : "Rumo a 2026: Descubra seu amigo secreto informando seu nome e senha."
      }
    >
      {(loading || loadError) && (
        <div className="max-w-3xl mx-auto mb-10">
          {loading && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6 text-gray-500 font-bold">
              Carregando dados do Supabase...
            </div>
          )}
          {!loading && loadError && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 text-red-700 font-bold">
              {loadError}
              <div className="mt-2 text-xs font-black text-red-500/80 uppercase tracking-widest">
                Verifique as credenciais hardcoded em `utils/supabaseClient.ts`.
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === ViewMode.PARTICIPANT ? (
        <ParticipantPortal participantOptions={participantOptions} autoReveal={autoReveal} />
      ) : (
        <>
          {!isLoggedIn ? (
            <AdminLogin 
              storedPassword={adminPassword}
              onLogin={() => setIsLoggedIn(true)}
            />
          ) : selectedEvent ? (
            <AdminPanel 
              event={selectedEvent} 
              onAddParticipant={handleAddParticipant}
              onRemoveParticipant={handleRemoveParticipant}
              onDrawEvent={handleDrawEvent}
              onResetEvent={handleResetEvent}
              onBack={() => setSelectedEventId(null)} 
            />
          ) : (
            <AdminDashboard
              events={events}
              onSelectEvent={(e) => setSelectedEventId(e.id)} 
              onCreateEvent={handleCreateEvent}
              onDeleteEvent={handleDeleteEvent}
              onLogout={() => setIsLoggedIn(false)}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
