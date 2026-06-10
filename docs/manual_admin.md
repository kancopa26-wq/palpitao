# Manual do administrador

## Acesso

1. Escolha um perfil com papel `admin`.
2. Abra a aba `admin`.
3. Use o painel para lançar resultados ou importar CSV.

## Lançar resultado

1. Selecione o jogo.
2. Informe gols A e gols B.
3. Escolha `encerrado` ou `apurado`.
4. Clique em `Salvar resultado e recalcular`.

Ao salvar, o app compara todos os palpites do jogo. Placar exato vale 1 ponto. Qualquer outro placar vale 0.

## Importar CSV

Use `docs/modelo_importacao_jogos.csv` como base. Cabeçalhos obrigatórios:

```csv
codigo_jogo,fase,grupo,rodada,data_hora,time_a,codigo_time_a,time_b,codigo_time_b,gols_a,gols_b,status
```

O campo `codigo_jogo` identifica se a linha cria um jogo novo ou atualiza um jogo existente.

## Trava de palpites

O campo `games.data_hora` é o único limite. Se o horário atual for maior ou igual a `data_hora`, o botão de salvar fica desabilitado e o banco rejeita insert/update em `predictions`.
