import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '../../../src/store';
import { setNecessidade, nextStep } from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import NecessidadeOptionCard from '../../../src/components/molecules/NecessidadeOptionCard';

const OPTIONS = [
  {
    id: 'plantar',
    icon: 'eco',
    title: 'Quero plantar',
    description: 'Financie insumos, sementes, mao de obra e servicos para sua proxima safra',
  },
  {
    id: 'maquinario',
    icon: 'precision-manufacturing',
    title: 'Comprar maquinario',
    description: 'Financie tratores, implementos, equipamentos e veiculos para sua producao',
  },
  {
    id: 'construir',
    icon: 'build',
    title: 'Construir ou reformar',
    description: 'Construa armazens, silos, galoes, cercas e outras benfeitorias',
  },
  {
    id: 'capital',
    icon: 'account-balance-wallet',
    title: 'Capital de giro',
    description: 'Mantenha sua operacao funcionando com capital para o dia a dia',
  },
  {
    id: 'reflorestar',
    icon: 'park',
    title: 'Reflorestar ou manejar',
    description: 'Investir em sistemas agroflorestais, reflorestamento e manejo sustentavel',
  },
  {
    id: 'industrializar',
    icon: 'factory',
    title: 'Industrializar producao',
    description: 'Monte ou amplie sua agroindustria, frigorifico ou planta de beneficiamento',
  },
  {
    id: 'empreender',
    icon: 'storefront',
    title: 'Empreender',
    description: 'Invista no seu pequeno negocio com microcredito orientado',
  },
  {
    id: 'modernizar',
    icon: 'trending-up',
    title: 'Modernizar producao',
    description: 'Invista em tecnologia, irrigacao, automacao e eficiencia produtiva',
  },
];

export default function NecessidadeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { necessidade, step } = useSelector((state: RootState) => state.simulador);

  const handleSelect = (id: string) => {
    dispatch(setNecessidade(id));
  };

  const handleContinue = () => {
    if (necessidade) {
      dispatch(nextStep());
      router.push('/(credito)/simulador/produtos');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
          O que voce{'\n'}precisa?
        </Text>
        <Text className="text-[16px] text-gray-500 mb-8">
          Escolha o que melhor descreve sua necessidade
        </Text>

        {OPTIONS.map((opt) => (
          <NecessidadeOptionCard
            key={opt.id}
            id={opt.id}
            icon={opt.icon as any}
            title={opt.title}
            description={opt.description}
            isSelected={necessidade === opt.id}
            onSelect={handleSelect}
          />
        ))}
        
        {/* Padding for fixed bottom button */}
        <View className="h-28" />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View 
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 16 }}
      >
        <TouchableOpacity
          testID="btn-continuar"
          disabled={!necessidade}
          onPress={handleContinue}
          className={`py-4 rounded-full items-center ${
            necessidade ? 'bg-[#0A3D24]' : 'bg-gray-400'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
