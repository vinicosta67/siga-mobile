import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

interface MenuItemProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  color: string;
  isMaterial?: boolean;
  route?: string;
}

const MENU_ITEMS: MenuItemProps[] = [
  { title: 'Oportunidades', subtitle: 'Novas linhas de crédito', icon: 'star-circle-outline', color: '#F59E0B', isMaterial: false, route: '/(credito)/oportunidades' },
  { title: 'Crédito Pré-Aprovado', subtitle: '3 ofertas disponíveis', icon: 'check-circle-outline', color: '#18A354', isMaterial: false, route: '/(credito)/pre-aprovado' },
  { title: 'Simular Crédito', subtitle: 'Faça uma simulação agora', icon: 'calculate', color: '#3B82F6', isMaterial: true },
  { title: 'Minhas Propostas', subtitle: 'Acompanhe suas solicitações', icon: 'file-document-outline', color: '#8B5CF6', isMaterial: false, route: '/(propostas)/' },
  { title: 'Meus Contratos', subtitle: 'Gerencie seus financiamentos', icon: 'briefcase-outline', color: '#64748B', isMaterial: false, route: '/(credito)/meus-contratos' },
];

export default function CreditNavigationMenu() {
  const router = useRouter();

  return (
    <View className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
      {MENU_ITEMS.map((item, index) => (
        <TouchableOpacity 
          key={item.title}
          onPress={() => item.route && router.push(item.route as any)}
          activeOpacity={item.route ? 0.7 : 1}
          className={`flex-row items-center justify-between py-4 ${
            index !== MENU_ITEMS.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <View className="flex-row items-center">
            <View 
              className="p-3 rounded-full mr-4"
              style={{ backgroundColor: `${item.color}15` }}
            >
              {item.isMaterial ? (
                <MaterialIcons name={item.icon as any} size={24} color={item.color} />
              ) : (
                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
              )}
            </View>
            <View>
              <Text className="text-brand-dark font-bold text-base">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
