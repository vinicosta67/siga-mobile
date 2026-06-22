import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PropostasMockData } from '@/src/utils/propostaMockData';
import PropostaListCard from '@/src/components/molecules/PropostaListCard';

export default function ListaPropostasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Customizado */}
      <View 
        className="px-4 pb-4 flex-row items-center bg-brand-dark"
        style={{ paddingTop: insets.top + (Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 16) }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2" testID="back-button">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-white font-bold text-[18px]">
            Lista de Propostas
          </Text>
        </View>
      </View>

      <FlatList
        data={PropostasMockData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}
        renderItem={({ item }) => (
          <PropostaListCard 
            proposta={item} 
            onPress={() => router.push(`/(propostas)/${item.id}`)}
          />
        )}
      />
    </View>
  );
}
