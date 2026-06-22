import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CreditoMockData } from '@/src/utils/creditoMockData';

export default function MeusContratosScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Mock list containing just our 1 active contract
  const contratos = [CreditoMockData.contratoAtivo];

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200 mb-4 shadow-sm" activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-gray-900 font-bold text-[24px]">Meus Contratos</Text>
        <Text className="text-gray-500 text-[14px] mt-1">Gerencie seus financiamentos e acompanhe parcelas.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}>
        {contratos.map(c => (
          <TouchableOpacity 
            key={c.id}
            onPress={() => router.push(`/(credito)/contrato/${c.id}` as any)}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="bg-green-100 px-2 py-1 rounded-md">
                <Text className="text-green-800 font-bold text-[10px] uppercase">{c.statusContrato}</Text>
              </View>
              <Text className="text-[12px] text-gray-400">Contrato {c.numeroContrato}</Text>
            </View>

            <Text className="font-bold text-[16px] text-gray-800 mb-1">{c.produto.nome}</Text>
            
            <View className="flex-row items-center mt-3 mb-4">
              <View className="flex-1">
                <Text className="text-[12px] text-gray-500 mb-0.5">Saldo devedor</Text>
                <Text className="font-bold text-[15px] text-gray-800">
                  R$ {c.saldoDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-[12px] text-gray-500 mb-0.5">Próx. vencimento</Text>
                <Text className="font-bold text-[15px] text-gray-800">
                  {c.proximoVencimento.toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center border-t border-gray-100 pt-3 mt-1">
              <Text className="text-brand-dark font-bold text-[13px] mr-1">Gerenciar contrato</Text>
              <MaterialIcons name="chevron-right" size={18} color="#0A3D24" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
