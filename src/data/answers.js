export const ANSWERS = {
  fin: {
    text: 'Não há como lançar direto na competência fechada — o período de junho está encerrado e o sistema recusa qualquer movimento com data anterior ao fechamento. O caminho aceito é o lançamento extemporâneo no período aberto, referenciando a nota original.',
    steps: [
      'Financeiro › Lançamentos › Novo e selecione o tipo Extemporâneo.',
      'Em “Documento de origem”, informe a chave de acesso da NF de 12/06.',
      'Anexe a justificativa e envie para aprovação do gestor fiscal.',
    ],
    note: 'O valor entra no resultado do mês corrente. Se a nota impactar apuração de imposto do mês fechado, abra também um chamado para o fiscal avaliar retificação.',
    sources: ['POP-FIN-014'],
  },
  com: {
    text: 'O campo de desconto trava em 12% pela sua alçada. Não existe liberação direta no pedido, mas há o fluxo de exceção comercial, que mantém o pedido aberto enquanto a alçada 2 avalia.',
    steps: [
      'No pedido, abra Ações › Solicitar exceção de desconto.',
      'Informe o percentual pretendido e a justificativa comercial.',
      'Acompanhe em Pedidos › Pendentes de alçada até o parecer.',
    ],
    note: 'Enquanto a exceção está pendente o pedido não fatura. Prazo médio de parecer: 1 dia útil.',
    sources: ['ERP-COM-221'],
  },
  cad: {
    text: 'O cadastro definitivo exige CNPJ ativo. Para não travar a operação, use o registro provisório, que permite emitir orçamento e reservar estoque sem liberar faturamento.',
    steps: [
      'Cadastros › Clientes › Novo, marque “Registro provisório”.',
      'Preencha razão social, endereço e responsável; o CNPJ fica pendente.',
      'Anexe o comprovante de solicitação na Receita e salve.',
    ],
    note: 'Validade de 30 dias e limite de crédito zero. Sem regularização, o registro é bloqueado automaticamente.',
    sources: ['POP-CAD-008'],
  },
  est: {
    text: 'A tela de inventário não aceita ajuste em lote por design — cada linha exige conferência. Para volume alto, o procedimento é a importação de planilha modelo com conferência cega.',
    steps: [
      'Estoque › Inventário › Importar ajuste e baixe a planilha modelo.',
      'Preencha SKU, quantidade contada e motivo; envie o arquivo.',
      'Solicite a conferência cega de um segundo operador e efetive.',
    ],
    note: 'Acima de 500 linhas a efetivação roda em fila noturna; o saldo só reflete no dia seguinte.',
    sources: ['POP-EST-031'],
  },
}
