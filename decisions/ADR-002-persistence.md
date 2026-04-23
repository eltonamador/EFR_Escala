# ADR-002 — Persistência

## Status
Aceito.

## Contexto
MVP sem backend nem banco. Precisa sobreviver ao refresh e permitir troca de máquina via arquivo.

## Decisão
- Persistência primária: `localStorage` (chave única versionada).
- Dados iniciais: arquivos locais consolidados em `src/data` (ex.: instrutores a partir de `data/Instrutores.xlsx`).
- Export/import: JSON manual.

## Utilitários previstos
- hydrate inicial
- save
- reset
- export
- import
- migração de versão do estado

## Consequências
- Zero dependência de rede.
- Risco: perda de estado ao limpar navegador — mitigado por export JSON.
- Migração de schema precisa de campo `version`.
