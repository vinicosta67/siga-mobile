export type FonteCredito = 'FNO' | 'BNDES';

export interface ProdutoCredito {
  id: string;
  sigla: string;
  nome: string;
  fonte: FonteCredito;
  familia: string;
  referenciasMcr: string;
  codigoSiope: string;
  tefAnual: number;
  spreadAnual: number;
  tacPercent: number;
  iofAnual: number;
  cetEstimado: number;
  prazoMaxMeses: number;
  carenciaMaxMeses: number;
  valorMinimo: number;
  valorMaximo: number;
  portesAtendidos: string;
  finalidade: string;
  sistemaAmortizacao: string;
  garantiasAceitas: string;
  exigeCar: boolean;
  exigeSicor: boolean;
  exigeZarc: boolean;
  exigeSensoriamento: boolean;
  documentosExigidos: string;
  observacoes: string;
}

export interface OfertaPreAprovada {
  id: string;
  produtoId: string;
  nomeProduto: string;
  valorPreAprovado: number;
  taxaEspecial: number;
  prazoSugerido: number;
  carenciaSugerida: number;
  motivoOferta: string;
  validadeOferta: Date;
  statusOferta: 'disponivel' | 'simulada' | 'aceita' | 'expirada';
  gerenteNome: string;
  gerenteTelefone: string;
}

export const produtos: ProdutoCredito[] = [
  {
    id: 'fno-car',
    sigla: 'FNO-CAR',
    nome: 'FNO Custeio Agropecuário',
    fonte: 'FNO',
    familia: 'Crédito Rural',
    referenciasMcr: 'MCR 2-1-1',
    codigoSiope: '5001',
    tefAnual: 7.0,
    spreadAnual: 2.0,
    tacPercent: 0.3,
    iofAnual: 0.38,
    cetEstimado: 9.68,
    prazoMaxMeses: 24,
    carenciaMaxMeses: 6,
    valorMinimo: 5000,
    valorMaximo: 3000000,
    portesAtendidos: 'Micro / Pequeno / Médio / Grande',
    finalidade: 'Financiamento de safra — insumos, mão de obra, serviços',
    sistemaAmortizacao: 'Price ou SAC',
    garantiasAceitas: 'Penhor agrícola, hipoteca, aval',
    exigeCar: true,
    exigeSicor: true,
    exigeZarc: true,
    exigeSensoriamento: false,
    documentosExigidos: 'DAP/CAF ou CNPJ, CAR, nota fiscal insumos, ZARC, croqui',
    observacoes: 'Principal linha de custeio da região Norte'
  },
  {
    id: 'fno-inv',
    sigla: 'FNO-INV',
    nome: 'FNO Investimento',
    fonte: 'FNO',
    familia: 'Crédito Rural',
    referenciasMcr: 'MCR 2-1-3',
    codigoSiope: '5002',
    tefAnual: 7.0,
    spreadAnual: 2.5,
    tacPercent: 0.5,
    iofAnual: 0.38,
    cetEstimado: 10.38,
    prazoMaxMeses: 120,
    carenciaMaxMeses: 24,
    valorMinimo: 10000,
    valorMaximo: 15000000,
    portesAtendidos: 'Micro / Pequeno / Médio / Grande',
    finalidade: 'Implantação, modernização e ampliação de infraestrutura produtiva',
    sistemaAmortizacao: 'Price ou SAC',
    garantiasAceitas: 'Hipoteca, alienação fiduciária, penhor de máquinas',
    exigeCar: true,
    exigeSicor: true,
    exigeZarc: false,
    exigeSensoriamento: false,
    documentosExigidos: 'CNPJ/CPF, CAR, projetos técnicos, orçamentos',
    observacoes: 'Carência até 24 meses; ideal para mecanização'
  },
  {
    id: 'fno-flo',
    sigla: 'FNO-FLO',
    nome: 'FNO Florestal e Bioeconomia',
    fonte: 'FNO',
    familia: 'Florestal / Bioeconomia',
    referenciasMcr: 'MCR 2-1-5',
    codigoSiope: '5005',
    tefAnual: 6.0,
    spreadAnual: 2.0,
    tacPercent: 0.3,
    iofAnual: 0.0,
    cetEstimado: 8.3,
    prazoMaxMeses: 180,
    carenciaMaxMeses: 48,
    valorMinimo: 20000,
    valorMaximo: 20000000,
    portesAtendidos: 'Micro / Pequeno / Médio / Grande',
    finalidade: 'Sistemas agroflorestais, reflorestamento, manejo sustentável',
    sistemaAmortizacao: 'SAC (parcelas anuais)',
    garantiasAceitas: 'Hipoteca rural, FGO, penhor florestal',
    exigeCar: true,
    exigeSicor: true,
    exigeZarc: false,
    exigeSensoriamento: true,
    documentosExigidos: 'CAR, plano de manejo florestal, PMFS, georreferenciamento',
    observacoes: 'Alinhado à agenda ESG; prazo de 15 anos para ciclos longos'
  }
];

