import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../../src/store';
import { 
  setPrazoMeses, 
  setCarenciaMeses, 
  setSistemaAmortizacao,
  setPossuiImovel,
  prevStep, 
  nextStep 
} from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import BASASlider from '../../../src/components/atoms/BASASlider';
import { CreditoMockData } from '../../../src/utils/creditoMockData';

export default function CondicoesScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { 
    step, 
    produtoSelecionadoId, 
    prazoMeses, 
    carenciaMeses, 
    sistemaAmortizacao, 
    possuiImovel 
  } = useSelector((state: RootState) => state.simulador);

  const produto = CreditoMockData.produtos.find(p => p.id === produtoSelecionadoId) || CreditoMockData.produtos[0];

  const handlePrazoChange = (val: number) => dispatch(setPrazoMeses(val));
  const handleCarenciaChange = (val: number) => dispatch(setCarenciaMeses(val));
  const handleSistemaChange = (sis: string) => dispatch(setSistemaAmortizacao(sis));
  const handleImovelChange = (val: boolean) => dispatch(setPossuiImovel(val));

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const handleContinue = () => {
    dispatch(nextStep());
    router.push('/(credito)/simulador/garantia');
  };

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-6 leading-tight">
          Precisamos de{'\n'}algumas informações{'\n'}para continuar
        </Text>

        {/* Prazo */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[16px] text-gray-700">Em quantos meses quer pagar?</Text>
            <View className="bg-[#0A3D24] px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-[12px]">{prazoMeses}m ({(prazoMeses/12).toFixed(1)} anos)</Text>
            </View>
          </View>
          <BASASlider
            min={6}
            max={produto.prazoMaxMeses}
            value={prazoMeses}
            onValueChange={handlePrazoChange}
          />
          <View className="flex-row justify-between">
            <Text className="text-[11px] text-gray-400">6m</Text>
            <Text className="text-[11px] text-gray-400">{produto.prazoMaxMeses}m</Text>
          </View>
        </View>

        {/* Carência */}
        <View className="mb-6 border-t border-gray-100 pt-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[16px] text-gray-700">Carência (meses sem pagar)</Text>
            <View className="bg-[#0A3D24] px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-[12px]">{carenciaMeses} meses</Text>
            </View>
          </View>
          <BASASlider
            min={0}
            max={produto.prazoMaxMeses / 2 > 60 ? 60 : Math.floor(produto.prazoMaxMeses / 2)}
            value={carenciaMeses}
            onValueChange={handleCarenciaChange}
          />
          <View className="flex-row justify-between">
            <Text className="text-[11px] text-gray-400">0m</Text>
            <Text className="text-[11px] text-gray-400">{Math.floor(produto.prazoMaxMeses / 2)}m</Text>
          </View>
        </View>

        {/* Sistema de Amortização */}
        <View className="mb-6 border-t border-gray-100 pt-6">
          <Text className="text-[16px] text-gray-700 mb-4">Como quer pagar?</Text>
          
          <TouchableOpacity
            onPress={() => handleSistemaChange('PRICE')}
            activeOpacity={0.8}
            className={`p-4 rounded-xl border mb-3 flex-row items-center ${
              sistemaAmortizacao === 'PRICE' ? 'border-[#0A3D24] bg-[#E8F3EB]' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <MaterialIcons 
              name="straighten" 
              size={20} 
              color={sistemaAmortizacao === 'PRICE' ? '#0A3D24' : '#9CA3AF'} 
            />
            <View className="flex-1 ml-3">
              <Text className={`font-bold text-[14px] ${sistemaAmortizacao === 'PRICE' ? 'text-[#0A3D24]' : 'text-gray-700'}`}>
                PRICE (Parcelas fixas)
              </Text>
              <Text className="text-[12px] text-gray-500 mt-0.5">Todas as parcelas com o mesmo valor</Text>
            </View>
            {sistemaAmortizacao === 'PRICE' && (
              <MaterialIcons name="check-circle" size={20} color="#0A3D24" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSistemaChange('SAC')}
            activeOpacity={0.8}
            className={`p-4 rounded-xl border mb-3 flex-row items-center ${
              sistemaAmortizacao === 'SAC' ? 'border-[#0A3D24] bg-[#E8F3EB]' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <MaterialIcons 
              name="trending-down" 
              size={20} 
              color={sistemaAmortizacao === 'SAC' ? '#0A3D24' : '#9CA3AF'} 
            />
            <View className="flex-1 ml-3">
              <Text className={`font-bold text-[14px] ${sistemaAmortizacao === 'SAC' ? 'text-[#0A3D24]' : 'text-gray-700'}`}>
                SAC (Parcelas decrescentes)
              </Text>
              <Text className="text-[12px] text-gray-500 mt-0.5">Começa mais alto e vai diminuindo</Text>
            </View>
            {sistemaAmortizacao === 'SAC' && (
              <MaterialIcons name="check-circle" size={20} color="#0A3D24" />
            )}
          </TouchableOpacity>
        </View>

        {/* Possui imóvel switch */}
        <View className="mb-6 border-t border-gray-100 pt-6 flex-row justify-between items-center">
          <Text className="text-[16px] text-gray-700">Possui imóvel em seu nome?</Text>
          <Switch
            trackColor={{ false: '#E5E7EB', true: '#0A3D24' }}
            thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : (possuiImovel ? '#FFFFFF' : '#F3F4F6')}
            onValueChange={handleImovelChange}
            value={possuiImovel}
          />
        </View>

        {/* Info Card */}
        <View className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-row mt-2">
          <MaterialIcons name="info-outline" size={18} color="#2563EB" />
          <Text className="text-blue-700 text-[12px] ml-2 flex-1 leading-relaxed">
            Taxa base: {produto.tefAnual.toFixed(2)}% a.a. + Spread: {produto.spreadAnual.toFixed(2)}% a.a.{'\n'}
            CET estimado: {produto.cetEstimado.toFixed(2)}% a.a.
          </Text>
        </View>

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
