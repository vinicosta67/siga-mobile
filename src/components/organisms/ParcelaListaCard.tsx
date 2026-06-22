import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ParcelaContrato } from '../../utils/creditoMockData';

interface ParcelaListaCardProps {
  parcela: ParcelaContrato;
}

export default function ParcelaListaCard({ parcela }: ParcelaListaCardProps) {
  const getStatusStyle = () => {
    switch (parcela.status) {
      case 'paga': 
        return { icon: 'check-circle', color: '#22C55E' };
      case 'vencida': 
        return { icon: 'error', color: '#DC2626' };
      case 'aberta': 
        return { icon: 'schedule', color: '#F59E0B' };
      case 'agendada':
      default: 
        return { icon: 'radio-button-unchecked', color: '#D1D5DB' };
    }
  };

  const style = getStatusStyle();
  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const formatData = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  return (
    <View className="bg-white rounded-xl p-5 mb-3 border border-gray-200 flex-row items-center shadow-sm">
      <MaterialIcons name={style.icon as any} size={28} color={style.color} />
      
      <View className="flex-1 ml-4">
        <Text className="text-[16px] font-bold text-gray-800">Parcela {parcela.numero}</Text>
        <Text className="text-[13px] text-gray-400 mt-1">Venc: {formatData(parcela.vencimento)}</Text>
        {parcela.dataPagamento && (
          <Text className="text-[13px] font-bold text-[#22C55E] mt-0.5">Paga em: {formatData(parcela.dataPagamento)}</Text>
        )}
      </View>
      
      <View className="items-end">
        <Text className="text-[16px] font-bold text-gray-800">R$ {formatCurrency(parcela.valor)}</Text>
      </View>
    </View>
  );
}
