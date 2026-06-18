import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InvestmentsCardProps {
  isVisible?: boolean;
}

export default function InvestmentsCard({ isVisible = true }: InvestmentsCardProps) {
  return (
    <View className="bg-white rounded-[24px] shadow-sm mb-6 border border-gray-100 p-5">
      <View className="flex-row items-center mb-4">
        <MaterialCommunityIcons name="chart-line" size={24} color="#0A3D24" />
        <Text className="text-[#0A3D24] font-bold text-base ml-2">Investimentos</Text>
      </View>
      
      <Text className="text-gray-400 text-xs mb-1">Total investido</Text>
      <Text className="text-[#0A3D24] font-black text-3xl">
        {isVisible ? 'R$ 5.070,00' : '••••••••'}
      </Text>
    </View>
  );
}
