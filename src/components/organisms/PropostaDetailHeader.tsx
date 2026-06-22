import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PropostaModel } from '@/src/utils/propostaMockData';

interface PropostaDetailHeaderProps {
  proposta: PropostaModel;
}

export default function PropostaDetailHeader({ proposta }: PropostaDetailHeaderProps) {
  const formatValue = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <View className="bg-white m-4 rounded-[16px] border border-gray-100 p-4 shadow-sm">
      <View className="flex-row items-start justify-between mb-5 border-b border-gray-100 pb-4">
        <View className="flex-row items-center flex-1 pr-2">
          <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-3">
            <MaterialIcons name="agriculture" size={24} color="#0A3D24" />
          </View>
          <View className="flex-1">
            <Text className="text-brand-dark font-bold text-[16px] leading-tight">
              {proposta.produto}
            </Text>
            <Text className="text-gray-400 font-medium text-[12px] mt-0.5">
              Protocolo: {proposta.numeroProposta}
            </Text>
          </View>
        </View>
        <View className="bg-blue-50 px-3 py-1.5 rounded-full">
          <Text className="text-blue-600 font-bold text-[11px]">
            {proposta.statusLabel}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between w-full">
        <View className="items-center flex-1 border-r border-gray-100 overflow-hidden px-1">
          <Text className="text-gray-400 font-bold text-[10px] mb-1" numberOfLines={1}>Valor</Text>
          <Text className="text-brand-dark font-bold text-[11px]" numberOfLines={1}>R$ {formatValue(proposta.valorSolicitado)}</Text>
        </View>
        <View className="items-center flex-1 border-r border-gray-100 overflow-hidden px-1">
          <Text className="text-gray-400 font-bold text-[10px] mb-1" numberOfLines={1}>Produto</Text>
          <Text className="text-brand-dark font-bold text-[11px]" numberOfLines={1}>{proposta.siglaProduto}</Text>
        </View>
        <View className="items-center flex-1 border-r border-gray-100 overflow-hidden px-1">
          <Text className="text-gray-400 font-bold text-[10px] mb-1" numberOfLines={1}>Gerente</Text>
          <Text className="text-brand-dark font-bold text-[11px]" numberOfLines={1}>{proposta.gerente}</Text>
        </View>
        <View className="items-center flex-1 overflow-hidden px-1">
          <Text className="text-gray-400 font-bold text-[10px] mb-1" numberOfLines={1}>Progresso</Text>
          <Text className="text-brand-dark font-bold text-[11px]" numberOfLines={1}>{proposta.percentualConclusao}%</Text>
        </View>
      </View>
    </View>
  );
}
