import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AlertaAtrasoCardProps {
  quantidadeAtraso: number;
  onPagar: () => void;
}

export default function AlertaAtrasoCard({ quantidadeAtraso, onPagar }: AlertaAtrasoCardProps) {
  if (quantidadeAtraso <= 0) return null;

  return (
    <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex-row items-center">
      <MaterialIcons name="warning-amber" size={28} color="#DC2626" />
      <View className="flex-1 px-3">
        <Text className="text-red-700 font-bold text-[14px]">{quantidadeAtraso} parcela(s) em atraso</Text>
        <Text className="text-red-600 text-[12px] mt-0.5 leading-tight">Regularize para evitar encargos adicionais</Text>
      </View>
      <TouchableOpacity 
        className="bg-red-600 px-4 py-2 rounded-full"
        onPress={onPagar}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-[12px]">Pagar</Text>
      </TouchableOpacity>
    </View>
  );
}
