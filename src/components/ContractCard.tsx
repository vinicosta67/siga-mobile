import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Badge from './Badge';

interface ContractCardProps {
  title: string;
  value: string;
  dueDate: string;
  status: 'adimplente' | 'inadimplente' | 'quitado';
  onPress: () => void;
}

export default function ContractCard({ title, value, dueDate, status, onPress }: ContractCardProps) {
  const getBadgeProps = () => {
    switch (status) {
      case 'adimplente':
        return { text: 'Adimplente', variant: 'success' as const };
      case 'inadimplente':
        return { text: 'Atrasado', variant: 'danger' as const };
      case 'quitado':
        return { text: 'Quitado', variant: 'info' as const };
      default:
        return { text: 'Desconhecido', variant: 'warning' as const };
    }
  };

  const badgeProps = getBadgeProps();

  return (
    <TouchableOpacity 
      testID="contract-card"
      onPress={onPress}
      className="bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm flex-row justify-between items-center"
    >
      <View>
        <Text className="text-brand-dark font-bold text-base mb-1">{title}</Text>
        <Text className="text-brand-dark font-black text-lg mb-2">{value}</Text>
        <Text className="text-gray-500 text-xs">Vence em {dueDate}</Text>
      </View>
      
      <View className="items-end justify-between py-1">
        <Badge text={badgeProps.text} variant={badgeProps.variant} />
        <View className="bg-gray-50 p-2 rounded-full mt-4">
          <MaterialIcons name="chevron-right" size={20} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
