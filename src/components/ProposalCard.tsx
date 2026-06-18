import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Badge from './Badge';

interface ProposalCardProps {
  title: string;
  id: string;
  progress: number;
  onPress: () => void;
}

export default function ProposalCard({ title, id, progress, onPress }: ProposalCardProps) {
  return (
    <TouchableOpacity 
      testID="proposal-card"
      onPress={onPress}
      className="bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View className="bg-blue-50 p-2 rounded-xl mr-3">
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#3B82F6" />
          </View>
          <View>
            <Text className="text-brand-dark font-bold text-base">{title}</Text>
            <Text className="text-gray-400 text-xs">{id}</Text>
          </View>
        </View>
        <Badge text="Em análise" variant="warning" />
      </View>
      
      <View className="mt-2">
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs text-gray-500 font-medium">Progresso</Text>
          <Text className="text-xs text-brand-green font-bold">{progress}%</Text>
        </View>
        <View className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
          <View 
            className="h-full bg-brand-green rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
