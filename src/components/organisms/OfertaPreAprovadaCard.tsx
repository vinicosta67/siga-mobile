import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { OfertaPreAprovada, ProdutoCredito } from '@/src/utils/creditoMockData';

interface OfertaPreAprovadaCardProps {
  oferta: OfertaPreAprovada;
  produto: ProdutoCredito;
  onSimular: () => void;
  onDetalhes: () => void;
}

export default function OfertaPreAprovadaCard({
  oferta,
  produto,
  onSimular,
  onDetalhes
}: OfertaPreAprovadaCardProps) {
  const diasRestantes = Math.max(
    0,
    Math.ceil((new Date(oferta.validadeOferta).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  const formatValue = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getIconName = (id: string): keyof typeof MaterialIcons.glyphMap => {
    if (id === 'fno-car') return 'agriculture';
    if (id === 'fno-inv') return 'precision-manufacturing';
    if (id === 'fno-flo') return 'forest';
    return 'business-center';
  };

  return (
    <View className="bg-white rounded-[20px] border border-gray-300 overflow-hidden mb-4 mx-4">
      <TouchableOpacity activeOpacity={0.7} onPress={onDetalhes}>
        {/* Header */}
        <View className="bg-white p-4 pb-3 flex-row items-center border-b border-gray-100">
          <View className="w-[42px] h-[42px] rounded-full bg-brand-green/10 items-center justify-center mr-3">
            <MaterialIcons name={getIconName(produto.id)} size={22} color="#0A3D24" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-bold text-[16px]">
              {oferta.nomeProduto}
            </Text>
            <Text className="text-brand-dark font-bold text-[10px] tracking-widest mt-0.5 uppercase">
              {produto.fonte}
            </Text>
          </View>
          <View className="bg-brand-green/10 px-3.5 py-1.5 rounded-full ml-2 min-h-[28px] justify-center">
            <Text className="text-brand-green font-bold text-[12px]">
              Disponível
            </Text>
          </View>
        </View>

        {/* Metrics */}
        <View className="p-4 pb-2">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-400 font-bold text-[12px]">Valor disponível</Text>
              <Text className="text-brand-dark font-black text-[26px] mt-0.5 tracking-tight">
                R$ {formatValue(oferta.valorPreAprovado)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-400 font-bold text-[12px]">Taxa especial</Text>
              <Text className="text-brand-green font-black text-[18px] mt-0.5">
                {oferta.taxaEspecial}% a.a.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center space-x-2">
              <View className="bg-white border border-gray-300 px-1.5 py-0.5 rounded-[4px] flex-row items-center">
                <MaterialIcons name="calendar-today" size={12} color="#9CA3AF" />
                <Text className="text-gray-500 font-bold text-[11px] ml-1.5">{oferta.prazoSugerido}m prazo</Text>
              </View>
              <View className="bg-white border border-gray-300 px-1.5 py-0.5 rounded-[4px] flex-row items-center">
                <MaterialIcons name="hourglass-empty" size={12} color="#9CA3AF" />
                <Text className="text-gray-500 font-bold text-[11px] ml-1.5">{oferta.carenciaSugerida}m carência</Text>
              </View>
            </View>
            <Text className="text-[12px] font-bold text-gray-400">
              {diasRestantes} dias restantes
            </Text>
          </View>

          <Text className="text-gray-500 text-[12px] italic font-bold">
            {oferta.motivoOferta}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action Row */}
      <View className="px-4 pb-4 pt-1">
        <TouchableOpacity
          onPress={onSimular}
          className="bg-brand-dark rounded-xl py-4 min-h-[48px] flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px] mr-2">
            Simular oferta
          </Text>
          <MaterialIcons name="chevron-right" size={18} color="#E6FF55" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
