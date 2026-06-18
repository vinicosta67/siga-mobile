import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CreditCardBannerProps {
  isVisible?: boolean;
}

export default function CreditCardBanner({ isVisible = true }: CreditCardBannerProps) {
  return (
    <View className="bg-[#0A3D24] p-5 rounded-[24px] shadow-sm mb-6">
      <View className="flex-row items-center mb-6">
        <MaterialIcons name="credit-card" size={20} color="#EFFF3B" />
        <View className="ml-2">
          <Text className="text-white font-bold text-base">Amazonia Platinum</Text>
          <Text className="text-[#EFFF3B] text-xs">Final 0000</Text>
        </View>
      </View>

      <Text className="text-white font-black text-3xl mb-1">
        {isVisible ? 'R$ 3.200,00' : '••••••••'}
      </Text>
      <Text className="text-white text-xs mb-4">Fecha em 28 FEV</Text>

      {/* Progress Bar */}
      <View className="flex-row w-full h-2 rounded-full overflow-hidden mb-3 bg-white/20">
        <View className="bg-[#00E65B] h-full" style={{ width: '60%' }} />
      </View>

      <View className="flex-row justify-between items-center mt-2 mb-4">
        <Text className="text-white/70 text-xs">Limite disponível</Text>
        <Text className="text-white font-bold text-sm">
          {isVisible ? 'R$ 4.500,00' : '••••••••'}
        </Text>
      </View>

      <TouchableOpacity className="flex-row items-center">
        <Text className="text-[#00E65B] font-bold text-sm">Acessar detalhes</Text>
        <MaterialIcons name="chevron-right" size={16} color="#00E65B" />
      </TouchableOpacity>
    </View>
  );
}
