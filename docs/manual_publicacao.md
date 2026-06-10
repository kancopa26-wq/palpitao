# Manual de publicacao

## Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Rode primeiro `supabase/schema.sql`.
4. Rode depois `supabase/seed.sql`.
5. Confira se RLS está habilitado nas tabelas `profiles`, `teams`, `games` e `predictions`.

## Ambiente local

Crie `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://ztszltkdpoidgxaufwdh.supabase.co
VITE_SUPABASE_ANON_KEY=COLE_AQUI_A_CHAVE_sb_publishable
```

Nunca envie o `.env` real para o GitHub.

## Vercel

1. Conecte o repositório GitHub `kancopa26-wq/palpitao`.
2. Em Environment Variables, cadastre `VITE_SUPABASE_URL`.
3. Cadastre `VITE_SUPABASE_ANON_KEY`.
4. Faça o deploy.
5. Teste pelo celular.
