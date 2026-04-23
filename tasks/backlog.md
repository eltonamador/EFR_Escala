# Backlog — Estado Final do MVP

## Fundação técnica ✅
- [x] Scaffold Vite + React + TS.
- [x] Estrutura `src/{components,features,lib,types,data}`.
- [x] Tema visual (tokens do DESIGN.md em CSS vars).
- [x] Types: `Exercicio`, `Usuario`, `Funcao`, `Solicitacao`, `StatusExercicio`, `AppState`.

## Persistência ✅
- [x] `storage.ts` com `hydrate`/`save`/`reset`.
- [x] Campo `version` para migração.
- [x] Export JSON para arquivo datado.
- [x] Import JSON com validação de estrutura.

## Validações ✅
- [x] Funções obrigatórias: chefe, auxiliar, segurança, condições.
- [x] Duplicidade de pessoa no mesmo exercício.
- [x] Excesso de 2x/dia em funções quentes.
- [x] Verificação de habilitação por função.
- [x] Bloqueio: dia adjacente em funções quentes (DIA_ADJACENTE — bloqueante).
- [x] Alertas: carga excessiva, repetição em quentes.
- [x] Cálculo automático de status (CONFLITO > INCOMPLETO > ALERTA > OK).

## Escala Geral ✅
- [x] Tabela com todas as colunas do PRD.
- [x] Badges de status calculados automaticamente.
- [x] Borda vermelha em linhas com CONFLITO.
- [x] Modal de edição com selects por habilitação + validação em tempo real.
- [x] Modal de detalhes com bloqueios e alertas listados.
- [x] Criação de novo exercício do zero (proteção contra turno duplicado).
- [x] Estado vazio com orientação ao usuário.

## Solicitações e Permutas ✅
- [x] Lista com filtros por status.
- [x] Modal de abertura de solicitação.
- [x] Aceitar permuta com validação de elegibilidade.
- [x] Aprovar/rejeitar + escala atualizada na aprovação.
- [x] Observação da coordenação registrada.

## Painel da Coordenação ✅
- [x] Cards de métricas reais.
- [x] Tabela de distribuição de carga.

## Dados ✅
- [x] 23 usuários reais de `Instrutores.xlsx` em `src/data/usuarios.ts`.
- [x] Habilitações reais por função.

## UX / Polimento ✅
- [x] Toast de feedback sucesso/erro.
- [x] Ações Exportar / Importar / Reset na NavBar.
- [x] Scroll horizontal em tabelas.
- [x] Hover em linhas, focus visível em inputs.

## Fora do escopo entregue
- [ ] Testes unitários das regras puras (`validation-rules.ts`, `status-calculation.ts`).
