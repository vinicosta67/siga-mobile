import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../../src/store';
import { setGarantiaSelecionada, prevStep, nextStep } from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import { CreditoMockData } from '../../../src/utils/creditoMockData';

const GARANTIAS = [
  { id: 'avalista', title: 'Avalista / Fiador', icon: 'person-add-alt-1' },
  { id: 'imovel_rural', title: 'Hipoteca de Imóvel Rural', icon: 'landscape' },
  { id: 'imovel_urbano', title: 'Hipoteca de Imóvel Urbano', icon: 'home-work' },
  { id: 'alienacao_maq', title: 'Alienação Fiduciária de Máquinas', icon: 'precision-manufacturing' },
  { id: 'alienacao_veiculo', title: 'Alienação Fiduciária de Veículos', icon: 'directions-car' },
  { id: 'fundo_aval', title: 'Fundo de Aval (FGI/FAMPE)', icon: 'shield' },
];

export default function GarantiaScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { step, produtoSelecionadoId, garantiaSelecionada } = useSelector((state: RootState) => state.simulador);

  const produto = CreditoMockData.produtos.find(p => p.id === produtoSelecionadoId) || CreditoMockData.produtos[0];

  const handleSelect = (id: string) => {
    dispatch(setGarantiaSelecionada(id === garantiaSelecionada ? null : id));
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const handleContinue = () => {
    dispatch(nextStep());
    router.push('/(credito)/simulador/resumo');
  };

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
          Tipo de garantia
        </Text>
        <Text className="text-[16px] text-gray-500 mb-6">
          Selecione a garantia que você pretende oferecer (Opcional nesta etapa)
        </Text>

        <View className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-row mb-6">
          <MaterialIcons name="info-outline" size={18} color="#2563EB" />
          <Text className="text-blue-700 text-[13px] ml-2 flex-1">
            Garantias aceitas para {produto.sigla}: Avalista, Hipoteca, Alienação Fiduciária, Fundos de Aval.
          </Text>
        </View>

        {GARANTIAS.map((g) => {
          const isSelected = garantiaSelecionada === g.id;
          return (
            <TouchableOpacity
              key={g.id}
              onPress={() => handleSelect(g.id)}
              activeOpacity={0.8}
              className={`p-4 rounded-xl border mb-3 flex-row items-center ${
                isSelected ? 'border-[#0A3D24] bg-[#E8F3EB]' : 'border-gray-200 bg-white'
              }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                isSelected ? 'bg-[#0A3D24]' : 'bg-gray-100'
              }`}>
                <MaterialIcons 
                  name={g.icon as any} 
                  size={20} 
                  color={isSelected ? '#FFFFFF' : '#6B7280'} 
                />
              </View>
              <Text className={`flex-1 font-bold text-[15px] ${isSelected ? 'text-[#0A3D24]' : 'text-gray-700'}`}>
                {g.title}
              </Text>
              {isSelected ? (
                <MaterialIcons name="check-circle" size={24} color="#0A3D24" />
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
            </TouchableOpacity>
          );
        })}

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
          onPress={handleContinue}
          className="flex-1 py-4 rounded-full items-center bg-[#0A3D24]"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
