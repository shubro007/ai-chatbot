create table if not exists public.sessions (
	id uuid primary key default gen_random_uuid(),
	customer_id text,
	status text not null default 'open',
	metadata jsonb not null default '{}',
	summary text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists public.messages (
	id uuid primary key default gen_random_uuid(),
	session_id uuid not null references public.sessions(id) on delete cascade,
	role text not null check (role in ('user','assistant','system')),
	content text not null,
	created_at timestamptz not null default now()
);

create table if not exists public.faqs (
	id uuid primary key default gen_random_uuid(),
	question text not null unique,
	answer text not null,
	tags text[] default '{}',
	updated_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger as $$
begin
	new.updated_at = now();
	return new;
end;
$$ language plpgsql;

drop trigger if exists sessions_updated on public.sessions;
create trigger sessions_updated before update on public.sessions
for each row execute function set_updated_at();
