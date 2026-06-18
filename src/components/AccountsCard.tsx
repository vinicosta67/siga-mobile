import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface AccountsCardProps {
  isVisible?: boolean;
}

export default function AccountsCard({ isVisible = true }: AccountsCardProps) {
  return (
    <View className="bg-white rounded-[24px] shadow-sm mb-6 border border-gray-100">
      {/* Top Section: Conta Corrente */}
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="credit-card-outline" size={24} color="#0A3D24" />
            <Text className="text-gray-800 font-bold ml-2">Conta corrente <Text className="text-gray-400 font-normal">**000-0</Text></Text>
          </View>
          <View className="bg-[#EFFF3B] px-2 py-1 rounded">
            <Text className="text-black text-[10px] font-black">PADRAO</Text>
          </View>
        </View>
        
        <Text className="text-black font-black text-4xl mb-4 tracking-tighter">
          {isVisible ? 'R$ 1.000,00' : '••••••••'}
        </Text>
        
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-[#0A3D24] font-bold text-sm underline decoration-[#0A3D24]">Acessar detalhes</Text>
          <MaterialIcons name="chevron-right" size={16} color="#0A3D24" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-100 w-full" />

      {/* Bottom Section: Conta Poupanca */}
      <View className="p-5 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="bg-[#0A3D24] p-2 rounded-lg mr-3">
            <MaterialCommunityIcons name="wallet-outline" size={20} color="white" />
          </View>
          <View>
            <Text className="text-gray-800 font-bold text-base">Conta poupanca</Text>
            <Text className="text-gray-400 text-xs">**000-0</Text>
          </View>
        </View>
        
        <TouchableOpacity className="border border-gray-300 rounded-lg py-1.5 px-4">
          <Text className="text-gray-800 font-bold text-sm">Ver mais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
