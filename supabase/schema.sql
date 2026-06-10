create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  nome text not null,
  apelido text,
  email text unique,
  whatsapp text,
  role text not null default 'participante' check (role in ('admin', 'participante')),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  codigo text not null unique,
  flag_url text,
  continente text,
  grupo_atual text,
  ativo boolean not null default true
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  codigo_jogo text not null unique,
  fase text not null check (fase in ('GRUPOS', '16_AVOS', 'OITAVAS', 'QUARTAS', 'SEMIFINAL', 'TERCEIRO_LUGAR', 'FINAL')),
  grupo text,
  rodada integer,
  data_hora timestamptz not null,
  time_a_id uuid not null references public.teams(id),
  time_b_id uuid not null references public.teams(id),
  gols_a integer check (gols_a is null or gols_a >= 0),
  gols_b integer check (gols_b is null or gols_b >= 0),
  status text not null default 'aberto' check (status in ('aberto', 'fechado', 'encerrado', 'apurado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (time_a_id <> time_b_id)
);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  gols_a_palpite integer not null check (gols_a_palpite >= 0),
  gols_b_palpite integer not null check (gols_b_palpite >= 0),
  acertou boolean,
  pontos integer not null default 0 check (pontos in (0, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, game_id)
);

create table if not exists public.standings_cache (
  id uuid primary key default gen_random_uuid(),
  grupo text not null,
  team_id uuid not null references public.teams(id) on delete cascade,
  jogos integer not null default 0,
  vitorias integer not null default 0,
  empates integer not null default 0,
  derrotas integer not null default 0,
  gols_pro integer not null default 0,
  gols_contra integer not null default 0,
  saldo_gols integer not null default 0,
  pontos integer not null default 0,
  unique (grupo, team_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_games_updated_at on public.games;
create trigger set_games_updated_at
before update on public.games
for each row execute function public.set_updated_at();

drop trigger if exists set_predictions_updated_at on public.predictions;
create trigger set_predictions_updated_at
before update on public.predictions
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where auth_user_id = auth.uid()
      and role = 'admin'
      and ativo = true
  );
$$;

create or replace function public.is_own_profile(profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = profile_id
      and auth_user_id = auth.uid()
      and ativo = true
  );
$$;

create or replace function public.score_prediction()
returns trigger
language plpgsql
as $$
declare
  official public.games%rowtype;
begin
  select * into official from public.games where id = new.game_id;

  if official.data_hora <= now() and tg_op in ('INSERT', 'UPDATE') then
    if tg_op = 'INSERT' or old.gols_a_palpite is distinct from new.gols_a_palpite or old.gols_b_palpite is distinct from new.gols_b_palpite then
      raise exception 'Palpite encerrado — partida iniciada.';
    end if;
  end if;

  if official.gols_a is null or official.gols_b is null then
    new.acertou = null;
    new.pontos = 0;
  elsif new.gols_a_palpite = official.gols_a and new.gols_b_palpite = official.gols_b then
    new.acertou = true;
    new.pontos = 1;
  else
    new.acertou = false;
    new.pontos = 0;
  end if;

  return new;
end;
$$;

drop trigger if exists score_prediction_before_save on public.predictions;
create trigger score_prediction_before_save
before insert or update on public.predictions
for each row execute function public.score_prediction();

create or replace function public.rescore_game_predictions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.gols_a is distinct from old.gols_a or new.gols_b is distinct from old.gols_b then
    update public.predictions
    set
      acertou = case
        when new.gols_a is null or new.gols_b is null then null
        when gols_a_palpite = new.gols_a and gols_b_palpite = new.gols_b then true
        else false
      end,
      pontos = case
        when new.gols_a is not null and new.gols_b is not null and gols_a_palpite = new.gols_a and gols_b_palpite = new.gols_b then 1
        else 0
      end,
      updated_at = now()
    where game_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists rescore_game_predictions_after_result on public.games;
create trigger rescore_game_predictions_after_result
after update on public.games
for each row execute function public.rescore_game_predictions();

create or replace view public.ranking_view as
select
  p.id as profile_id,
  p.nome,
  p.apelido,
  coalesce(sum(pr.pontos), 0)::integer as total_pontos,
  count(pr.id)::integer as palpites_feitos,
  count(pr.id) filter (where pr.acertou is true)::integer as acertos,
  case
    when count(pr.id) = 0 then 0
    else round((count(pr.id) filter (where pr.acertou is true)::numeric / count(pr.id)::numeric) * 100, 2)
  end as aproveitamento_percentual
from public.profiles p
left join public.predictions pr on pr.user_id = p.id
where p.ativo = true
group by p.id, p.nome, p.apelido
order by acertos desc, palpites_feitos desc, aproveitamento_percentual desc, p.nome asc;

create or replace view public.group_standings_view as
with group_games as (
  select *
  from public.games
  where fase = 'GRUPOS' and gols_a is not null and gols_b is not null
),
team_rows as (
  select grupo, time_a_id as team_id, gols_a as gf, gols_b as ga,
    case when gols_a > gols_b then 1 else 0 end as v,
    case when gols_a = gols_b then 1 else 0 end as e,
    case when gols_a < gols_b then 1 else 0 end as d
  from group_games
  union all
  select grupo, time_b_id as team_id, gols_b as gf, gols_a as ga,
    case when gols_b > gols_a then 1 else 0 end as v,
    case when gols_b = gols_a then 1 else 0 end as e,
    case when gols_b < gols_a then 1 else 0 end as d
  from group_games
)
select
  tr.grupo,
  t.id as team_id,
  t.nome,
  t.codigo,
  t.flag_url,
  count(*)::integer as jogos,
  sum(v)::integer as vitorias,
  sum(e)::integer as empates,
  sum(d)::integer as derrotas,
  sum(gf)::integer as gols_pro,
  sum(ga)::integer as gols_contra,
  (sum(gf) - sum(ga))::integer as saldo_gols,
  (sum(v) * 3 + sum(e))::integer as pontos
from team_rows tr
join public.teams t on t.id = tr.team_id
group by tr.grupo, t.id, t.nome, t.codigo, t.flag_url
order by tr.grupo, pontos desc, saldo_gols desc, gols_pro desc, t.nome asc;

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.games enable row level security;
alter table public.predictions enable row level security;
alter table public.standings_cache enable row level security;

drop policy if exists "profiles_select_active" on public.profiles;
create policy "profiles_select_active" on public.profiles
for select using (ativo = true or public.is_admin());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "teams_select_all" on public.teams;
create policy "teams_select_all" on public.teams
for select using (true);

drop policy if exists "teams_admin_all" on public.teams;
create policy "teams_admin_all" on public.teams
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "games_select_all" on public.games;
create policy "games_select_all" on public.games
for select using (true);

drop policy if exists "games_admin_all" on public.games;
create policy "games_admin_all" on public.games
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "predictions_select_own_or_admin" on public.predictions;
create policy "predictions_select_own_or_admin" on public.predictions
for select using (public.is_admin() or public.is_own_profile(user_id));

drop policy if exists "predictions_insert_own_before_game" on public.predictions;
create policy "predictions_insert_own_before_game" on public.predictions
for insert with check (
  public.is_own_profile(user_id)
  and exists (
    select 1 from public.games g
    where g.id = game_id
      and now() < g.data_hora
  )
);

drop policy if exists "predictions_update_own_before_game" on public.predictions;
create policy "predictions_update_own_before_game" on public.predictions
for update using (
  public.is_own_profile(user_id)
  and exists (
    select 1 from public.games g
    where g.id = game_id
      and now() < g.data_hora
  )
) with check (
  public.is_own_profile(user_id)
  and exists (
    select 1 from public.games g
    where g.id = game_id
      and now() < g.data_hora
  )
);

drop policy if exists "predictions_admin_all" on public.predictions;
create policy "predictions_admin_all" on public.predictions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "standings_select_all" on public.standings_cache;
create policy "standings_select_all" on public.standings_cache
for select using (true);

drop policy if exists "standings_admin_all" on public.standings_cache;
create policy "standings_admin_all" on public.standings_cache
for all using (public.is_admin()) with check (public.is_admin());
