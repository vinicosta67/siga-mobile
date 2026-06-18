import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface HelpItemProps {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof MaterialIcons.glyphMap;
  isMaterial?: boolean;
}

function HelpItem({ title, subtitle, icon, isMaterial }: HelpItemProps) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        <View className="bg-gray-50 p-3 rounded-full mr-4">
          {isMaterial ? (
            <MaterialIcons name={icon as any} size={24} color="#0A3D24" />
          ) : (
            <MaterialCommunityIcons name={icon as any} size={24} color="#0A3D24" />
          )}
        </View>
        <View>
          <Text className="text-brand-dark font-bold text-base">{title}</Text>
          <Text className="text-gray-500 text-sm">{subtitle}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export default function HelpCenter() {
  return (
    <View className="bg-white rounded-2xl px-4 py-2 shadow-sm mb-6 border border-gray-100">
      <HelpItem 
        title="Atendimento" 
        subtitle="Central telefônica e SAC" 
        icon="headset-mic" 
        isMaterial 
      />
      <HelpItem 
        title="Chat via WhatsApp" 
        subtitle="Suporte rápido digital" 
        icon="whatsapp" 
      />
      <HelpItem 
        title="Falar com gerente" 
        subtitle="Agende um horário" 
        icon="account-tie" 
      />
    </View>
  );
}
