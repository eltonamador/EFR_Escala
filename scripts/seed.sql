-- ============================================================
-- EFR Escala — Seed inicial
-- Executar no SQL Editor do Supabase (uma vez)
-- ============================================================

-- 1. SCHEMA -------------------------------------------------

create table if not exists usuarios (
  id          text primary key,
  nome        text not null,
  patente     text not null,
  habilitacoes text[] not null
);

create table if not exists exercicios (
  id           text primary key,
  data         date not null,
  numero       smallint not null check (numero in (1, 2)),
  chefe_id     text references usuarios(id),
  auxiliar_id  text references usuarios(id),
  seguranca_id text references usuarios(id),
  condicoes_id text references usuarios(id),
  monitor1_id  text references usuarios(id),
  monitor2_id  text references usuarios(id),
  monitor3_id  text references usuarios(id),
  created_at   timestamptz default now(),
  unique (data, numero)
);

create table if not exists solicitacoes (
  id                       text primary key,
  solicitante_id           text not null references usuarios(id),
  data                     date not null,
  exercicio_numero         smallint not null check (exercicio_numero in (1, 2)),
  funcao                   text not null,
  tipo                     text not null check (tipo in ('SUBSTITUICAO','PERMUTA')),
  justificativa            text not null,
  substituto_sugerido_id   text references usuarios(id),
  exercicio_permuta_id     text references exercicios(id),
  funcao_permuta           text,
  interessado_id           text references usuarios(id),
  observacao_coordenacao   text,
  status                   text not null default 'PENDENTE',
  criado_em                timestamptz default now()
);

-- Permissões de schema (obrigatório para acesso via anon key)
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;

-- RLS com políticas permissivas (padrão Supabase, sem auth)
alter table exercicios   enable row level security;
alter table solicitacoes enable row level security;
alter table usuarios     enable row level security;

create policy "allow_all"  on exercicios   for all using (true) with check (true);
create policy "allow_all"  on solicitacoes for all using (true) with check (true);
create policy "allow_read" on usuarios     for select using (true);

-- 2. SEED USUARIOS ------------------------------------------

insert into usuarios (id, nome, patente, habilitacoes) values
  ('u01', 'Cel Ivanete',         'Cel', array['chefe','auxiliar']),
  ('u02', 'Maj Chucre',          'Maj', array['chefe','auxiliar']),
  ('u03', 'Cap Amador',          'Cap', array['chefe','auxiliar']),
  ('u04', 'Cap Charlys',         'Cap', array['chefe','auxiliar']),
  ('u05', 'Cap Jorge Luiz',      'Cap', array['chefe','auxiliar']),
  ('u06', 'Ten Cecília',         'Ten', array['chefe','auxiliar']),
  ('u07', 'Cap Caio',            'Cap', array['seguranca']),
  ('u08', 'Sgt Cristiano',       'Sgt', array['auxiliar','seguranca','condicoes']),
  ('u09', 'Sgt Santiago',        'Sgt', array['auxiliar','seguranca','condicoes']),
  ('u10', 'Sgt Fernando',        'Sgt', array['auxiliar','seguranca','condicoes']),
  ('u11', 'Sgt Eline',           'Sgt', array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u12', 'Sgt S. Souza',        'Sgt', array['seguranca','condicoes']),
  ('u13', 'SD Elâine',           'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u14', 'SD Jaffer',           'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u15', 'SD R. dos Santos',    'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u16', 'SD Raíssa',           'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u17', 'SD Thales',           'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u18', 'SD Jorge Lucas',      'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u19', 'SD Carlos Monteiro',  'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u20', 'SD Mateus Felipe',    'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u21', 'SD Nicoly',           'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u22', 'SD Nunes',            'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3']),
  ('u23', 'SD Axl',              'SD',  array['seguranca','condicoes','monitor1','monitor2','monitor3'])
on conflict (id) do nothing;

-- 3. SEED EXERCICIOS ----------------------------------------

insert into exercicios (id, data, numero, chefe_id, auxiliar_id, seguranca_id, condicoes_id, monitor1_id, monitor2_id) values
  -- 04/05
  ('ex-0504-1','2026-05-04',1,'u01','u03','u08','u19','u23','u16'),
  ('ex-0504-2','2026-05-04',2,'u05','u10','u09','u12','u13','u14'),
  -- 05/05
  ('ex-0505-1','2026-05-05',1,'u02','u04','u15','u17','u18','u20'),
  ('ex-0505-2','2026-05-05',2,'u06','u09','u16','u19','u21','u22'),
  -- 06/05
  ('ex-0506-1','2026-05-06',1,'u03','u05','u23','u08','u21','u22'),
  ('ex-0506-2','2026-05-06',2,'u01','u03','u10','u11','u20','u13'),
  -- 07/05
  ('ex-0507-1','2026-05-07',1,'u04','u08','u14','u15','u16','u18'),
  ('ex-0507-2','2026-05-07',2,'u02','u04','u17','u20','u19','u21'),
  -- 08/05
  ('ex-0508-1','2026-05-08',1,'u05','u01','u22','u23','u18','u19'),
  ('ex-0508-2','2026-05-08',2,'u03','u09','u07','u10','u14','u19'),
  -- 11/05
  ('ex-1105-1','2026-05-11',1,'u06','u02','u13','u14','u15','u16'),
  ('ex-1105-2','2026-05-11',2,'u04','u09','u18','u17','u20','u19'),
  -- 12/05
  ('ex-1205-1','2026-05-12',1,'u01','u10','u07','u22','u23','u15'),
  ('ex-1205-2','2026-05-12',2,'u03','u08','u11','u09','u14','u13'),
  -- 13/05
  ('ex-1305-1','2026-05-13',1,'u02','u06','u12','u13','u14','u15'),
  ('ex-1305-2','2026-05-13',2,'u04','u09','u20','u16','u17','u18'),
  -- 14/05
  ('ex-1405-1','2026-05-14',1,'u03','u01','u19','u22','u23','u16'),
  ('ex-1405-2','2026-05-14',2,'u05','u10','u21','u09','u14','u13'),
  -- 15/05
  ('ex-1505-1','2026-05-15',1,'u02','u08','u11','u13','u14','u15'),
  ('ex-1505-2','2026-05-15',2,'u06','u04','u12','u16','u17','u18')
on conflict (id) do nothing;
