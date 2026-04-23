# Overview — EFR Escala

## Produto
Módulo web para planejar, visualizar e ajustar a escala de EFR (Exercício com Fogo Real).

## Estado: MVP concluído
Todas as milestones (M1–M6) foram entregues.

**Funcionalidades entregues:**
- Escala Geral: tabela, criação, edição, detalhes, status automático, solicitação por linha.
- Validações bloqueantes e alertas fortes em tempo real.
- Fluxo completo de permuta: abrir → assumir → aprovar/rejeitar → escala atualizada.
- Painel da Coordenação: métricas e distribuição de carga reais.
- 23 usuários reais da planilha com habilitações por função.
- Export/import JSON, reset, persistência automática no `localStorage`.
- Toast de feedback, estado vazio, scroll horizontal.

## Stack
React + Vite + TypeScript. Sem backend, banco, login ou cadastro.

## Escopo não inclui
Backend, banco de dados, login, cadastro de usuários, notificações externas, testes unitários.

## Dados
- Instrutores: derivados de `data/Instrutores.xlsx`, consolidados em `src/data/usuarios.ts`.
- Apoio visual: `references/telas_do_sistema (1..3).png`.
