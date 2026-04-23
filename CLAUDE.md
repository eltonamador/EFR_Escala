# CLAUDE.md — Contrato Operacional do Projeto

Você está trabalhando no projeto **EFR Escala**, um módulo web sem backend e sem banco, guiado por **Spec-Driven Development (SDD)**.

## Regra principal
**Não escreva código antes de ler a documentação base.**

## Ordem obrigatória de leitura
1. `PRD.md`
2. `specs/01-MVP-Scope.md`
3. `specs/04-Business-Rules.md`
4. `specs/07-Technical-Architecture.md`
5. `specs/08-State-and-Persistence.md`
6. `specs/10-Implementation-Plan.md`
7. `specs/09-Test-Plan.md`
8. ADRs em `decisions/`

## Modo de trabalho esperado
Para cada tarefa:
1. resuma o entendimento do escopo em até 10 bullets
2. identifique riscos e pontos ambíguos
3. proponha plano de implementação por etapas
4. só então implemente
5. ao final, liste arquivos alterados e impacto

## Restrições duras
- não criar backend
- não criar banco de dados
- não criar autenticação
- não criar página de perfil
- não criar CRUD de usuários
- não inventar novas telas fora do escopo aprovado
- não criar abstrações desnecessárias
- não usar estado global pesado sem necessidade

## Stack-alvo
- React
- Vite
- TypeScript
- persistência com `localStorage`
- dados iniciais vindos de arquivos locais consolidados

## Princípios de arquitetura
- componentes pequenos e previsíveis
- regras de negócio em funções puras
- UI separada da lógica de validação
- types/interfaces explícitas
- dados de referência centralizados
- side effects isolados
- importação/exportação desacopladas da UI principal

## Regra de ouro de domínio
Separe sempre:
- **bloqueio**: impede salvar
- **alerta forte**: avisa, mas permite continuar

Nunca misture essas duas categorias.

## Convenções recomendadas
### Estrutura
- `src/components`
- `src/features/escala`
- `src/features/solicitacoes`
- `src/features/coordenacao`
- `src/lib`
- `src/types`
- `src/data`

### Nomenclatura
- componentes: `PascalCase`
- hooks/utilitários: `camelCase`
- arquivos de tipos: `*.types.ts`
- validadores: `*.rules.ts` ou `*.validators.ts`

### Persistência
Crie utilitários claros para:
- hydrate inicial
- save
- reset
- export
- import
- migração de versão do estado, se necessário

## UX obrigatória
- interface em português
- tabela com alta legibilidade
- badges claros para `OK`, `ALERTA`, `CONFLITO`, `INCOMPLETO`
- modais objetivos
- feedback de erro/sucesso claro
- design aderente ao sistema visual definido

## Antes de concluir qualquer entrega
Verifique:
- as regras bloqueantes estão corretas?
- os alertas fortes estão separados dos bloqueios?
- o usuário está limitado às funções habilitadas?
- cada data tem apenas `1º` e `2º` exercício?
- a mesma pessoa pode estar duplicada no mesmo exercício? (resposta deve ser não)
- a mudança foi refletida no `localStorage`?

## Definition of Done mínima
Uma entrega só está pronta quando:
- compila
- respeita o PRD
- respeita as regras de negócio
- mantém o escopo
- não adiciona complexidade desnecessária
- atualiza docs se mudar algo estrutural

## Em caso de dúvida
Prefira:
- simplicidade
- clareza
- modularidade
- aderência à spec
e não criatividade de produto.
