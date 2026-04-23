# Milestones

## ✅ M1 — Base SDD (concluída)
- Documentos mínimos (overview, rules, ui-screens, ADRs).

## ✅ M2 — Fundações (concluída)
- Scaffold Vite + React + TS.
- Estrutura de pastas (`components`, `features/*`, `lib`, `types`, `data`).
- Types de domínio: `Usuario`, `Exercicio`, `Solicitacao`, `StatusExercicio`, `AppState`.
- Utilitários de persistência: `hydrate`, `save`, `reset` + campo `version`.
- Shell com NavBar e navegação entre 3 telas.

## ✅ M3 — Regras, Validações e Edição (concluída)
- `validation-rules.ts`: bloqueantes + alertas fortes (funções puras).
- `status-calculation.ts`: cálculo automático de status com precedência.
- `metrics.ts`: métricas reais para o Painel.
- Modal de edição com validação em tempo real, detalhes e nova solicitação.
- Persistência no `localStorage` a cada alteração.

## ✅ M4 — Fluxo de Permuta (concluída)
- Novos status: `ABERTA_PERMUTA`, `ASSUMIDA`.
- Campo `observacaoCoordenacao` na solicitação.
- Ações por linha: Abrir Permuta, Assumir, Aprovar, Rejeitar, Ver detalhes.
- Assumir valida habilitação, duplicidade e limite 2x/dia.
- Aprovação atualiza a escala real + persiste no `localStorage`.

## ✅ M5 — Dados reais + Criação de exercício (concluída)
- 23 usuários reais da planilha `Instrutores.xlsx` em `src/data/usuarios.ts`.
- Habilitações reais por função (mock substituído).
- Modal "Novo Exercício" com validação completa e proteção contra turno duplicado.

## ✅ M6 — Import/Export + Polimento (concluída)
- Export JSON para arquivo com nome datado.
- Import JSON com validação de estrutura.
- Reset para estado inicial com confirmação.
- Toast de feedback sucesso/erro (auto-dismiss 3,5s).
- Estado vazio na Escala Geral.
- Scroll horizontal em tabelas, hover em linhas, focus visível em inputs.
- Ações de dados (Exportar / Importar / Reset) integradas na NavBar.

---

## MVP concluído
Todas as milestones do escopo aprovado foram entregues.
**Fora do escopo entregue:** testes unitários das funções de validação.
