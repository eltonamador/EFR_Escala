# ADR-001 — Stack

## Status
Aceito.

## Contexto
Sistema operacional simples, sem backend, foco em MVP rápido e manutenível.

## Decisão
- React
- Vite
- TypeScript

## Consequências
- Build rápido, DX moderna.
- Sem SSR, sem servidor.
- Tipagem obrigatória em regras e entidades.
- Sem frameworks de estado global pesado; preferir estado local e hooks.
