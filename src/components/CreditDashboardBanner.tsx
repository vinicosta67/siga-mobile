import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CreditDashboardBannerProps {
  onSimulatePress: () => void;
  isVisible?: boolean;
}

export default function CreditDashboardBanner({ onSimulatePress, isVisible = true }: CreditDashboardBannerProps) {
  return (
    <View className="bg-brand-dark p-5 rounded-3xl w-full">
      <Text className="text-white/80 font-medium mb-4 text-sm">
        Crédito Especializado FNO | BNDES | Pronaf
      </Text>
      
      <Text className="text-white/70 mb-1 text-xs">Crédito disponível de até</Text>
      <Text className="text-brand-light font-bold text-3xl mb-6">
        {isVisible ? 'R$ 850.000,00' : '••••••••'}
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
        <TouchableOpacity className="bg-white/10 border border-white/20 py-2 px-3 rounded-full flex-row items-center mr-2">
          <MaterialIcons name="star" size={16} color="#00E65B" />
          <Text className="text-white font-bold ml-1 text-xs">Oportunidades</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-white/10 border border-white/20 py-2 px-3 rounded-full flex-row items-center mr-2">
          <MaterialIcons name="check-circle" size={16} color="#00E65B" />
          <Text className="text-white font-bold ml-1 text-xs">Pré-Aprovado</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white/10 border border-white/20 py-2 px-3 rounded-full flex-row items-center mr-2"
        >
          <MaterialIcons name="calculate" size={16} color="#00E65B" />
          <Text className="text-white font-bold ml-1 text-xs">Simular</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white/10 border border-white/20 py-2 px-3 rounded-full flex-row items-center">
          <MaterialIcons name="description" size={16} color="#00E65B" />
          <Text className="text-white font-bold ml-1 text-xs">Propostas</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity 
        testID="simulate-button"
        onPress={onSimulatePress}
        className="bg-[#00E65B] py-3 rounded-xl flex-row justify-center items-center"
      >
        <MaterialIcons name="calculate" size={20} color="#0A3D24" />
        <Text className="text-[#0A3D24] font-bold ml-2">Simular agora</Text>
      </TouchableOpacity>
    </View>
  );
}
