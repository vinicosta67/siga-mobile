import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function FeedbackCard() {
  return (
    <TouchableOpacity className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="bg-green-50 p-2 rounded-full mr-3 border border-green-100">
          <MaterialCommunityIcons name="star-outline" size={20} color="#00E65B" />
        </View>
        <Text className="text-gray-800 font-bold text-base">Avalie sua experiência</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
