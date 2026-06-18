import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface PreApprovedCardProps {
  count: number;
  onPress: () => void;
}

export default function PreApprovedCard({ count, onPress }: PreApprovedCardProps) {
  return (
    <TouchableOpacity 
      testID="pre-approved-card"
      onPress={onPress}
      className="bg-brand-green/10 border border-brand-green/20 p-4 rounded-2xl flex-row items-center justify-between mt-4"
    >
      <View className="flex-row items-center flex-1">
        <View className="bg-brand-green/20 p-2 rounded-full mr-3">
          <MaterialCommunityIcons name="star-circle-outline" size={24} color="#18A354" />
        </View>
        <View>
          <Text className="text-brand-dark font-bold text-base">
            {count} ofertas pré-aprovadas
          </Text>
          <Text className="text-brand-dark/70 text-sm">
            Condições especiais para você
          </Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#0A3D24" />
    </TouchableOpacity>
  );
}
