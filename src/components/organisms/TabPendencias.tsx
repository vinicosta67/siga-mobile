import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PropostaModel } from '../../utils/propostaMockData';

interface TabPendenciasProps {
  proposta: PropostaModel;
}

export default function TabPendencias({ proposta }: TabPendenciasProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} às ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (proposta.pendencias.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8 bg-gray-50">
        <MaterialIcons name="check-circle" size={48} color="#18A354" />
        <Text className="text-gray-800 font-bold text-[18px] mt-4 text-center">Tudo certo por aqui!</Text>
        <Text className="text-gray-500 text-[14px] mt-2 text-center">Nenhuma pendência encontrada para esta proposta.</Text>
      </View>
    );
  }

  return (
    <View className="px-4 py-2 bg-gray-50 flex-1">
      <Text className="font-bold text-[16px] text-gray-800 mb-4">Ações Necessárias</Text>

      {/* Lista de Pendências */}
      {proposta.pendencias.map((pendencia) => (
        <View key={pendencia.id} className="bg-white rounded-xl p-4 mb-3 border border-red-200 shadow-sm flex-row items-start">
          <View className="mt-0.5">
            <MaterialIcons 
              name={pendencia.tipo === 'Critica' ? 'error' : 'warning'} 
              size={22} 
              color={pendencia.tipo === 'Critica' ? '#DC2626' : '#D97706'} 
            />
          </View>
          
          <View className="flex-1 ml-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className={`font-bold text-[11px] uppercase tracking-wider ${pendencia.tipo === 'Critica' ? 'text-red-600' : 'text-orange-600'}`}>
                {pendencia.tipo === 'Critica' ? 'Urgente' : 'Atenção'}
              </Text>
              <Text className="text-gray-400 text-[10px]">{formatDate(pendencia.dataCriacao)}</Text>
            </View>
            <Text className="text-gray-800 font-bold text-[14px] leading-tight mb-3">
              {pendencia.descricao}
            </Text>

            <TouchableOpacity className="bg-brand-dark rounded-lg py-2.5 flex-row items-center justify-center" activeOpacity={0.8}>
              <Text className="text-white font-bold text-[13px]">Resolver Pendência</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
