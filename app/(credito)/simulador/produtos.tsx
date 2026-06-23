import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../../src/store';
import { setPerfil, setProduto, prevStep, nextStep } from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import SimuladorProdutoCard from '../../../src/components/organisms/SimuladorProdutoCard';
import { CreditoMockData } from '../../../src/utils/creditoMockData';

const PERFIS = [
  { id: 'pf', label: 'Pessoa Fisica', icon: 'person' },
  { id: 'produtor_pf', label: 'Produtor Rural PF', icon: 'agriculture' },
  { id: 'mei', label: 'MEI', icon: 'storefront' },
  { id: 'pme', label: 'PME', icon: 'domain' },
  { id: 'produtor_pj', label: 'Produtor Rural PJ', icon: 'landscape' },
];

export default function ProdutosScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { step, perfil, produtoSelecionadoId } = useSelector((state: RootState) => state.simulador);

  const handleSelectPerfil = (id: string) => {
    dispatch(setPerfil(id === perfil ? null : id));
  };

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

  // Simulating the filtered products logic
  const produtosDisponiveis = perfil === 'produtor_pf' 
    ? CreditoMockData.produtos.slice(0, 2) 
    : CreditoMockData.produtos;

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />
      
      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
          Confira os produtos{'\n'}que atendem sua
        </Text>
        <Text className="text-[16px] text-gray-500 mb-8">
          Selecione um produto para fazer sua simulacao.
        </Text>

        {/* Perfil Selection */}
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="person-outline" size={20} color="#0A3D24" />
            <Text className="text-[14px] text-gray-700 ml-2">Qual seu perfil?</Text>
          </View>
          
          <View className="flex-row flex-wrap gap-2">
            {PERFIS.map((p) => {
              const isActive = perfil === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => handleSelectPerfil(p.id)}
                  activeOpacity={0.7}
                  className={`flex-row items-center px-4 py-2.5 rounded-full border ${
                    isActive ? 'bg-green-100 border-green-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <MaterialIcons 
                    name={p.icon as any} 
                    size={16} 
                    color={isActive ? '#16A34A' : '#4B5563'} 
                  />
                  <Text 
                    className={`ml-2 text-[13px] font-bold ${
                      isActive ? 'text-green-800' : 'text-gray-600'
                    }`}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Banner Quantity */}
        <View className="bg-green-50 rounded-xl px-4 py-3 mb-6 flex-row items-center">
          <MaterialIcons name="check-circle-outline" size={20} color="#16A34A" />
          <Text className="text-green-600 font-bold ml-2">
            {produtosDisponiveis.length} produtos disponiveis
          </Text>
        </View>

        <Text className="font-bold text-[18px] text-gray-800 mb-4">
          Temos {produtosDisponiveis.length} opcoes para voce
        </Text>

        {/* Products List */}
        {produtosDisponiveis.map((produto) => (
          <SimuladorProdutoCard
            key={produto.id}
            produto={produto}
            isSelected={produtoSelecionadoId === produto.id}
            onSelect={handleSelectProduto}
          />
        ))}

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
            produtoSelecionadoId ? 'bg-gray-600' : 'bg-gray-400'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