export const ofertasPreAprovadas: OfertaPreAprovada[] = [
  {
    id: 'pa-1',
    produtoId: 'fno-car',
    nomeProduto: 'FNO Custeio Agropecuário',
    valorPreAprovado: 450000,
    taxaEspecial: 8.5,
    prazoSugerido: 24,
    carenciaSugerida: 6,
    motivoOferta: 'Histórico de 5 safras financiadas com adimplência total',
    validadeOferta: new Date(2026, 8, 30), // Months are 0-indexed in JS (8 = Sept)
    statusOferta: 'disponivel',
    gerenteNome: 'Ana Paula Santos',
    gerenteTelefone: '(91) 3004-9999'
  },
  {
    id: 'pa-2',
    produtoId: 'fno-inv',
    nomeProduto: 'FNO Investimento',
    valorPreAprovado: 1200000,
    taxaEspecial: 9.0,
    prazoSugerido: 96,
    carenciaSugerida: 18,
    motivoOferta: 'Crescimento de faturamento de 35% nos últimos 3 anos',
    validadeOferta: new Date(2026, 11, 31), // Dec 31
    statusOferta: 'disponivel',
    gerenteNome: 'Ana Paula Santos',
    gerenteTelefone: '(91) 3004-9999'
  },
  {
    id: 'pa-3',
    produtoId: 'fno-flo',
    nomeProduto: 'FNO Florestal e Bioeconomia',
    valorPreAprovado: 800000,
    taxaEspecial: 7.5,
    prazoSugerido: 120,
    carenciaSugerida: 36,
    motivoOferta: 'Propriedade com 60% de cobertura florestal preservada',
    validadeOferta: new Date(2026, 7, 31), // Aug 31
    statusOferta: 'disponivel',
    gerenteNome: 'Ana Paula Santos',
    gerenteTelefone: '(91) 3004-9999'
  }
];

export interface OportunidadeCredito {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  taxaDesde?: number;
  ctaTexto?: string;
  produtoRelacionadoId?: string;
}

export const oportunidades: OportunidadeCredito[] = [
  {
    id: 'op-1',
    categoria: 'rural',
    titulo: 'Safra 2026/2027 com taxas especiais',
    descricao: 'Aproveite o início do ano-safra para custear sua produção com taxas a partir de 5% a.a. pelo FNO.',
    taxaDesde: 5.0,
    ctaTexto: 'Simular agora',
    produtoRelacionadoId: 'fno-car',
  },
  {
    id: 'op-2',
    categoria: 'destaque',
    titulo: 'Renovação de frota e maquinário',
    descricao: 'Modernize seus equipamentos agrícolas com prazos estendidos de até 10 anos pelo FNO Investimento.',
    taxaDesde: 8.5,
    ctaTexto: 'Ver condições',
    produtoRelacionadoId: 'fno-inv',
  },
  {
    id: 'op-3',
    categoria: 'rural',
    titulo: 'Transição para energia solar',
    descricao: 'Reduza seus custos operacionais instalando painéis solares na propriedade.',
    ctaTexto: 'Simular projeto',
    produtoRelacionadoId: 'fno-inv',
  },
  {
    id: 'op-4',
    categoria: 'mpe',
    titulo: 'Capital de Giro para pequenas empresas',
    descricao: 'Linhas do FNO específicas para micro e pequenas empresas garantirem o fluxo de caixa.',
    taxaDesde: 9.0,
    ctaTexto: 'Simular crédito comercial',
  }
];

