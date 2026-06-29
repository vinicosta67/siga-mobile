import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';

// --- Types ---

export interface VitrineProduto {
  id: string;
  nome: string;
  cet_estimado_aa: number;
  limite_min: number;
  limite_max: number;
  prazo_max_meses: number;
  // Fallbacks UI mockados até o backend enviar
  tag?: string;
  isPopular?: boolean;
  beneficios?: string[];
}

export interface VitrineResponse {
  produtos: VitrineProduto[];
}

export interface ProdutoDetalhesResponse {
  regras_simulacao: {
    valor_min: number;
    valor_max: number;
    prazo_min: number;
    prazo_max: number;
    carencia_max: number;
    passo_slider: number;
  };
  garantias_exigidas: {
    garantia_real_obrigatoria: boolean;
    garantia_valor_minimo_obrigatorio: number | null;
    tipos_aceitos: string[];
    fundo_garantidor_disponivel: boolean;
    fundo_garantidor_nome: string | null;
  };
  documentacao_necessaria: {
    basicos: string[];
    especificos: string[];
    condicionantes: string[];
  };
}

export interface CalcularParcelasRequest {
  produto_id: string;
  valor_solicitado: number;
  prazo_meses: number;
  carencia_meses: number;
  sistema_amortizacao: string;
}

export interface CalcularParcelasResponse {
  resumo: {
    valor_financiado: number;
    prazo_total_meses: number;
    carencia_meses: number;
    sistema_amortizacao: string;
    taxa_juros_aa: number;
    taxa_juros_am: number;
    custo_iof: number;
    custo_tac: number;
    cet_calculado_aa: number;
    primeira_parcela: number;
    ultima_parcela: number;
    juros_totais: number;
    valor_total_a_pagar: number;
  };
  parcelas_estimadas: any[];
}

// --- Hooks ---

export const useVitrineProdutos = (necessidade: string | null, uf: string | null) => {
  return useQuery({
    queryKey: ['simulador', 'vitrine', necessidade, uf],
    queryFn: async () => {
      const { data } = await api.get<VitrineResponse>('/v1/simulador/vitrine', {
        params: { necessidade, uf },
      });
      return data;
    },
    // Só buscar se os parâmetros obrigatórios existirem
    enabled: !!necessidade && !!uf,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
};

export const useProdutoDetalhes = (produtoId: string | null) => {
  return useQuery({
    queryKey: ['simulador', 'produto', produtoId],
    queryFn: async () => {
      const { data } = await api.get<ProdutoDetalhesResponse>(`/v1/simulador/produtos/${produtoId}/detalhes`);
      return data;
    },
    enabled: !!produtoId,
    staleTime: 1000 * 60 * 30, // 30 minutos de cache
  });
};

export const useCalcularParcelas = () => {
  return useMutation({
    mutationFn: async (payload: CalcularParcelasRequest) => {
      const { data } = await api.post<CalcularParcelasResponse>('/v1/simulador/calcular-parcelas', payload);
      return data;
    },
  });
};
