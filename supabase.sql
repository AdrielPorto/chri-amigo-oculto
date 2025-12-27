-- Supabase SQL (Postgres) para o projeto "chri-amigo-oculto"
-- Rode este script no SQL Editor do Supabase.

-- Extensões úteis
create extension if not exists pgcrypto;

-- Tabela de eventos
create table if not exists public.secret_santa_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_drawn boolean not null default false,
  created_at timestamptz not null default now()
);

-- Tabela de participantes
create table if not exists public.secret_santa_participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.secret_santa_events(id) on delete cascade,
  name text not null,
  -- senha simples (6 letras) usada para revelar no portal
  password text,
  -- id do participante que esta pessoa tirou (mesmo evento)
  drawn_id uuid,
  created_at timestamptz not null default now(),
  constraint secret_santa_participants_password_len check (password is null or length(password) = 6)
);

create index if not exists idx_secret_santa_participants_event_id on public.secret_santa_participants(event_id);
create index if not exists idx_secret_santa_participants_drawn_id on public.secret_santa_participants(drawn_id);

-- Garante (de forma leve) que o drawn_id aponte para alguém do mesmo evento.
-- (É um gatilho/validação row-by-row porque FK composta é mais chata sem chave única composta.)
create or replace function public.validate_drawn_same_event()
returns trigger
language plpgsql
as $$
declare
  drawn_event uuid;
begin
  if new.drawn_id is null then
    return new;
  end if;

  select event_id into drawn_event
  from public.secret_santa_participants
  where id = new.drawn_id;

  if drawn_event is null then
    raise exception 'drawn_id inválido';
  end if;

  if drawn_event <> new.event_id then
    raise exception 'drawn_id deve apontar para participante do mesmo evento';
  end if;

  if new.drawn_id = new.id then
    raise exception 'um participante não pode tirar a si mesmo';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_drawn_same_event on public.secret_santa_participants;
create trigger trg_validate_drawn_same_event
before insert or update of drawn_id, event_id on public.secret_santa_participants
for each row execute function public.validate_drawn_same_event();

-- Invalida (reseta) sorteio quando houver mudança na lista de participantes
create or replace function public.invalidate_event_draw(p_event_id uuid)
returns void
language plpgsql
as $$
begin
  update public.secret_santa_participants
  set drawn_id = null,
      password = null
  where event_id = p_event_id;

  update public.secret_santa_events
  set is_drawn = false
  where id = p_event_id;
end;
$$;

create or replace function public.trg_invalidate_on_participant_change()
returns trigger
language plpgsql
as $$
begin
  perform public.invalidate_event_draw(coalesce(new.event_id, old.event_id));
  return null;
end;
$$;

drop trigger if exists trg_invalidate_on_participant_insert on public.secret_santa_participants;
create trigger trg_invalidate_on_participant_insert
after insert on public.secret_santa_participants
for each row execute function public.trg_invalidate_on_participant_change();

drop trigger if exists trg_invalidate_on_participant_delete on public.secret_santa_participants;
create trigger trg_invalidate_on_participant_delete
after delete on public.secret_santa_participants
for each row execute function public.trg_invalidate_on_participant_change();

-- Gera senha de 6 letras minúsculas
create or replace function public.generate_simple_password(p_len int default 6)
returns text
language plpgsql
as $$
declare
  letters text := 'abcdefghijklmnopqrstuvwxyz';
  out text := '';
  i int;
begin
  if p_len < 1 then
    raise exception 'p_len inválido';
  end if;

  for i in 1..p_len loop
    out := out || substr(letters, 1 + (get_byte(gen_random_bytes(1), 0) % length(letters)), 1);
  end loop;
  return out;
end;
$$;

-- RPC: realiza o sorteio (circular shift de uma lista embaralhada)
create or replace function public.perform_secret_santa_draw(p_event_id uuid)
returns void
language plpgsql
as $$
declare
  ids uuid[];
  n int;
  i int;
  cur uuid;
  nxt uuid;
begin
  select array_agg(id order by random()) into ids
  from public.secret_santa_participants
  where event_id = p_event_id;

  n := coalesce(array_length(ids, 1), 0);
  if n < 2 then
    raise exception 'Adicione pelo menos 2 participantes para o sorteio.';
  end if;

  -- Limpa antes (evita estados intermediários)
  update public.secret_santa_participants
  set drawn_id = null, password = null
  where event_id = p_event_id;

  for i in 1..n loop
    cur := ids[i];
    if i = n then
      nxt := ids[1];
    else
      nxt := ids[i+1];
    end if;

    update public.secret_santa_participants
    set drawn_id = nxt,
        password = public.generate_simple_password(6)
    where id = cur;
  end loop;

  update public.secret_santa_events
  set is_drawn = true
  where id = p_event_id;
end;
$$;

-- RPC: reseta o sorteio do evento
create or replace function public.reset_secret_santa_draw(p_event_id uuid)
returns void
language plpgsql
as $$
begin
  perform public.invalidate_event_draw(p_event_id);
end;
$$;

-- RPC: revela quem a pessoa tirou (valida senha e se o evento já foi sorteado)
create or replace function public.reveal_secret_santa(p_participant_id uuid, p_key text)
returns table(event_name text, drawn_name text)
language plpgsql
as $$
declare
  v_event_id uuid;
  v_event_name text;
  v_is_drawn boolean;
  v_password text;
  v_drawn_id uuid;
begin
  select p.event_id, p.password, p.drawn_id
    into v_event_id, v_password, v_drawn_id
  from public.secret_santa_participants p
  where p.id = p_participant_id;

  if v_event_id is null then
    raise exception 'Participante não encontrado.';
  end if;

  select e.name, e.is_drawn
    into v_event_name, v_is_drawn
  from public.secret_santa_events e
  where e.id = v_event_id;

  if not v_is_drawn then
    raise exception 'O sorteio ainda não foi realizado.';
  end if;

  if v_password is null or lower(trim(v_password)) <> lower(trim(p_key)) then
    raise exception 'Senha inválida.';
  end if;

  if v_drawn_id is null then
    raise exception 'Sorteio inconsistente (drawn_id vazio).';
  end if;

  return query
  select v_event_name as event_name,
         (select name from public.secret_santa_participants where id = v_drawn_id) as drawn_name;
end;
$$;

-- Observação importante:
-- Por padrão este script NÃO ativa RLS, então o projeto fica "aberto" para quem tiver a anon key.
-- Se você quiser endurecer segurança (recomendado), dá pra ativar RLS + autenticação admin e
-- expor apenas a função reveal (SECURITY DEFINER) / ou uma view de leitura pública.


