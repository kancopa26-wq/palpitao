# PALPITAO

PALPITAO e um app recreativo para um grupo pequeno de amigos registrarem palpites dos jogos da Copa do Mundo 2026. O foco e simples: escolher um jogo, palpitar o placar, bloquear automaticamente no inicio da partida, lancar resultado e acompanhar ranking.

## Stack

- Frontend: Vite + JavaScript puro
- Banco: Supabase Free
- Autenticacao e perfis: Supabase Auth + tabela `profiles`
- Deploy: Vercel Free

## Arquivos principais

```text
index.html
src/main.js
src/styles.css
public/branding/
public/flags/
supabase/schema.sql
supabase/seed.sql
docs/modelo_importacao_jogos.csv
docs/manual_admin.md
docs/manual_publicacao.md
.env.example
```

## Criar o projeto no Supabase

1. Crie ou abra o projeto Supabase.
2. Abra SQL Editor.
3. Rode primeiro `supabase/schema.sql`.
4. Rode depois `supabase/seed.sql`.
5. Confira no Table Editor se existem `profiles`, `teams`, `games`, `predictions` e se RLS esta habilitado.

## Variaveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://ztszltkdpoidgxaufwdh.supabase.co
VITE_SUPABASE_ANON_KEY=COLE_AQUI_A_CHAVE_sb_publishable
```

Use somente a chave publishable/anon do Supabase. Nao grave `service_role`, senha de banco, token GitHub ou segredos no codigo.

## Rodar localmente

```bash
npm install
npm run dev
```

Depois abra o endereco mostrado pelo Vite.

Sem `.env`, o app abre em modo local de demonstracao usando dados salvos no navegador. Com `.env`, ele carrega dados do Supabase.

## Publicar na Vercel

1. Conecte o repositorio GitHub `kancopa26-wq/palpitao`.
2. Em Environment Variables, crie `VITE_SUPABASE_URL`.
3. Crie `VITE_SUPABASE_ANON_KEY`.
4. Clique em Deploy.
5. Abra o link publicado e teste no celular.

## Como usar

1. Escolha um palpiteiro na tela principal.
2. Filtre por grupo, rodada, fase ou status.
3. Digite o placar.
4. Clique em `Salvar Palpite`.
5. Acompanhe jogos, tabelas e ranking nas abas.

## Trava automatica de palpites

Cada jogo tem o campo `games.data_hora`, que representa o horario oficial de inicio da partida.

O participante pode criar ou editar palpite somente enquanto:

```text
now < games.data_hora
```

Quando:

```text
now >= games.data_hora
```

o app:

1. Desabilita o botao `Salvar Palpite`.
2. Mostra `Palpite encerrado — partida iniciada.`
3. Impede a gravacao no frontend.
4. Impede insert/update no banco via RLS e trigger em `supabase/schema.sql`.

Nao existe outro horario limite separado. `data_hora` e a trava.

## Painel administrativo

Na aba `admin`, o administrador pode:

- lancar placar oficial;
- marcar jogo como `encerrado` ou `apurado`;
- recalcular automaticamente os palpites;
- importar CSV de jogos e resultados;
- consultar palpiteiros;
- cadastrar fases eliminatorias via CSV.

Para detalhes, veja `docs/manual_admin.md`.

## Importar CSV

Use o arquivo `docs/modelo_importacao_jogos.csv`.

Cabecalhos esperados:

```csv
codigo_jogo,fase,grupo,rodada,data_hora,time_a,codigo_time_a,time_b,codigo_time_b,gols_a,gols_b,status
```

Regras:

- `codigo_jogo` e o identificador unico.
- Linhas com `codigo_jogo` novo inserem jogos.
- Linhas com `codigo_jogo` existente atualizam jogos.
- `data_hora` tambem define a trava automatica dos palpites.
- `gols_a` e `gols_b` podem ficar vazios antes do jogo.

## Ranking

Pontuacao:

- Placar exato: 1 ponto.
- Qualquer outro palpite: 0 ponto.

Desempate:

1. Maior numero de acertos.
2. Maior numero de palpites realizados.
3. Melhor aproveitamento percentual.
4. Ordem alfabetica.

## Assets

O app procura imagens nestas pastas:

```text
public/branding/
public/flags/
```

Arquivos sugeridos:

- `logo-copa-2026.png`
- `taca.png`
- `banner-copa.jpg`
- `brasil-theme.jpg`
- `flag-br.png`
- `flag-us.png`
- `flag-ca.png`
- `flag-mx.png`

Se uma bandeira nao existir, o app mostra o codigo da selecao como fallback.
