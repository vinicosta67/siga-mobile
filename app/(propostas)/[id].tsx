import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProposta } from '../../src/hooks/queries/usePropostas';
import { ActivityIndicator } from 'react-native';
import PropostaDetailHeader from '../../src/components/organisms/PropostaDetailHeader';
import HorizontalStepper from '../../src/components/molecules/HorizontalStepper';
import TimelineStatus from '../../src/components/molecules/TimelineStatus';
import TabDossie from '../../src/components/organisms/TabDossie';
import TabGarantias from '../../src/components/organisms/TabGarantias';
import TabPendencias from '../../src/components/organisms/TabPendencias';

export default function PropostaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState<'Status' | 'Dossie' | 'Garantias' | 'Pendencias'>('Status');

  const { data: proposta, isLoading } = useProposta(id as string);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#0A3D24" />
        <Text className="mt-4 text-gray-500 font-medium">Buscando detalhes...</Text>
      </View>
    );
  }

  if (!proposta) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500 font-medium">Proposta não encontrada.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-3 bg-brand-dark rounded-xl">
          <Text className="text-white font-bold">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Customizado */}
      <View 
        className="px-4 pb-4 flex-row items-center bg-brand-dark"
        style={{ paddingTop: insets.top + (Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 16) }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-white font-bold text-[18px]">
            Minha Proposta
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Header Section */}
        <PropostaDetailHeader proposta={proposta} />

        {/* Stepper Section */}
        <HorizontalStepper etapas={proposta.etapas} />

        {/* Tabs */}
        <View className="flex-row border-b border-gray-200 mt-2 bg-white">
          {(['Status', 'Dossie', 'Garantias', 'Pendencias'] as const).map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-3 items-center justify-center flex-row ${activeTab === tab ? 'border-b-2 border-brand-dark' : ''}`}
            >
              {tab === 'Status' && <MaterialIcons name="timeline" size={16} color={activeTab === tab ? '#0A3D24' : '#9CA3AF'} />}
              {tab === 'Dossie' && <MaterialIcons name="folder-open" size={16} color={activeTab === tab ? '#0A3D24' : '#9CA3AF'} />}
              {tab === 'Garantias' && <MaterialIcons name="security" size={16} color={activeTab === tab ? '#0A3D24' : '#9CA3AF'} />}
              {tab === 'Pendencias' && <MaterialIcons name="warning-amber" size={16} color={activeTab === tab ? '#0A3D24' : '#9CA3AF'} />}
              
              <Text className={`ml-1.5 font-bold text-[12px] ${activeTab === tab ? 'text-brand-dark' : 'text-gray-400'}`}>
                {tab === 'Dossie' ? 'Dossiê' : tab === 'Pendencias' ? 'Pendências' : tab}
              </Text>

              {tab === 'Pendencias' && proposta.quantidadePendencias > 0 && (
                <View className="bg-red-600 rounded-full w-4 h-4 items-center justify-center ml-1">
                  <Text className="text-white text-[10px] font-bold">{proposta.quantidadePendencias}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View className="flex-1 mt-2">
          {activeTab === 'Status' && <TimelineStatus etapas={proposta.etapas} />}
          {activeTab === 'Dossie' && <TabDossie proposta={proposta} />}
          {activeTab === 'Garantias' && <TabGarantias proposta={proposta} />}
          {activeTab === 'Pendencias' && <TabPendencias proposta={proposta} />}
        </View>

      </ScrollView>
    </View>
  );
}
