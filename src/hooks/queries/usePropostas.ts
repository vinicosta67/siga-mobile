import { useQuery } from '@tanstack/react-query';
import { getProposals, getProposalById } from '../../services/proposalService';
import { storage } from '../../services/storage';

export interface BackendProposal {
  id: string;
  title: string;
  status: string;
  requestedValue: number;
  purpose: string;
  metadata?: any;
  user?: {
    name: string;
    email: string;
  };
}

const mapStatusToLabel = (status: string) => {
  switch (status) {
    case 'RASCUNHO': return 'Rascunho';
    case 'TRIAGEM': return 'Em triagem';
    case 'AN_TECNICA': return 'Análise técnica';
    case 'AN_JURIDICA': return 'Análise jurídica';
    case 'COMITE': return 'Em comitê';
    case 'APROVADO': return 'Aprovado';
    case 'REPROVADO': return 'Reprovado';
    case 'FORMALIZADO': return 'Formalizado';
    default: return 'Em análise';
  }
};

// Removido REQUIRED_DOCUMENTS fixo pois agora buscamos via useProdutoDetalhes na tela

const mapStatusToProgress = (status: string) => {
  switch (status) {
    case 'RASCUNHO': return 10;
    case 'TRIAGEM': return 25;
    case 'AN_TECNICA': return 50;
    case 'AN_JURIDICA': return 65;
    case 'COMITE': return 80;
    case 'APROVADO': return 90;
    case 'FORMALIZADO': return 100;
    case 'REPROVADO': return 100;
    default: return 50;
  }
};

export const usePropostas = () => {
  return useQuery({
    queryKey: ['propostas'],
    queryFn: async () => {
      const data: BackendProposal[] = await getProposals();
      
      // Map backend data to frontend PropostaModel structure
      return data.map((proposal) => ({
        id: proposal.id,
        numeroProposta: `SIGA-${proposal.id.substring(0, 8).toUpperCase()}`,
        nomeCliente: proposal.user?.name || 'Cliente',
        produto: proposal.title,
        siglaProduto: proposal.purpose,
        valorSolicitado: proposal.requestedValue,
        status: proposal.status,
        statusLabel: mapStatusToLabel(proposal.status),
        gerente: 'Gerente da Conta',
        etapaAtual: mapStatusToLabel(proposal.status),
        percentualConclusao: mapStatusToProgress(proposal.status),
        etapas: [], // to be loaded by timeline endpoint when viewing details
        quantidadePendencias: 0,
        documentos: [],
        garantias: [],
        pendencias: []
      }));
    },
    enabled: !!storage.getString('siga_logger_token'),
  });
};

export const useProposta = (proposalId: string) => {
  return useQuery({
    queryKey: ['proposta', proposalId],
    queryFn: async () => {
      const proposal: any = await getProposalById(proposalId);
      
      const uploadedDocs = proposal.documents || [];
      
      // Mapeia apenas os documentos mais recentes de cada tipo
      const latestDocsMap = new Map();
      uploadedDocs.forEach((u: any) => {
        const type = u.type || 'Documento Adicional';
        latestDocsMap.set(type, u); // Como a lista já vem ordenada por data, o último sobrescreve os antigos
      });
      
      const mergedDocuments = Array.from(latestDocsMap.values()).map((u: any) => {
        return {
          id: u.id,
          nome: u.type || 'Documento Adicional',
          tipo: u.originalName?.split('.').pop()?.toUpperCase() || 'ARQUIVO',
          tamanho: u.size ? `${(u.size / 1024 / 1024).toFixed(1)} MB` : 'Desconhecido',
          status: u.status === 'REJEITADO' ? 'Vencido' : 'Validado',
          ok: u.status !== 'REJEITADO'
        };
      });
      
      // Map backend data to frontend PropostaModel structure
      return {
        id: proposal.id,
        numeroProposta: `SIGA-${proposal.id.substring(0, 8).toUpperCase()}`,
        nomeCliente: proposal.user?.name || 'Cliente',
        produto: proposal.title,
        siglaProduto: proposal.purpose,
        valorSolicitado: proposal.requestedValue,
        status: proposal.status,
        statusLabel: mapStatusToLabel(proposal.status),
        gerente: proposal.analyst?.name || 'Não atribuído',
        etapaAtual: mapStatusToLabel(proposal.status),
        percentualConclusao: mapStatusToProgress(proposal.status),
        etapas: [
          { id: '1', titulo: 'Entrada da demanda', descricao: 'Proposta criada', status: 'CONCLUIDO' },
          { id: '2', titulo: 'Identificacao', descricao: 'Dados pessoais', status: proposal.status !== 'RASCUNHO' ? 'CONCLUIDO' : 'PENDENTE' },
          { id: '3', titulo: 'Consulta KYC', descricao: 'Validacao', status: 'PENDENTE' },
          { id: '4', titulo: 'Diagnostico', descricao: 'Necessidade', status: 'PENDENTE' },
        ],
        quantidadePendencias: 0,
        documentos: mergedDocuments,
        garantias: (proposal.guarantees || []).map((g: any) => {
          const valor = parseFloat(g.estimatedValue || g.assetValue || g.valor || 0);
          const percentual = proposal.requestedValue > 0 ? ((valor / proposal.requestedValue) * 100).toFixed(0) : '0';
          return {
            id: g.id,
            descricao: g.description || g.assetName || 'Garantia',
            tipo: g.type || g.assetType || 'Não informado',
            valor: valor,
            cobertura: `${percentual}%`,
            ok: true
          };
        }),
        pendencias: [],
        metadata: proposal.metadata
      };
    },
    enabled: !!proposalId
  });
};
