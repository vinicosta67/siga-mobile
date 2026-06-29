import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../../src/store';
import { setProduto, prevStep, nextStep } from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import SimuladorProdutoCard from '../../../src/components/organisms/SimuladorProdutoCard';
import { useVitrineProdutos } from '../../../src/hooks/queries/useSimulador';

export default function ProdutosScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { step, necessidade, uf, produtoSelecionadoId } = useSelector((state: RootState) => state.simulador);

  // Hook da API
  const { data, isLoading, isError } = useVitrineProdutos(necessidade, uf);

  const handleSelectProduto = (id: string) => {
    dispatch(setProduto(id));
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const handleContinue = () => {
    if (produtoSelecionadoId) {
      dispatch(nextStep());
      router.push('/(credito)/simulador/valores');
    }
  };

  const produtosDisponiveis = data?.produtos || [];
  const needsMoreInfo = !necessidade || !uf;

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
          Confira os produtos{'\n'}que atendem sua necessidade
        </Text>
        <Text className="text-[16px] text-gray-500 mb-8">
          Selecione um produto para simulação.
        </Text>

        {/* Loading State or Products List */}
        {needsMoreInfo ? (
          <View className="items-center py-8">
            <MaterialIcons name="touch-app" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 text-center mt-4">
              Informações insuficientes para buscar produtos.
            </Text>
          </View>
        ) : isLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#0A3D24" />
            <Text className="text-gray-500 mt-4">Buscando as melhores opções...</Text>
          </View>
        ) : isError ? (
          <View className="items-center py-8">
            <MaterialIcons name="error-outline" size={48} color="#EF4444" />
            <Text className="text-red-500 text-center mt-4">
              Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.
            </Text>
          </View>
        ) : produtosDisponiveis.length === 0 ? (
          <View className="items-center py-8">
            <MaterialIcons name="info-outline" size={48} color="#F59E0B" />
            <Text className="text-gray-500 text-center mt-4">
              Nenhum produto encontrado para a sua região.
            </Text>
          </View>
        ) : (
          <>
            <View className="bg-green-50 rounded-xl px-4 py-3 mb-6 flex-row items-center">
              <MaterialIcons name="check-circle-outline" size={20} color="#16A34A" />
              <Text className="text-green-600 font-bold ml-2">
                {produtosDisponiveis.length} produtos disponíveis
              </Text>
            </View>

            <Text className="font-bold text-[18px] text-gray-800 mb-4">
              Temos {produtosDisponiveis.length} opções para você
            </Text>

            {produtosDisponiveis.map((produto) => (
              <SimuladorProdutoCard
                key={produto.id}
                produto={produto}
                isSelected={produtoSelecionadoId === produto.id}
                onSelect={handleSelectProduto}
              />
            ))}
          </>
        )}

        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View 
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row gap-4"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 16 }}
      >
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 py-4 rounded-full items-center border border-gray-800 bg-white"
          activeOpacity={0.8}
        >
          <Text className="text-gray-800 font-bold text-[16px]">Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!produtoSelecionadoId}
          onPress={handleContinue}
          className={`flex-1 py-4 rounded-full items-center ${
            produtoSelecionadoId ? 'bg-[#0A3D24]' : 'bg-gray-400'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
