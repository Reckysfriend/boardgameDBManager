-- 1. arkham_session: the Arkham-specific part of a game_session
create table arkham_session (
  game_session_id  integer primary key references game_session (id) on delete cascade,
  result           text not null check (result in ('Win', 'Loss'))
);

-- 2. session_result: one place that site-wide stats read results from
create view session_result
with (security_invoker = true)
as
select game_session_id, result
from arkham_session;
-- later: add "union all select game_session_id, result from marvel_session" etc.

-- 3. row level security
alter table arkham_session enable row level security;