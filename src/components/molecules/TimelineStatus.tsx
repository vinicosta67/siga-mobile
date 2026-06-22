import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { EtapaJornada } from '@/src/utils/propostaMockData';

interface TimelineStatusProps {
  etapas: EtapaJornada[];
}

export default function TimelineStatus({ etapas }: TimelineStatusProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <View className="px-4 py-2 bg-gray-50 flex-1">
      {etapas.map((etapa, index) => {
        const isCompleted = etapa.status === 'CONCLUIDO';
        const isCurrent = etapa.status === 'EM_ANDAMENTO';
        const isPending = etapa.status === 'PENDENTE';
        const isLast = index === etapas.length - 1;

        return (
          <View key={etapa.id} className="flex-row">
            {/* Linha e ícone */}
            <View className="items-center mr-4">
              <View 
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  isCompleted ? 'bg-brand-green' : 
                  isCurrent ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                {isCompleted && <MaterialIcons name="check" size={14} color="white" />}
                {isCurrent && <MaterialIcons name="more-horiz" size={14} color="white" />}
              </View>
              {!isLast && (
                <View 
                  className={`w-0.5 flex-1 ${
                    isCompleted ? 'bg-brand-green' : 'bg-gray-300'
                  }`} 
                  style={{ minHeight: 40 }}
                />
              )}
            </View>

            {/* Conteúdo */}
            <View className="flex-1 pb-6 pt-0.5">
              <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                  <Text className={`font-bold text-[14px] ${isPending ? 'text-gray-500' : 'text-gray-800'}`}>
                    {etapa.titulo}
                  </Text>
                  <Text className={`text-[12px] mt-1 font-medium ${isPending ? 'text-gray-400' : 'text-gray-500'}`}>
                    {etapa.descricao}
                  </Text>
                </View>
                <Text className="text-gray-400 font-medium text-[12px]">
                  {formatDate(etapa.dataConclusao)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
