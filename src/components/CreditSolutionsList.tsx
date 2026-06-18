import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SolutionItem {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const SOLUTIONS: SolutionItem[] = [
  { id: '1', title: 'Crédito Rural FNO', icon: 'tractor', color: '#18A354' },
  { id: '2', title: 'Investimento BNDES', icon: 'chart-line', color: '#3B82F6' },
  { id: '3', title: 'Microcrédito', icon: 'storefront-outline', color: '#F59E0B' },
];

export default function CreditSolutionsList() {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mt-2"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {SOLUTIONS.map((item) => (
        <TouchableOpacity 
          key={item.id}
          className="bg-white border border-gray-100 p-4 rounded-2xl mr-3 shadow-sm w-36 items-center"
        >
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: `${item.color}20` }}
          >
            <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
          </View>
          <Text className="text-brand-dark font-bold text-sm text-center">
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
