import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setPfType } from '../../../src/store/slices/registerSlice';
import { MaterialIcons } from '@expo/vector-icons';

export default function SelectAccountTypeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSelect = (type: 'FISICA' | 'JURIDICA') => {
    dispatch(setPfType(type));
    router.push('/(auth)/registro/identidade');
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-10 mt-4">
        <Text className="text-3xl font-black text-[#0A3D24] mb-3">
          Que tipo de conta você precisa?
        </Text>
        <Text className="text-gray-500 font-medium text-base leading-relaxed">
          O Banco da Amazônia oferece soluções sob medida tanto para você quanto para o seu negócio agro.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleSelect('FISICA')}
        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-5 flex-row items-center shadow-sm"
      >
        <View className="bg-[#0A3D24] p-3 rounded-full mr-4">
          <MaterialIcons name="person" size={28} color="#fff" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 mb-1">Para Mim</Text>
          <Text className="text-gray-500 font-medium text-sm">
            Conta Pessoa Física (PF)
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleSelect('JURIDICA')}
        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex-row items-center shadow-sm"
      >
        <View className="bg-[#00E65B] p-3 rounded-full mr-4">
          <MaterialIcons name="store" size={28} color="#0A3D24" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 mb-1">Para Minha Empresa</Text>
          <Text className="text-gray-500 font-medium text-sm">
            Conta Pessoa Jurídica (PJ)
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
      </TouchableOpacity>

      <View className="mt-auto pt-10 pb-6 items-center">
        <View className="flex-row items-center bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
          <MaterialIcons name="security" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
          <Text className="text-blue-700 font-medium text-sm flex-1">
            Seus dados são protegidos com criptografia de ponta a ponta e jamais serão compartilhados.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
