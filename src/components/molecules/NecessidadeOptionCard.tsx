import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NecessidadeOptionCardProps {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function NecessidadeOptionCard({
  id,
  icon,
  title,
  description,
  isSelected,
  onSelect,
}: NecessidadeOptionCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onSelect(id)}
      className={`p-4 rounded-2xl border mb-4 flex-row items-center ${
        isSelected ? 'border-[#0A3D24] bg-[#E8F3EB]' : 'border-gray-200 bg-white'
      }`}
    >
      <View className="w-14 h-14 rounded-full bg-[#0A3D24] items-center justify-center mr-4">
        <MaterialIcons name={icon} size={28} color="#FFFFFF" />
      </View>
      <View className="flex-1 mr-2">
        <Text className="text-[16px] font-bold text-gray-800 mb-1">{title}</Text>
        <Text className="text-[13px] text-gray-500 leading-tight">{description}</Text>
      </View>
      <MaterialIcons 
        name={isSelected ? "check-circle" : "chevron-right"} 
        size={24} 
        color={isSelected ? '#0A3D24' : '#9CA3AF'} 
      />
    </TouchableOpacity>
  );
}
