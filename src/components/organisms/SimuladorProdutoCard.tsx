import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { VitrineProduto } from '../../hooks/queries/useSimulador';

interface SimuladorProdutoCardProps {
  produto: VitrineProduto;
  isSelected: boolean;
  onSelect: () => void;
}

export default function SimuladorProdutoCard({
  produto,
  isSelected,
  onSelect,
}: SimuladorProdutoCardProps) {
  // Map logic for icon
  const getStyleMap = (id: string) => {
    const idLower = id.toLowerCase();
    if (idLower.includes('car')) return { icon: 'agriculture' };
    if (idLower.includes('inv')) return { icon: 'precision-manufacturing' };
    if (idLower.includes('flo')) return { icon: 'eco' };
    return { icon: 'business-center' };
  };

  const styleMap = getStyleMap(produto.id);

  const publicoAlvo = (produto.publico_alvo || '').toUpperCase();
  const exclusivelyPF = publicoAlvo.includes('FÍSICA') && !publicoAlvo.includes('JURÍDICA');
  const exclusivelyPJ = publicoAlvo.includes('JURÍDICA') && !publicoAlvo.includes('FÍSICA');

  const allowPF = !exclusivelyPJ;
  const allowPJ = !exclusivelyPF;

  let badgeText = 'PF / PJ';
  if (allowPF && !allowPJ) badgeText = 'Apenas PF';
  if (!allowPF && allowPJ) badgeText = 'Apenas PJ';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onSelect}
      className={`bg-white rounded-2xl border mb-4 shadow-sm relative overflow-hidden ${
        isSelected ? 'border-[#0A3D24]' : 'border-gray-200'
      }`}
    >
      <View className="absolute top-0 right-0 bg-gray-100 px-3 py-1 rounded-bl-xl border-b border-l border-gray-200">
        <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{badgeText}</Text>
      </View>

      <View className="p-4 pt-6 flex-row items-center">
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
            {produto.cet_estimado_aa?.toFixed(2)}% a.a.
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-[13px] text-gray-500 mb-0.5">Prazo máximo</Text>
          <Text className="text-[16px] font-bold text-gray-800">
            {produto.prazo_max_meses} meses
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-[13px] text-gray-500 mb-0.5">Valor mínimo</Text>
          <Text className="text-[16px] font-bold text-gray-800">
            R$ {produto.limite_min >= 1000 ? `${produto.limite_min / 1000}k` : produto.limite_min}
          </Text>
        </View>

        <View className="mb-3">
          <Text className="text-[13px] text-gray-500 mb-0.5">Valor máximo</Text>
          <Text className="text-[16px] font-bold text-gray-800">
            R$ {produto.limite_max >= 1000000 ? `${produto.limite_max / 1000000}M` : `${produto.limite_max / 1000}k`}
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
