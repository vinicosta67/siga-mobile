import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ManagerCardProps {
  managerName: string;
  onContactPress: () => void;
}

export default function ManagerCard({ managerName, onContactPress }: ManagerCardProps) {
  return (
    <View className="mx-4 p-4 bg-white rounded-2xl border border-gray-200 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-brand-green/10 items-center justify-center">
        <MaterialIcons name="person" size={24} color="#0A3D24" />
      </View>
      <View className="flex-1 ml-3">
        <Text className="text-gray-600 font-semibold text-[14px]">
          Seu gerente: {managerName}
        </Text>
        <Text className="text-gray-400 text-[12px] font-medium mt-0.5">
          Ag. Belém Centro — Pronto para atender
        </Text>
      </View>
      <TouchableOpacity
        testID="manager-contact-button"
        onPress={onContactPress}
        className="p-2.5 bg-brand-green/20 rounded-xl"
      >
        <MaterialIcons name="chat" size={20} color="#18A354" />
      </TouchableOpacity>
    </View>
  );
}
