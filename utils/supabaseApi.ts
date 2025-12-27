import { isSupabaseConfigured, supabase } from './supabaseClient';
import type { SecretSantaEvent, Participant } from '../types';

type DbEventRow = {
  id: string;
  name: string;
  is_drawn: boolean;
  created_at: string;
  participants?: Array<{
    id: string;
    name: string;
    password: string | null;
    drawn_id: string | null;
  }>;
};

const toEvent = (row: DbEventRow): SecretSantaEvent => {
  const participants: Participant[] =
    row.participants?.map((p) => ({
      id: p.id,
      name: p.name,
      password: p.password ?? undefined,
      drawnId: p.drawn_id ?? undefined,
    })) ?? [];

  return {
    id: row.id,
    name: row.name,
    participants,
    isDrawn: row.is_drawn,
    createdAt: Date.parse(row.created_at),
  };
};

export type ParticipantOption = {
  id: string;
  name: string;
  eventId: string;
  eventName: string;
  eventIsDrawn: boolean;
};

export async function fetchEventsWithParticipants(): Promise<SecretSantaEvent[]> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { data, error } = await supabase
    .from('secret_santa_events')
    .select(
      `
        id,
        name,
        is_drawn,
        created_at,
        participants:secret_santa_participants (
          id,
          name,
          password,
          drawn_id
        )
      `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as DbEventRow[]).map(toEvent);
}

export async function fetchParticipantOptions(): Promise<ParticipantOption[]> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { data, error } = await supabase
    .from('secret_santa_participants')
    .select(
      `
        id,
        name,
        event_id,
        event:secret_santa_events (
          name,
          is_drawn
        )
      `
    )
    .order('name', { ascending: true });

  if (error) throw error;

  return (data as any[]).map((row) => ({
    id: row.id,
    name: row.name,
    eventId: row.event_id,
    eventName: row.event?.name ?? '---',
    eventIsDrawn: !!row.event?.is_drawn,
  }));
}

export async function createEvent(name: string): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { data, error } = await supabase
    .from('secret_santa_events')
    .insert({ name })
    .select('id')
    .single();

  if (error) throw error;
  return (data as any).id as string;
}

export async function deleteEvent(eventId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { error } = await supabase.from('secret_santa_events').delete().eq('id', eventId);
  if (error) throw error;
}

export async function addParticipant(eventId: string, name: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { error } = await supabase
    .from('secret_santa_participants')
    .insert({ event_id: eventId, name });
  if (error) throw error;
}

export async function removeParticipant(participantId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { error } = await supabase.from('secret_santa_participants').delete().eq('id', participantId);
  if (error) throw error;
}

export async function drawEvent(eventId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { error } = await supabase.rpc('perform_secret_santa_draw', { p_event_id: eventId });
  if (error) throw error;
}

export async function resetEvent(eventId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { error } = await supabase.rpc('reset_secret_santa_draw', { p_event_id: eventId });
  if (error) throw error;
}

export type RevealResult = { eventName: string; drawnName: string };

export async function revealParticipant(participantId: string, key: string): Promise<RevealResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
  }
  const { data, error } = await supabase
    .rpc('reveal_secret_santa', { p_participant_id: participantId, p_key: key })
    .single();

  if (error) throw error;

  return {
    eventName: (data as any).event_name,
    drawnName: (data as any).drawn_name,
  };
}


