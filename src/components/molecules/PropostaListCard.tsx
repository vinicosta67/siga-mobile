import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PropostaModel } from '@/src/utils/propostaMockData';

interface PropostaListCardProps {
  proposta: PropostaModel;
  onPress: () => void;
}

export default function PropostaListCard({ proposta, onPress }: PropostaListCardProps) {
  return (
    <View className="bg-white rounded-[16px] border border-gray-200 p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className="bg-brand-green/10 p-2.5 rounded-xl mr-3">
            <MaterialIcons name="agriculture" size={20} color="#0A3D24" />
          </View>
          <View>
            <Text className="text-gray-800 font-bold text-[16px] mb-0.5">{proposta.produto}</Text>
            <Text className="text-gray-400 font-medium text-[12px]">#{proposta.numeroProposta}</Text>
          </View>
        </View>
        <View className="bg-blue-50 px-2.5 py-1 rounded-full">
          <Text className="text-blue-600 font-bold text-[10px]">{proposta.statusLabel}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-gray-500 font-bold text-[12px]">Progresso da proposta</Text>
        <Text className="text-brand-dark font-bold text-[14px]">{proposta.percentualConclusao}%</Text>
      </View>

      <View className="w-full bg-gray-100 rounded-full h-2 mb-5 overflow-hidden">
        <View 
          className="bg-brand-green h-full rounded-full" 
          style={{ width: `${proposta.percentualConclusao}%` }} 
        />
      </View>

      <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between border-t border-gray-100 pt-3" activeOpacity={0.7}>
        <Text className="text-brand-dark font-bold text-[14px]">
          Ver detalhes
        </Text>
        <MaterialIcons name="chevron-right" size={18} color="#0A3D24" />
      </TouchableOpacity>
    </View>
  );
}
