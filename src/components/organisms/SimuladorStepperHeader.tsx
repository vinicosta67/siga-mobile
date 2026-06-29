import React from 'react';
import { View, TouchableOpacity, Platform, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SimuladorStepperHeaderProps {
  currentStep: number;
  totalSteps?: number;
}

export default function SimuladorStepperHeader({ currentStep, totalSteps = 6 }: SimuladorStepperHeaderProps) {
  const router = useRouter();

  // Create an array of length totalSteps
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, backgroundColor: '#FFFFFF' }}>
      <View className="bg-white">
        {/* Progress Bar Container */}
        <View className="flex-row px-4 pt-4 pb-2 justify-between gap-2">
          {steps.map((step) => (
            <View 
              key={step}
              className={`flex-1 h-1.5 rounded-full ${step <= currentStep ? 'bg-[#22C55E]' : 'bg-gray-200'}`}
            />
          ))}
        </View>

        {/* Back Button and Exit Container */}
        <View className="px-2 py-2 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.replace('/(tabs)/credito')}
            className="p-2 flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full mr-2"
            activeOpacity={0.7}
          >
            <Text className="text-gray-600 font-bold text-[12px] mr-1">Sair</Text>
            <MaterialIcons name="close" size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
