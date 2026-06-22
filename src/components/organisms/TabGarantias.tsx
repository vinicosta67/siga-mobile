import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PropostaModel } from '../../utils/propostaMockData';

interface TabGarantiasProps {
  proposta: PropostaModel;
}

export default function TabGarantias({ proposta }: TabGarantiasProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2).replace('.', ',')} mi`;
    return `R$ ${(value / 1000).toFixed(0)} mil`;
  };

  const totalGarantias = proposta.garantias.reduce((acc, g) => acc + g.valor, 0);

  return (
    <View className="px-4 py-2 bg-gray-50 flex-1">
      {/* KPIs Responsivos */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <KpiGarantia label="Financiado" valor={formatValue(proposta.valorSolicitado)} color="#0A3D24" bg="bg-brand-green/10" />
        <KpiGarantia label="Garantias" valor={formatValue(totalGarantias)} color="#18A354" bg="bg-green-100" />
        <KpiGarantia label="LTV Atual" valor="207%" color="#18A354" bg="bg-green-100" />
        <KpiGarantia label="Mínimo" valor="120%" color="#D97706" bg="bg-orange-100" />
      </View>

      <Text className="font-bold text-[16px] text-gray-800 mb-4">Garantias Vinculadas</Text>

      {/* Lista de Garantias */}
      {proposta.garantias.map((gar) => (
        <View key={gar.id} className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm flex-row items-center">
          <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center mr-3">
            <MaterialIcons name="security" size={20} color="#18A354" />
          </View>
          
          <View className="flex-1 mr-2">
            <Text className="font-bold text-gray-800 text-[14px] leading-tight">{gar.descricao}</Text>
            <Text className="text-brand-dark font-black text-[15px] my-0.5">{formatValue(gar.valor)}</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-400 text-[11px] font-medium mr-2">{gar.tipo}</Text>
              <View className="w-1 h-1 bg-gray-300 rounded-full mr-2" />
              <Text className="text-green-600 font-bold text-[11px]">Cob: {gar.cobertura}</Text>
            </View>
          </View>

          <TouchableOpacity className="p-2" activeOpacity={0.7}>
            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Parecer Técnico */}
      <View className="bg-white rounded-xl p-4 mt-2 border border-green-200 shadow-sm">
        <View className="flex-row items-center mb-2">
          <MaterialIcons name="check-circle" size={18} color="#18A354" />
          <Text className="font-bold text-gray-800 text-[15px] ml-2">Parecer Técnico</Text>
        </View>
        <Text className="text-gray-600 text-[13px] leading-relaxed">
          Garantias suficientes e regulares. LTV de 207% acima do mínimo exigido de 120%. CPR física lastreada na produção esperada da safra. Recomendo aprovação das garantias.
        </Text>
      </View>
    </View>
  );
}

function KpiGarantia({ label, valor, color, bg }: { label: string, valor: string, color: string, bg: string }) {
  return (
    <View className={`w-[48%] p-3 rounded-xl mb-3 ${bg}`}>
      <Text className="font-bold text-[12px]" style={{ color }}>{label}</Text>
      <Text className="font-black text-[16px] mt-1" style={{ color }} numberOfLines={1}>{valor}</Text>
    </View>
  );
}
