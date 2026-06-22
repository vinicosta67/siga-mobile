import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProdutoCredito } from '../../utils/creditoMockData';

interface ProdutoCreditoCardProps {
  produto: ProdutoCredito;
  onTap: () => void;
}

export default function ProdutoCreditoCard({ produto, onTap }: ProdutoCreditoCardProps) {
  // Map logic to retrieve an icon and color based on the product
  // In a real scenario, this could be on the API, but we map it locally for now.
  const getStyleMap = (id: string) => {
    if (id.includes('car')) return { icon: 'agriculture', color: '#18A354', bg: 'bg-green-100' };
    if (id.includes('inv')) return { icon: 'precision-manufacturing', color: '#D97706', bg: 'bg-orange-100' };
    if (id.includes('flo')) return { icon: 'eco', color: '#059669', bg: 'bg-emerald-100' };
    return { icon: 'business-center', color: '#2563EB', bg: 'bg-blue-100' };
  };

  const styleMap = getStyleMap(produto.id);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}mil`;
    return val.toString();
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onTap}
      className="w-[160px] p-4 bg-white rounded-2xl border border-gray-200 mr-3 shadow-sm"
    >
      <View className={`w-full py-1.5 rounded-full items-center justify-center mb-4 ${styleMap.bg}`}>
        <MaterialIcons name={styleMap.icon as any} size={20} color={styleMap.color} />
      </View>
      <Text 
        className="text-[12px] font-bold tracking-wider mb-1" 
        style={{ color: styleMap.color }}
      >
        {produto.sigla}
      </Text>
      <Text className="text-[13px] text-gray-600 mb-4 leading-tight flex-1" numberOfLines={2}>
        {produto.nome}
      </Text>
      
      <View className="mt-auto">
        <Text className="text-[12px] font-bold text-gray-800 mb-0.5">
          CET {produto.cetEstimado.toFixed(1)}% a.a.
        </Text>
        <Text className="text-[12px] text-gray-400">
          Até R$ {formatCurrency(produto.valorMaximo)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
