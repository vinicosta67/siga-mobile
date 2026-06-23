import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../../src/store';
import { prevStep, resetSimulador } from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import { CreditoMockData } from '../../../src/utils/creditoMockData';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function ResumoScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state: RootState) => state.simulador);

  const produto = CreditoMockData.produtos.find(p => p.id === state.produtoSelecionadoId) || CreditoMockData.produtos[0];

  const simulacao = useMemo(() => {
    const taxaMensal = (produto.tefAnual + produto.spreadAnual) / 12 / 100;
    const valorBase = state.valorDesejado > 0 ? state.valorDesejado : produto.valorMinimo;
    const tac = valorBase * (produto.tacPercent / 100);
    const iof = valorBase * (produto.iofAnual / 100);
    const valorContratar = valorBase + tac + iof;
    
    let valorParcela = 0;
    let totalAPagar = 0;
    
    if (state.sistemaAmortizacao === 'SAC') {
      const amort = valorContratar / state.prazoMeses;
      valorParcela = amort + (valorContratar * taxaMensal);
      totalAPagar = 0;
      let saldo = valorContratar;
      for (let i = 0; i < state.prazoMeses; i++) {
        totalAPagar += amort + (saldo * taxaMensal);
        saldo -= amort;
      }
    } else { // PRICE
      if (taxaMensal > 0) {
        const factor = (taxaMensal * Math.pow(1 + taxaMensal, state.prazoMeses)) / 
                       (Math.pow(1 + taxaMensal, state.prazoMeses) - 1);
        valorParcela = valorContratar * factor;
      } else {
        valorParcela = valorContratar / state.prazoMeses;
      }
      totalAPagar = valorParcela * state.prazoMeses;
    }
    
    const totalJuros = totalAPagar - valorContratar;

    return {
      valorBase,
      tac,
      iof,
      valorContratar,
      valorParcela,
      totalAPagar,
      totalJuros,
      taxaEfetivaMensal: taxaMensal * 100
    };
  }, [state, produto]);

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const handleFinish = () => {
    // Aqui seria feita a chamada real para a API para formalizar a proposta.
    alert('Proposta Iniciada com Sucesso!\nUm consultor entrará em contato.');
    dispatch(resetSimulador());
    router.replace('/(tabs)/credito');
  };

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={state.step} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-6 leading-tight">
          Resultado da{'\n'}simulação
        </Text>

        {/* Dark Card */}
        <View className="bg-[#0A3D24] p-6 rounded-2xl mb-6 shadow-md items-center">
          <Text className="text-white/70 text-[13px] font-bold uppercase tracking-wider mb-2">
            Parcela estimada
          </Text>
          <Text className="text-[#39FF14] text-[40px] font-extrabold mb-1 tracking-tighter">
            {formatCurrency(simulacao.valorParcela).replace('R$', '').trim()}
          </Text>
          <Text className="text-white/70 text-[13px] font-bold">
            /mês {state.sistemaAmortizacao === 'SAC' ? '(1ª parcela)' : ''}
          </Text>

          <View className="flex-row justify-between w-full mt-6 pt-6 border-t border-white/20">
            <View className="items-center flex-1">
              <Text className="text-white/60 text-[12px] mb-1">Valor</Text>
              <Text className="text-white text-[15px] font-bold">
                {simulacao.valorBase >= 1000 ? `${simulacao.valorBase / 1000}k` : simulacao.valorBase}
              </Text>
            </View>
            <View className="w-px h-10 bg-white/20 mx-2" />
            <View className="items-center flex-1">
              <Text className="text-white/60 text-[12px] mb-1">Prazo</Text>
              <Text className="text-white text-[15px] font-bold">{state.prazoMeses}m</Text>
            </View>
            <View className="w-px h-10 bg-white/20 mx-2" />
            <View className="items-center flex-1">
              <Text className="text-white/60 text-[12px] mb-1">CET</Text>
              <Text className="text-white text-[15px] font-bold">{produto.cetEstimado.toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        {/* Detalhes Financeiros */}
        <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
          <Text className="text-gray-900 font-bold text-[16px] mb-4">Detalhes financeiros</Text>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-[14px]">Produto</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{produto.nome}</Text>
          </View>
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-[14px]">Valor solicitado</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.valorBase)}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-[14px]">IOF</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.iof)}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-[14px]">TAC</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.tac)}</Text>
          </View>

          <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
            <Text className="text-gray-500 text-[14px]">Valor a contratar</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.valorContratar)}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-[14px]">Total de juros</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.totalJuros)}</Text>
          </View>

          <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
            <Text className="text-gray-800 text-[15px] font-bold">Total a pagar</Text>
            <Text className="text-[#0A3D24] text-[15px] font-bold">{formatCurrency(simulacao.totalAPagar)}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-[14px]">Carência</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{state.carenciaMeses} meses</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-[14px]">Sistema</Text>
            <Text className="text-gray-900 text-[14px] font-bold">{state.sistemaAmortizacao}</Text>
          </View>
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
          onPress={handleFinish}
          className="flex-1 py-4 rounded-full items-center bg-[#0A3D24]"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Iniciar Proposta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
