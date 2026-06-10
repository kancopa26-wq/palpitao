insert into public.profiles (id, nome, apelido, email, role, ativo) values
  ('00000000-0000-0000-0000-000000000001', 'Cesar Camargo', 'Cesar', 'cesar@example.com', 'admin', true),
  ('00000000-0000-0000-0000-000000000002', 'Ana Souza', 'Ana', 'ana@example.com', 'participante', true),
  ('00000000-0000-0000-0000-000000000003', 'Joao Lima', 'Joao', 'joao@example.com', 'participante', true)
on conflict (id) do update set nome = excluded.nome, apelido = excluded.apelido, role = excluded.role, ativo = excluded.ativo;

insert into public.teams (id, nome, codigo, flag_url, continente, grupo_atual, ativo) values
  ('11111111-1111-1111-1111-111111111111', 'Brasil', 'BRA', '/flags/flag-br.png', 'America do Sul', 'C', true),
  ('22222222-2222-2222-2222-222222222222', 'Marrocos', 'MAR', '', 'Africa', 'C', true),
  ('33333333-3333-3333-3333-333333333333', 'Mexico', 'MEX', '/flags/flag-mx.png', 'America do Norte', 'A', true),
  ('44444444-4444-4444-4444-444444444444', 'Canada', 'CAN', '/flags/flag-ca.png', 'America do Norte', 'A', true),
  ('55555555-5555-5555-5555-555555555555', 'Estados Unidos', 'USA', '/flags/flag-us.png', 'America do Norte', null, true),
  ('66666666-6666-6666-6666-666666666666', 'Uruguai', 'URU', '', 'America do Sul', 'A', true),
  ('77777777-7777-7777-7777-777777777777', 'Africa do Sul', 'RSA', '', 'Africa', 'A', true)
on conflict (codigo) do update set nome = excluded.nome, flag_url = excluded.flag_url, continente = excluded.continente, grupo_atual = excluded.grupo_atual, ativo = excluded.ativo;

insert into public.games (id, codigo_jogo, fase, grupo, rodada, data_hora, time_a_id, time_b_id, gols_a, gols_b, status) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'G01', 'GRUPOS', 'A', 1, '2026-06-11 19:00:00-03', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', null, null, 'aberto'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'G02', 'GRUPOS', 'A', 1, '2026-06-12 16:00:00-03', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', null, null, 'aberto'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'G03', 'GRUPOS', 'C', 1, '2026-06-13 19:00:00-03', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', null, null, 'aberto')
on conflict (codigo_jogo) do update set fase = excluded.fase, grupo = excluded.grupo, rodada = excluded.rodada, data_hora = excluded.data_hora, time_a_id = excluded.time_a_id, time_b_id = excluded.time_b_id, gols_a = excluded.gols_a, gols_b = excluded.gols_b, status = excluded.status;

insert into public.predictions (id, user_id, game_id, gols_a_palpite, gols_b_palpite) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '00000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 2, 0),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '00000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 1, 1)
on conflict (user_id, game_id) do update set gols_a_palpite = excluded.gols_a_palpite, gols_b_palpite = excluded.gols_b_palpite;
