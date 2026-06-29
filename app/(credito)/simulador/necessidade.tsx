import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Modal, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../../src/store';
import { setNecessidade, setUf, nextStep } from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import NecessidadeOptionCard from '../../../src/components/molecules/NecessidadeOptionCard';

const OPTIONS = [
  {
    id: 'plantar',
    icon: 'eco',
    title: 'Quero plantar',
    description: 'Financie insumos, sementes, mão de obra e serviços para sua próxima safra',
  },
  {
    id: 'maquinario',
    icon: 'precision-manufacturing',
    title: 'Comprar maquinário',
    description: 'Financie tratores, implementos, equipamentos e veículos para sua produção',
  },
  {
    id: 'construir',
    icon: 'build',
    title: 'Construir ou reformar',
    description: 'Construa armazéns, silos, galpões, cercas e outras benfeitorias',
  },
  {
    id: 'capital',
    icon: 'account-balance-wallet',
    title: 'Capital de giro',
    description: 'Mantenha sua operação funcionando com capital para o dia a dia',
  },
  {
    id: 'reflorestar',
    icon: 'park',
    title: 'Reflorestar ou manejar',
    description: 'Investir em sistemas agroflorestais, reflorestamento e manejo sustentável',
  },
  {
    id: 'industrializar',
    icon: 'factory',
    title: 'Industrializar produção',
    description: 'Monte ou amplie sua agroindústria, frigorífico ou planta de beneficiamento',
  },
  {
    id: 'empreender',
    icon: 'storefront',
    title: 'Empreender',
    description: 'Invista no seu pequeno negócio com microcrédito orientado',
  },
  {
    id: 'modernizar',
    icon: 'trending-up',
    title: 'Modernizar produção',
    description: 'Invista em tecnologia, irrigação, automação e eficiência produtiva',
  },
];

const UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

export default function NecessidadeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { necessidade, uf, step } = useSelector((state: RootState) => state.simulador);

  const [isUfModalVisible, setIsUfModalVisible] = useState(false);

  const handleSelect = (id: string) => {
    dispatch(setNecessidade(id));
  };

  const handleSelectUf = (estado: string) => {
    dispatch(setUf(estado === uf ? null : estado));
    setIsUfModalVisible(false);
  };

  const handleContinue = () => {
    if (necessidade && uf) {
      dispatch(nextStep());
      router.push('/(credito)/simulador/produtos');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
          O que você{'\n'}precisa?
        </Text>
        <Text className="text-[16px] text-gray-500 mb-6">
          Para encontrarmos os melhores produtos, precisamos de algumas informações básicas.
        </Text>

        {/* UF Selection - Fake Dropdown */}
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="map" size={20} color="#0A3D24" />
            <Text className="text-[14px] text-gray-700 ml-2">Qual seu Estado (UF)?</Text>
          </View>
          
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsUfModalVisible(true)}
            className="flex-row items-center justify-between bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
          >
            <Text className={`text-[15px] ${uf ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
              {uf ? `Estado selecionado: ${uf}` : 'Selecione um Estado'}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <Text className="text-[18px] font-bold text-gray-900 mb-4">Qual o seu objetivo?</Text>
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
          disabled={!necessidade || !uf}
          onPress={handleContinue}
          className={`py-4 rounded-full items-center ${
            necessidade && uf ? 'bg-[#0A3D24]' : 'bg-gray-400'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Dropdown para UF */}
      <Modal
        visible={isUfModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsUfModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50 pt-12">
          <View className="bg-white rounded-t-3xl shadow-lg" style={{ maxHeight: '85%' }}>
            <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
              <Text className="text-[18px] font-bold text-gray-900">Selecione o Estado</Text>
              <TouchableOpacity onPress={() => setIsUfModalVisible(false)} className="p-2 -mr-2 bg-gray-100 rounded-full">
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={UFS}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 mx-4 my-1 rounded-xl border flex-row justify-between items-center ${
                    uf === item ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
                  }`}
                  onPress={() => handleSelectUf(item)}
                >
                  <Text className={`text-[16px] ${uf === item ? 'text-green-700 font-bold' : 'text-gray-700'}`}>
                    {item}
                  </Text>
                  {uf === item && <MaterialIcons name="check-circle" size={20} color="#16A34A" />}
                </TouchableOpacity>
              )}
              ListFooterComponent={<View className="h-8" />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
