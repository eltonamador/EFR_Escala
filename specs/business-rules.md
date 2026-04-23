# Regras de Negócio — Estado Final

## Estrutura do dia
- Cada data tem exatamente 2 exercícios: `1º` e `2º`. Sistema impede criar turno duplicado.

## Funções
- Obrigatórias: chefe, auxiliar, segurança, condições.
- Opcionais: monitor 1, monitor 2, monitor 3.
- Quentes: chefe, auxiliar, segurança.

## Bloqueantes — `validation-rules.ts` → `verificarBloqueios()`
- Mesma pessoa em duas funções no mesmo exercício.
- Chefe/auxiliar/segurança excedendo 2 exercícios no mesmo dia.
- Usuário sem habilitação para a função.
- Chefe/auxiliar/segurança já alocado em dia imediatamente anterior ou posterior (DIA_ADJACENTE).

## Status INCOMPLETO
- Campo obrigatório vazio (não bloqueia salvar; capturado no cálculo de status).

## Alertas fortes — `validation-rules.ts` → `verificarAlertas()`
- Mais de 3 exercícios em janela de ±3 dias.
- Mais de 2 atuações em funções quentes na mesma janela.

## Cálculo de status — `status-calculation.ts`
Precedência: CONFLITO → INCOMPLETO → ALERTA → OK.

## Fluxo de solicitação/permuta — `solicitacao-actions.ts`
| Status | Transições possíveis |
|---|---|
| PENDENTE | → ABERTA_PERMUTA (permuta) · APROVADA · REJEITADA |
| ABERTA_PERMUTA | → ASSUMIDA · REJEITADA |
| ASSUMIDA | → APROVADA · REJEITADA |

- Assumir: valida habilitação + duplicidade + limite 2x/dia.
- Aprovar: atualiza campo da função no exercício real com interessado ou substituto sugerido.
- Rejeitar: registra observação, não altera escala.

## Status usados na UI
`OK` · `ALERTA` · `CONFLITO` · `INCOMPLETO` (exercícios)
`PENDENTE` · `ABERTA_PERMUTA` · `ASSUMIDA` · `APROVADA` · `REJEITADA` · `CANCELADA` (solicitações)
