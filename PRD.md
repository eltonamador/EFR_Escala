# PRD — Sistema de Escala EFR

## 1. Visão do produto
Construir um módulo web simples, leve e confiável para **planejamento, visualização e ajuste de escala** de instrução de **Exercício com Fogo Real (EFR)**.

O sistema deve funcionar como uma **planilha inteligente**, porém com:
- validações automáticas
- fluxo de solicitação de mudança
- permuta aberta
- painel de coordenação
- persistência local sem backend

## 2. Problema
Hoje, a escala depende de planilha manual e interpretação humana para detectar:
- excesso de carga
- duplicidade de alocação
- falta de preenchimento
- violação de regras térmicas
- pedidos de troca difíceis de acompanhar

Isso aumenta risco operacional, retrabalho e tempo de coordenação.

## 3. Objetivo do produto
Permitir que a coordenação:
- monte a escala com rapidez
- visualize conflitos e alertas imediatamente
- acompanhe solicitações de mudança
- aprove ou rejeite permutas com segurança
- exporte e importe o estado da escala

## 4. Escopo do MVP
### Inclui
- Escala Geral
- Solicitações e Permutas
- Painel da Coordenação
- modais de edição, detalhes e validação
- importação/exportação JSON
- persistência via `localStorage`
- carga inicial via dados locais consolidados

### Não inclui
- backend
- banco de dados
- login/autenticação
- cadastro de usuários
- página de perfil
- notificações externas
- integrações com e-mail, WhatsApp ou APIs

## 5. Usuários
### Coordenação
Responsável por:
- montar escala
- editar exercício
- validar conflitos
- aprovar ou rejeitar solicitações

### Instrutores e monitores
Responsáveis por:
- consultar escala
- abrir solicitação
- aceitar assumir permuta quando elegíveis

## 6. Telas do MVP
### 6.1 Escala Geral
Tabela principal com:
- data
- dia
- exercício (`1º` ou `2º`)
- chefe
- auxiliar
- segurança
- condições
- monitor 1
- monitor 2
- monitor 3
- status

### 6.2 Solicitações e Permutas
Lista com:
- solicitante
- data
- exercício
- função
- tipo de solicitação
- justificativa
- substituto sugerido
- interessado em assumir
- status

### 6.3 Painel da Coordenação
Resumo com:
- total de exercícios
- conflitos bloqueantes
- alertas fortes
- solicitações pendentes
- permutas abertas
- exercícios incompletos
- distribuição de carga

## 7. Regras de negócio centrais
### 7.1 Estrutura do dia
Para cada data existem exatamente **2 exercícios**:
- `1º`
- `2º`

### 7.2 Funções obrigatórias
- chefe
- auxiliar
- segurança
- condições

### 7.3 Funções opcionais
- monitor 1
- monitor 2
- monitor 3

### 7.4 Funções quentes
- chefe
- auxiliar
- segurança

### 7.5 Regras bloqueantes
- chefe, auxiliar e segurança não podem exceder 2 exercícios no mesmo dia
- a mesma pessoa não pode ocupar duas funções no mesmo exercício
- funções obrigatórias não podem ficar vazias
- usuário só pode ocupar função para a qual esteja habilitado

### 7.6 Alertas fortes
- atuação em dia imediatamente anterior ou posterior em função quente
- concentração excessiva de carga
- repetição excessiva em funções quentes

## 8. Fluxo de permuta aberta
1. Usuário abre solicitação
2. Solicitação pode ficar aberta para permuta
3. Outro usuário elegível pode aceitar assumir
4. Coordenação aprova ou rejeita
5. Sistema revalida antes de concluir alteração

## 9. Requisitos não funcionais
- desempenho bom em desktop e tablet
- operação offline simples no navegador
- interface clara em ambiente operacional
- arquitetura fácil de manter
- código legível e modular

## 10. Critérios de sucesso do MVP
- coordenação consegue criar e editar escala sem planilha paralela
- conflitos bloqueantes aparecem antes do salvamento
- alertas fortes ficam visíveis sem impedir exceções
- solicitação e permuta funcionam ponta a ponta
- estado pode ser exportado/importado sem perda relevante
