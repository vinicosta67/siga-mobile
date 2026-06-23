import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProdutoCredito } from '../../utils/creditoMockData';

interface SimuladorProdutoCardProps {
  produto: ProdutoCredito;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function SimuladorProdutoCard({
  produto,
  isSelected,
  onSelect,
}: SimuladorProdutoCardProps) {
  // Map logic for icon (same as the existing ProdutoCreditoCard)
  const getStyleMap = (id: string) => {
    if (id.includes('car')) return { icon: 'agriculture' };
    if (id.includes('inv')) return { icon: 'precision-manufacturing' };
    if (id.includes('flo')) return { icon: 'eco' };
    return { icon: 'business-center' };
  };

  const styleMap = getStyleMap(produto.id);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onSelect(produto.id)}
      className={`bg-white rounded-2xl border mb-4 shadow-sm ${
        isSelected ? 'border-[#0A3D24]' : 'border-gray-200'
      }`}
    >
      <View className="p-4 flex-row items-center">
        <View className="w-14 h-14 rounded-full bg-[#0A3D24] items-center justify-center mr-4">
          <MaterialIcons name={styleMap.icon as any} size={28} color="#FFFFFF" />
        </View>
        <Text className="flex-1 text-[18px] font-bold text-gray-800 leading-tight">
          {produto.nome}
        </Text>
      </View>
      
      <View className="border-t border-gray-100 p-4 pb-2">
        <View className="mb-3">
          <Text className="text-[13px] text-gray-500 mb-0.5">CET estimado</Text>
          <Text className="text-[16px] font-bold text-gray-800">
            {produto.cetEstimado.toFixed(2)}% a.a.
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-[13px] text-gray-500 mb-0.5">Prazo maximo</Text>
          <Text className="text-[16px] font-bold text-gray-800">
            {produto.prazoMaxMeses} meses
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-[13px] text-gray-500 mb-0.5">Valor minimo</Text>
          <Text className="text-[16px] font-bold text-gray-800">
            R$ {produto.valorMinimo >= 1000 ? `${produto.valorMinimo / 1000}k` : produto.valorMinimo}
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-[13px] text-gray-500 mb-0.5">Valor maximo</Text>
          <Text className="text-[16px] font-bold text-gray-800">
            R$ {produto.valorMaximo >= 1000000 ? `${produto.valorMaximo / 1000000}M` : `${produto.valorMaximo / 1000}k`}
          </Text>
        </View>
      </View>

      <View className="border-t border-gray-100 p-4 bg-gray-50 flex-row justify-between items-center rounded-b-2xl">
        <Text className="text-[#0A3D24] font-bold text-[14px]">Quero este produto</Text>
        <MaterialIcons name="chevron-right" size={20} color="#0A3D24" />
      </View>
    </TouchableOpacity>
  );
}
