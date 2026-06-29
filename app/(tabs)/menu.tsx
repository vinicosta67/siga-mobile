import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { logout } from '../../src/store/slices/authSlice';
import { storage } from '../../src/services/storage';

// Componente para renderizar cada item do menu
const MenuItem = ({ 
  icon, 
  title, 
  onPress, 
  isComingSoon = false, 
  isDestructive = false 
}: { 
  icon: keyof typeof MaterialIcons.glyphMap; 
  title: string; 
  onPress?: () => void;
  isComingSoon?: boolean;
  isDestructive?: boolean;
}) => {
  return (
    <TouchableOpacity 
      className={`flex-row items-center justify-between py-4 px-5 bg-white border-b border-gray-100 ${isDestructive ? 'mt-4 border-t' : ''}`}
      onPress={isComingSoon ? undefined : onPress}
      activeOpacity={isComingSoon ? 1 : 0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDestructive ? 'bg-red-50' : 'bg-gray-50'}`}>
          <MaterialIcons 
            name={icon} 
            size={22} 
            color={isDestructive ? '#EF4444' : (isComingSoon ? '#9CA3AF' : '#0A3D24')} 
          />
        </View>
        <Text className={`font-semibold text-base ${isDestructive ? 'text-red-500' : (isComingSoon ? 'text-gray-400' : 'text-gray-800')}`}>
          {title}
        </Text>
      </View>
      
      {isComingSoon ? (
        <View className="bg-gray-100 px-2 py-1 rounded-md">
          <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Em breve</Text>
        </View>
      ) : (
        <MaterialIcons 
          name="chevron-right" 
          size={24} 
          color={isDestructive ? '#EF4444' : '#D1D5DB'} 
        />
      )}
    </TouchableOpacity>
  );
};

// Componente para o título de cada seção
const SectionTitle = ({ title }: { title: string }) => (
  <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-5 mb-2 mt-6">
    {title}
  </Text>
);

export default function Menu() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            // Limpa o storage local
            storage.remove('siga_logger_token');
            // Limpa o estado global do Redux
            dispatch(logout());
            // Redireciona para o login apagando o histórico de navegação
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const navigateToCredit = () => {
    router.push('/(tabs)/credito');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 py-4 bg-white border-b border-gray-100">
        <Text className="text-2xl font-black text-[#0A3D24]">Menu</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <SectionTitle title="Crédito Especializado" />
        <View className="bg-white border-y border-gray-100">
          <MenuItem icon="local-offer" title="Oportunidades" onPress={() => router.push('/(credito)/oportunidades')} />
          <MenuItem icon="check-circle" title="Pré-Aprovado" onPress={() => router.push('/(credito)/pre-aprovado')} />
          <MenuItem icon="calculate" title="Simular" onPress={() => router.push('/(credito)/simulador/necessidade')} />
          <MenuItem icon="description" title="Minhas Propostas" onPress={() => router.push('/(propostas)/')} />
          <MenuItem icon="folder-shared" title="Meus Contratos" onPress={() => router.push('/(credito)/meus-contratos')} />
        </View>

        <SectionTitle title="Geral" />
        <View className="bg-white border-y border-gray-100">
          <MenuItem icon="home" title="Início" onPress={() => router.push('/(tabs)')} />
          <MenuItem icon="account-balance" title="Crédito Especializado" onPress={navigateToCredit} />
          <MenuItem icon="trending-up" title="Investimentos" isComingSoon />
          <MenuItem icon="pix" title="Área Pix" isComingSoon />
          <MenuItem icon="swap-horiz" title="Transferir" isComingSoon />
          <MenuItem icon="receipt-long" title="Pagamentos" isComingSoon />
          <MenuItem icon="credit-card" title="Meus Cartões" isComingSoon />
          <MenuItem icon="build" title="Serviços e Tarifas" isComingSoon />
        </View>

        <SectionTitle title="Contato" />
        <View className="bg-white border-y border-gray-100">
          <MenuItem icon="help-outline" title="Ajuda e Suporte" onPress={() => {}} />
          <MenuItem icon="chat-bubble-outline" title="Fale Conosco" onPress={() => {}} />
          <MenuItem icon="feedback" title="Feedback" isComingSoon />
        </View>

        <View className="mt-8 px-5">
          <TouchableOpacity 
            className="w-full bg-red-50 py-4 flex-row justify-center items-center rounded-xl border border-red-100"
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="text-red-500 font-bold text-lg">Sair da conta</Text>
          </TouchableOpacity>
          <Text className="text-center text-gray-400 text-xs mt-4 font-medium">Versão 2.0.0 (Build 14)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
