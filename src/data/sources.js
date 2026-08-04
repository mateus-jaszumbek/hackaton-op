export const SOURCES = {
  'POP-FIN-014': {
    title: 'Lançamentos em competência encerrada',
    ref: 'POP-FIN-014 · §3.2',
    updated: 'Revisado 12/05/2026',
    owner: 'Rafael Fontes',
    ownerRole: 'Gestor fiscal · aprovador',
    excerpt:
      'Movimentos com data anterior ao fechamento não podem ser inseridos no período de origem. Admite-se o registro extemporâneo no período aberto, obrigatoriamente vinculado à chave do documento original e com justificativa anexada. A liberação é do gestor fiscal.',
  },
  'ERP-COM-221': {
    title: 'Descontos acima da alçada comercial',
    ref: 'ERP-COM-221 · §5',
    updated: 'Revisado 28/03/2026',
    owner: 'Rafael Fontes',
    ownerRole: 'Comercial · alçada 2',
    excerpt:
      'O campo de desconto trava em 12%. Percentuais superiores exigem solicitação de exceção no próprio pedido, que gera fila de aprovação para a alçada 2. O pedido permanece bloqueado para faturamento até o parecer.',
  },
  'POP-CAD-008': {
    title: 'Cadastro de cliente sem CNPJ ativo',
    ref: 'POP-CAD-008 · §2.1',
    updated: 'Revisado 02/06/2026',
    owner: 'Rafael Fontes',
    ownerRole: 'Cadastro · dados mestres',
    excerpt:
      'Pessoa jurídica sem inscrição ativa é cadastrada como registro provisório, com validade de 30 dias e limite de crédito zero. A conversão em definitivo depende da regularização na Receita e da conferência de dados mestres.',
  },
  'POP-EST-031': {
    title: 'Ajuste de estoque em lote',
    ref: 'POP-EST-031 · §4',
    updated: 'Revisado 19/04/2026',
    owner: 'Rafael Fontes',
    ownerRole: 'Estoque · supervisão',
    excerpt:
      'A tela de inventário aceita ajuste unitário. Volumes acima de 50 itens seguem por importação de planilha modelo no módulo de inventário, com conferência cega por um segundo operador antes da efetivação.',
  },
}
