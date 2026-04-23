# Supabase Schema — EFR Escala

Modelagem mínima para migrar do localStorage para Supabase.
Todas as tabelas ficam no schema `public`.

---

## Tabelas

### `exercicios`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | `text` PK | ex: `ex-0504-1` |
| `data` | `date` NOT NULL | ISO 8601 |
| `numero` | `smallint` NOT NULL | 1 ou 2 |
| `chefe_id` | `text` FK → `usuarios.id` | nullable |
| `auxiliar_id` | `text` FK → `usuarios.id` | nullable |
| `seguranca_id` | `text` FK → `usuarios.id` | nullable |
| `condicoes_id` | `text` FK → `usuarios.id` | nullable |
| `monitor1_id` | `text` FK → `usuarios.id` | nullable |
| `monitor2_id` | `text` FK → `usuarios.id` | nullable |
| `monitor3_id` | `text` FK → `usuarios.id` | nullable |
| `created_at` | `timestamptz` DEFAULT now() | |

Constraint: `UNIQUE (data, numero)` — impede turno duplicado.

---

### `usuarios`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | `text` PK | ex: `u01` |
| `nome` | `text` NOT NULL | |
| `patente` | `text` NOT NULL | |
| `habilitacoes` | `text[]` NOT NULL | array de Funcao |

Dado de referência — sem RLS necessário (leitura pública).

---

### `solicitacoes`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | `text` PK | ex: `sol-1716123456789` |
| `solicitante_id` | `text` FK → `usuarios.id` | |
| `data` | `date` NOT NULL | data do exercício |
| `exercicio_numero` | `smallint` NOT NULL | 1 ou 2 |
| `funcao` | `text` NOT NULL | Funcao |
| `tipo` | `text` NOT NULL | `SUBSTITUICAO` ou `PERMUTA` |
| `justificativa` | `text` NOT NULL | |
| `substituto_sugerido_id` | `text` FK → `usuarios.id` | nullable |
| `interessado_id` | `text` FK → `usuarios.id` | nullable |
| `observacao_coordenacao` | `text` | nullable |
| `status` | `text` NOT NULL DEFAULT `'PENDENTE'` | StatusSolicitacao |
| `criado_em` | `timestamptz` DEFAULT now() | |

---

## RLS (Row Level Security)

Fase inicial sem autenticação: desativar RLS ou usar política `USING (true)`.
Quando auth for adicionado:
- `exercicios`: leitura pública, escrita apenas para role `coordenador`.
- `solicitacoes`: leitura pública, inserção por qualquer autenticado, atualização de status apenas `coordenador`.
- `usuarios`: somente leitura para todos.

---

## Adaptação do frontend

Arquivos a trocar quando a migração acontecer:

| Atual | Substituto Supabase |
|---|---|
| `src/data/escalaFinal.ts` | query `SELECT * FROM exercicios ORDER BY data, numero` |
| `src/data/mockState.ts` | `hydrate()` chama Supabase em vez de localStorage |
| `src/lib/storage.ts` | `save()` chama `upsert` em `exercicios` e `solicitacoes` |
| `src/lib/solicitacao-actions.ts` | `UPDATE solicitacoes SET status = ...` |

As regras de validação (`validation-rules.ts`) e cálculo de status (`status-calculation.ts`) **não mudam** — são funções puras independentes da camada de dados.

---

## Migração inicial

```sql
-- Seed usuarios (executar uma vez)
INSERT INTO usuarios (id, nome, patente, habilitacoes) VALUES
  ('u01', 'Cel Ivanete',        'Cel', ARRAY['chefe','auxiliar']),
  ('u02', 'Maj Chucre',         'Maj', ARRAY['chefe','auxiliar']),
  -- ... demais 21 usuários
;

-- Seed exercicios (fonte: escala_final_maio_2026_v3.xlsx)
INSERT INTO exercicios (id, data, numero, chefe_id, auxiliar_id, seguranca_id, condicoes_id, monitor1_id, monitor2_id) VALUES
  ('ex-0504-1', '2026-05-04', 1, 'u01', 'u03', 'u08', 'u19', 'u23', 'u16'),
  -- ... demais 19 exercícios
;
```