export interface ParcelaContrato {
  numero: number;
  vencimento: Date;
  valor: number;
  status: 'paga' | 'aberta' | 'vencida' | 'agendada';
  dataPagamento?: Date;
  codigoBoleto?: string;
}

export interface TransacaoContrato {
  descricao: string;
  tipo: string;
  data: Date;
  valor: number;
}

export interface EtapaSafra {
  nome: string;
  dataInicioPrevista: Date;
  dataFimPrevista: Date;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  percentualConcluido?: number;
}

export interface AlertaGis {
  titulo: string;
  descricao: string;
  severidade: 'info' | 'alerta' | 'critico';
  data: Date;
  resolvido: boolean;
}

export interface FornecedorComprador {
  id: string;
  nome: string;
  cpfCnpj: string;
  tipo: 'fornecedor' | 'comprador';
  produto: string;
  status: 'ativo' | 'pendente' | 'inativo';
}

export interface MonitoramentoGis {
  propriedadeNome: string;
  car: string;
  areaTotalHa: number;
  areaFinanciadaHa: number;
  cultura: string;
  safra: string;
  cronogramaSafra: EtapaSafra[];
  alertas: AlertaGis[];
  fornecedores: FornecedorComprador[];
  compradores: FornecedorComprador[];
  statusMonitoramento: 'conforme' | 'alerta' | 'divergente';
  ndviAtual: number;
  ultimaImagemSatelite: Date;
}

export interface ContratoAtivo {
  id: string;
  numeroContrato: string;
  produto: ProdutoCredito;
  valorContratado: number;
  saldoDevedor: number;
  valorParcelaAtual: number;
  dataContratacao: Date;
  proximoVencimento: Date;
  parcelasRestantes: number;
  totalParcelas: number;
  parcelasEmAtraso: number;
  statusContrato: 'adimplente' | 'atraso_leve' | 'atraso_grave' | 'renegociado';
  debitoAutomatico: boolean;
  parcelas: ParcelaContrato[];
  transacoes: TransacaoContrato[];
  monitoramentoGis?: MonitoramentoGis;
}

