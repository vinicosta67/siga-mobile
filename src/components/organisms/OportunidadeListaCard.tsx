import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { OportunidadeCredito } from '../../utils/creditoMockData';

interface OportunidadeListaCardProps {
  oportunidade: OportunidadeCredito;
  onTap: () => void;
}

export default function OportunidadeListaCard({ oportunidade, onTap }: OportunidadeListaCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onTap}
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm"
    >
      {oportunidade.taxaDesde !== undefined && (
        <Text className="text-green-600 font-bold text-[12px] mb-2">
          A partir de {oportunidade.taxaDesde.toFixed(1).replace('.', ',')}% a.a.
        </Text>
      )}
      <Text className="text-gray-800 font-bold text-[15px] mb-1 leading-tight">
        {oportunidade.titulo}
      </Text>
      <Text className="text-gray-500 text-[14px] leading-relaxed mb-3">
        {oportunidade.descricao}
      </Text>
      
      {oportunidade.ctaTexto && (
        <View className="flex-row items-center mt-1">
          <Text className="text-brand-dark font-bold text-[13px] mr-1">
            {oportunidade.ctaTexto}
          </Text>
          <MaterialIcons name="chevron-right" size={18} color="#0A3D24" />
        </View>
      )}
    </TouchableOpacity>
  );
}
