# Telas do MVP — Estado Final

## 1. Escala Geral ✅
Tabela com colunas: data, dia, exercício, chefe, auxiliar, segurança, condições, monitor 1/2/3, status.

Status calculado automaticamente. Borda vermelha em CONFLITO. Estado vazio orientado.

Ações por linha: **Ver** (detalhes + bloqueios/alertas) · **Editar** (modal + validação em tempo real) · **Solicitar** (nova solicitação).

Botão global: **+ Novo Exercício** (modal com validação completa, protege contra turno duplicado).

## 2. Solicitações e Permutas ✅
Lista com filtros: Todos / Pendente / Aberta Permuta / Assumida / Aprovada / Rejeitada.

Ações contextuais por status:
- PENDENTE (Permuta): Permuta · Aprovar · Rejeitar
- PENDENTE (Substituição): Aprovar · Rejeitar
- ABERTA_PERMUTA: Assumir · Rejeitar
- ASSUMIDA: Aprovar · Rejeitar

Assumir valida habilitação, duplicidade e limite 2x/dia. Aprovação atualiza a escala.

## 3. Painel da Coordenação ✅
Cards: total de exercícios, conflitos, alertas, incompletos, solicitações pendentes, permutas abertas.
Tabela de distribuição de carga (total + funções quentes por instrutor).

## NavBar ✅
Navegação entre telas + ações de dados: **Exportar** · **Importar** · **Reset**.

## Componentes transversais ✅
`Modal`, `StatusBadge`, `FormField`/`Select`/`TextArea`, `Toast` (feedback sucesso/erro).