export const CreditoMockData = {
  produtos,
  ofertasPreAprovadas,
  oportunidades,
  contratoAtivo: {
    id: 'ctr-001',
    numeroContrato: 'BASA-FNO-2025-014523',
    produto: produtos[0],
    valorContratado: 320000,
    saldoDevedor: 198450.67,
    valorParcelaAtual: 18520.33,
    dataContratacao: new Date(2025, 6, 15),
    proximoVencimento: new Date(2026, 6, 15),
    parcelasRestantes: 11,
    totalParcelas: 24,
    parcelasEmAtraso: 0,
    statusContrato: 'adimplente',
    debitoAutomatico: true,
    parcelas: [
      { numero: 1, vencimento: new Date(2026, 0, 15), valor: 18520.33, status: 'paga', dataPagamento: new Date(2026, 0, 14) },
      { numero: 2, vencimento: new Date(2026, 1, 15), valor: 18520.33, status: 'paga', dataPagamento: new Date(2026, 1, 15) },
      { numero: 3, vencimento: new Date(2026, 2, 15), valor: 18520.33, status: 'paga', dataPagamento: new Date(2026, 2, 14) },
      { numero: 4, vencimento: new Date(2026, 3, 15), valor: 18520.33, status: 'paga', dataPagamento: new Date(2026, 3, 15) },
      { numero: 5, vencimento: new Date(2026, 4, 15), valor: 18520.33, status: 'paga', dataPagamento: new Date(2026, 4, 14) },
      { numero: 6, vencimento: new Date(2026, 5, 15), valor: 18520.33, status: 'paga', dataPagamento: new Date(2026, 5, 13) },
      { numero: 7, vencimento: new Date(2026, 6, 15), valor: 18520.33, status: 'aberta', codigoBoleto: '23793.38128 60000.000003 00014.523001 1 92340000018520' },
      { numero: 8, vencimento: new Date(2026, 7, 15), valor: 18520.33, status: 'agendada' },
      { numero: 9, vencimento: new Date(2026, 8, 15), valor: 18520.33, status: 'agendada' },
      { numero: 10, vencimento: new Date(2026, 9, 15), valor: 18520.33, status: 'agendada' },
      { numero: 11, vencimento: new Date(2026, 10, 15), valor: 18520.33, status: 'agendada' },
    ],
    transacoes: [
      { descricao: 'Pagamento parcela 6/24', tipo: 'pagamento', data: new Date(2026, 5, 13), valor: 18520.33 },
      { descricao: 'Pagamento parcela 5/24', tipo: 'pagamento', data: new Date(2026, 4, 14), valor: 18520.33 },
      { descricao: 'Pagamento parcela 4/24', tipo: 'pagamento', data: new Date(2026, 3, 15), valor: 18520.33 },
      { descricao: 'Liberacao 2a parcela', tipo: 'liberacao', data: new Date(2025, 9, 15), valor: 160000 },
      { descricao: 'Liberacao 1a parcela', tipo: 'liberacao', data: new Date(2025, 6, 15), valor: 160000 },
    ],
    monitoramentoGis: {
      propriedadeNome: 'Fazenda Sao Jose',
      car: 'PA-1500602-A1B2C3D4E5F6',
      areaTotalHa: 480,
      areaFinanciadaHa: 250,
      cultura: 'Soja',
      safra: '2025/2026',
      statusMonitoramento: 'conforme',
      ndviAtual: 0.78,
      ultimaImagemSatelite: new Date(2026, 5, 10),
      cronogramaSafra: [
        { nome: 'Preparo do solo', dataInicioPrevista: new Date(2025, 8, 1), dataFimPrevista: new Date(2025, 9, 15), status: 'concluida', percentualConcluido: 100 },
        { nome: 'Plantio', dataInicioPrevista: new Date(2025, 9, 15), dataFimPrevista: new Date(2025, 10, 30), status: 'concluida', percentualConcluido: 100 },
        { nome: 'Tratos culturais', dataInicioPrevista: new Date(2025, 11, 1), dataFimPrevista: new Date(2026, 2, 31), status: 'concluida', percentualConcluido: 100 },
        { nome: 'Colheita', dataInicioPrevista: new Date(2026, 3, 1), dataFimPrevista: new Date(2026, 5, 30), status: 'em_andamento', percentualConcluido: 75 },
      ],
      alertas: [
        { titulo: 'NDVI dentro do esperado', descricao: 'O indice de vegetacao esta compativel com o estagio da cultura', severidade: 'info', data: new Date(2026, 5, 10), resolvido: true },
        { titulo: 'Colheita em andamento', descricao: 'Imagens de satelite confirmam atividade de colheita na area financiada', severidade: 'info', data: new Date(2026, 5, 5), resolvido: true },
      ],
      fornecedores: [
        { id: 'f1', nome: 'Agromax Insumos Ltda', cpfCnpj: '12.345.678/0001-90', tipo: 'fornecedor', produto: 'Sementes de soja e fertilizantes', status: 'ativo' },
        { id: 'f2', nome: 'MaqAgro Equipamentos', cpfCnpj: '98.765.432/0001-10', tipo: 'fornecedor', produto: 'Defensivos agricolas', status: 'ativo' },
      ],
      compradores: [
        { id: 'c1', nome: 'Cargill Agricola S.A.', cpfCnpj: '01.234.567/0001-89', tipo: 'comprador', produto: 'Soja em grao', status: 'ativo' },
        { id: 'c2', nome: 'Bunge Alimentos S.A.', cpfCnpj: '11.222.333/0001-44', tipo: 'comprador', produto: 'Soja em grao', status: 'pendente' },
      ],
    }
  } as ContratoAtivo
};
