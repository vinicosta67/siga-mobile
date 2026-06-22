import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { EtapaJornada } from '@/src/utils/propostaMockData';

interface HorizontalStepperProps {
  etapas: EtapaJornada[];
}

export default function HorizontalStepper({ etapas }: HorizontalStepperProps) {
  return (
    <View className="bg-white py-4 border-b border-gray-100">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {etapas.map((etapa, index) => {
          const isCompleted = etapa.status === 'CONCLUIDO';
          const isCurrent = etapa.status === 'EM_ANDAMENTO';
          const isLast = index === etapas.length - 1;

          return (
            <View key={etapa.id} className="flex-row items-center">
              <View className="items-center w-[72px]">
                <View 
                  className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                    isCompleted ? 'bg-[#18A354]' : 
                    isCurrent ? 'bg-[#E5F1EB]' : 'bg-gray-100'
                  }`}
                >
                  {isCompleted && <MaterialIcons name="check" size={18} color="white" />}
                  {isCurrent && <Text className="text-[#18A354] font-bold text-[14px]">{index + 1}</Text>}
                  {!isCompleted && !isCurrent && <Text className="text-gray-400 font-bold text-[14px]">{index + 1}</Text>}
                </View>
                <Text 
                  className={`text-[10px] text-center font-bold ${
                    isCompleted || isCurrent ? 'text-[#18A354]' : 'text-gray-400'
                  }`}
                  numberOfLines={2}
                >
                  {etapa.titulo.replace(/^\d+\.\s*/, '')}
                </Text>
              </View>

              {!isLast && (
                <View 
                  className={`w-6 h-[2px] mx-1 mb-6 ${
                    isCompleted ? 'bg-[#18A354]' : 'bg-gray-200'
                  }`}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
