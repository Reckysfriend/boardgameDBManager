-- 1. game
create table game (
  id   integer generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null unique
);

-- 2. player
create table player (
  id   integer generated always as identity primary key,
  name text not null unique check (char_length(btrim(name)) between 1 and 50)
);

-- 3. game_session
create table game_session (
  id         integer generated always as identity primary key,
  game_id    integer not null references game (id) on delete restrict,
  played_at  date not null default current_date,
  platform   text not null check (platform in ('Table', 'TTS', 'Steam', 'Website'))
);

-- 4. session_player (junction table)
create table session_player (
  id               integer generated always as identity primary key,
  game_session_id  integer not null references game_session (id) on delete cascade,
  player_id        integer not null references player (id) on delete restrict,
  unique (game_session_id, player_id)
);

-- 5. indexes for foreign keys
create index game_session_game_id_idx on game_session (game_id);
create index session_player_player_id_idx on session_player (player_id);

-- 6. row level security
alter table game           enable row level security;
alter table player         enable row level security;
alter table game_session   enable row level security;
alter table session_player enable row level security;