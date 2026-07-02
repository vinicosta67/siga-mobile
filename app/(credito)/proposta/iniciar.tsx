import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { createProposal } from '../../../src/services/proposalService';
import { RootState } from '../../../src/store';
import { resetSimulador } from '../../../src/store/slices/simuladorSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function IniciarPropostaScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const { produtoSelecionadoNome } = useSelector((state: RootState) => state.simulador);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateDraft = async () => {
      try {
        const {
          produto_id,
          valor_solicitado,
          prazo_meses,
          carencia_meses,
          sistema_amortizacao,
          garantias
        } = params;

        let garantiasParseadas = [];
        if (typeof garantias === 'string') {
            try { garantiasParseadas = JSON.parse(garantias); } catch(e) {}
        }

        const nomeProdutoUpper = (produtoSelecionadoNome || '').toUpperCase();
        const isAgro = 
          nomeProdutoUpper.includes('RURAL') || 
          nomeProdutoUpper.includes('AGRO') || 
          nomeProdutoUpper.includes('PRONAF') || 
          nomeProdutoUpper.includes('CUSTEIO') || 
          nomeProdutoUpper.includes('FLORESTAL') || 
          nomeProdutoUpper.includes('IRRIGAÇÃO');

        const tipoCreditoStr = isAgro ? 'Crédito Rural' : 'Crédito Empresarial';

        const payload = {
          title: produtoSelecionadoNome ? `Solicitação - ${produtoSelecionadoNome}` : 'Solicitação de Crédito via Mobile',
          type: tipoCreditoStr,
          creditType: tipoCreditoStr,
          requestedValue: Number(valor_solicitado),
          financedValue: Number(valor_solicitado) * 0.8, // Exemplo de regra (ajustar no back)
          term: Number(prazo_meses),
          gracePeriod: Number(carencia_meses),
          purpose: 'INVESTIMENTO', // mock, dependeria da tela inicial
          status: 'RASCUNHO',
          amortizationSystem: sistema_amortizacao,
          
          email: user?.email || '',
          companyName: user?.name || '',
          
          metadata: {
            produto_id,
            origin: 'MOBILE_APP',
          },
          
          guarantees: garantiasParseadas
        };

        const result = await createProposal(payload);
        
        // Limpa o estado da simulação pois a proposta já foi persistida
        dispatch(resetSimulador());

        // Navega para o fluxo de coleta de dados complementares (começando pelo Negócio para identificar PF/PJ)
        router.replace({
          pathname: `/(credito)/proposta/${result.proposal.id}/complemento/negocio` as any,
          params: { produto_id, tipo_produto: payload.type }
        });

      } catch (err: any) {
        console.error('Erro ao criar proposta:', err);
        setError(err.message || 'Falha ao iniciar a proposta. Tente novamente.');
      }
    };

    generateDraft();
  }, []);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-[#f4f7f5]">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="text-gray-900 font-bold text-xl mt-4 text-center">Ops, algo deu errado!</Text>
        <Text className="text-gray-500 text-center mt-2">{error}</Text>
        <View className="mt-8">
            <Text 
                className="text-[#92dc49] font-bold underline p-4" 
                onPress={() => router.back()}
            >
                Voltar para o simulador
            </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-[#f4f7f5] p-6">
      <View className="bg-white p-8 rounded-3xl items-center shadow-sm w-full max-w-sm">
        <ActivityIndicator size="large" color="#92dc49" />
        <Text className="text-gray-900 font-bold text-xl mt-6 text-center">Iniciando sua proposta</Text>
        <Text className="text-gray-500 text-center mt-2 font-medium">Isso levará apenas alguns segundos. Estamos registrando suas preferências...</Text>
      </View>
    </View>
  );
}
