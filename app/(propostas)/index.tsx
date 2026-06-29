import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropostaListCard from '@/src/components/molecules/PropostaListCard';
import { usePropostas } from '@/src/hooks/queries/usePropostas';
import { ActivityIndicator } from 'react-native';

export default function ListaPropostasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: propostas, isLoading } = usePropostas();

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

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0A3D24" />
          <Text className="mt-4 text-gray-500 font-medium">Buscando propostas...</Text>
        </View>
      ) : propostas && propostas.length > 0 ? (
        <FlatList
          data={propostas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}
          renderItem={({ item }) => (
            <PropostaListCard 
              proposta={item as any} 
              onPress={() => router.push(`/(propostas)/${item.id}`)}
            />
          )}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-8">
          <MaterialIcons name="inbox" size={64} color="#D1D5DB" />
          <Text className="mt-4 text-gray-500 font-medium text-center text-[16px]">
            Você ainda não possui propostas cadastradas.
          </Text>
        </View>
      )}
    </View>
  );
}
