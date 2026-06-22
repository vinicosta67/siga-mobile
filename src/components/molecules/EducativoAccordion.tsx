import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EducativoAccordionProps {
  titulo: string;
  conteudo: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function EducativoAccordion({ titulo, conteudo, isExpanded, onToggle }: EducativoAccordionProps) {
  return (
    <View className={`mb-2 bg-white rounded-xl border ${isExpanded ? 'border-brand-green' : 'border-gray-200'}`}>
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onToggle}
        className="p-4 flex-row items-center"
      >
        <MaterialIcons 
          name="help-outline" 
          size={18} 
          color={isExpanded ? '#0A3D24' : '#9CA3AF'} 
        />
        <Text className={`flex-1 mx-3 text-[13px] font-bold ${isExpanded ? 'text-brand-dark' : 'text-gray-600'}`}>
          {titulo}
        </Text>
        <MaterialIcons 
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={20} 
          color="#9CA3AF" 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View className="px-4 pb-4">
          <Text className="text-[14px] text-gray-500 leading-relaxed">
            {conteudo}
          </Text>
        </View>
      )}
    </View>
  );
}
