export interface EtapaJornada {
  id: string;
  titulo: string;
  descricao: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'BLOQUEADO';
  dataInicio?: string;
  dataConclusao?: string;
  responsavel: string;
}

export interface DocumentoModel {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  status: 'Validado' | 'Pendente' | 'Vencido';
  ok: boolean;
}

export interface GarantiaModel {
  id: string;
  descricao: string;
  tipo: string;
  valor: number;
  cobertura: string;
  status: string;
  ok: boolean;
}

export interface PendenciaModel {
  id: string;
  descricao: string;
  tipo: 'Critica' | 'Alerta' | 'Informativo';
  dataCriacao: string;
  resolvida: boolean;
}

export interface PropostaModel {
  id: string;
  numeroProposta: string;
  nomeCliente: string;
  produto: string; 
  siglaProduto: string; 
  valorSolicitado: number;
  status: 'RASCUNHO' | 'EM_ANALISE' | 'PENDENTE' | 'APROVADO' | 'REPROVADO' | 'CONDICIONAL' | 'FORMALIZADO';
  statusLabel: string;
  gerente: string;
  etapaAtual: string;
  percentualConclusao: number;
  etapas: EtapaJornada[];
  quantidadePendencias: number;
  documentos: DocumentoModel[];
  garantias: GarantiaModel[];
  pendencias: PendenciaModel[];
}

export const PropostasMockData: PropostaModel[] = [
  {
    id: 'prop-1',
    numeroProposta: 'SIGA-2026-001847',
    nomeCliente: 'João da Silva',
    produto: 'FNO Custeio Agropecuario',
    siglaProduto: 'FNO-CAR',
    valorSolicitado: 380000.00,
    status: 'EM_ANALISE',
    statusLabel: 'Em analise',
    gerente: 'Ana Paula Santos',
    etapaAtual: 'Dados complementares',
    percentualConclusao: 58,
    quantidadePendencias: 3,
    etapas: [
      { id: 'e1', titulo: '1. Entrada da demanda', descricao: 'Proposta criada via app', status: 'CONCLUIDO', dataConclusao: '2026-05-15T10:00:00Z', responsavel: 'Sistema' },
      { id: 'e2', titulo: '2. Identificacao', descricao: 'Dados pessoais e LGPD', status: 'CONCLUIDO', dataConclusao: '2026-05-15T10:30:00Z', responsavel: 'Cliente' },
      { id: 'e3', titulo: '3. Consulta KYC', descricao: 'Validacao cadastral e PLD', status: 'CONCLUIDO', dataConclusao: '2026-05-16T14:00:00Z', responsavel: 'Sistema' },
      { id: 'e4', titulo: '4. Diagnostico', descricao: 'Necessidade e valor identificados', status: 'CONCLUIDO', dataConclusao: '2026-05-17T09:00:00Z', responsavel: 'Gerente' },
      { id: 'e5', titulo: '5. Pre-enquadramento', descricao: 'Validacao de limites e fontes', status: 'CONCLUIDO', dataConclusao: '2026-05-17T15:00:00Z', responsavel: 'Sistema' },
      { id: 'e6', titulo: '6. Dados complementares', descricao: 'Envio de documentos da propriedade rural e certidões', status: 'EM_ANDAMENTO', responsavel: 'Cliente' },
      { id: 'e7', titulo: '7. Analise tecnica', descricao: 'Avaliacao agronomica e viabilidade', status: 'PENDENTE', responsavel: 'Analista' },
      { id: 'e8', titulo: '8. Aprovacao de credito', descricao: 'Comite de credito', status: 'PENDENTE', responsavel: 'Comite' },
      { id: 'e9', titulo: '9. Formalizacao', descricao: 'Assinatura do contrato', status: 'PENDENTE', responsavel: 'Cliente' },
    ],
    documentos: [
      { id: 'd1', nome: 'Contrato Social / Estatuto', tipo: 'PDF', tamanho: '2.3 MB', status: 'Validado', ok: true },
      { id: 'd2', nome: 'CCIR – Certificado de Imóvel Rural', tipo: 'PDF', tamanho: '0.8 MB', status: 'Validado', ok: true },
      { id: 'd3', nome: 'CAR – Cadastro Ambiental Rural', tipo: 'PDF', tamanho: '1.2 MB', status: 'Validado', ok: true },
      { id: 'd4', nome: 'Matrícula do Imóvel (CRI)', tipo: 'PDF', tamanho: '4.1 MB', status: 'Validado', ok: true },
      { id: 'd5', nome: 'ITR – Declaração de Imposto', tipo: 'PDF', tamanho: '0.5 MB', status: 'Pendente', ok: false },
      { id: 'd6', nome: 'Orçamento de Custeio', tipo: 'XLSX', tamanho: '1.8 MB', status: 'Validado', ok: true },
      { id: 'd7', nome: 'Certidão Negativa de Débitos', tipo: 'PDF', tamanho: '0.2 MB', status: 'Vencido', ok: false },
    ],
    garantias: [
      { id: 'g1', descricao: 'CPR Física – Soja', tipo: 'CPR', valor: 2520000, cobertura: '136%', status: 'Regular', ok: true },
      { id: 'g2', descricao: 'Penhor Agrícola – Implementos', tipo: 'Penhor', valor: 980000, cobertura: '53%', status: 'Regular', ok: true },
      { id: 'g3', descricao: 'Alienação Fiduciária – Veículos', tipo: 'Alienação', valor: 340000, cobertura: '18%', status: 'Regular', ok: true },
    ],
    pendencias: [
      { id: 'p1', descricao: 'Assinatura eletrônica do avalista pendente', tipo: 'Critica', dataCriacao: '2026-06-18T10:00:00Z', resolvida: false },
      { id: 'p2', descricao: 'Renovação da Certidão Negativa de Débitos Federais exigida', tipo: 'Critica', dataCriacao: '2026-06-19T08:30:00Z', resolvida: false },
      { id: 'p3', descricao: 'Aguardando validação do Laudo Socioambiental (Agrotools)', tipo: 'Alerta', dataCriacao: '2026-06-19T14:00:00Z', resolvida: false },
    ]
  }
];
