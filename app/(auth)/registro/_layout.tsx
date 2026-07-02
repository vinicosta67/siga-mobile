import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

export default function RegistroLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0A3D24',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ marginLeft: 8, padding: 8 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Criar Conta',
        }} 
      />
      <Stack.Screen 
        name="identidade" 
        options={{ 
          title: 'Sua Identidade',
        }} 
      />
      <Stack.Screen 
        name="dados" 
        options={{ 
          title: 'Dados Básicos',
        }} 
      />
      <Stack.Screen 
        name="contato" 
        options={{ 
          title: 'Contato',
        }} 
      />
      <Stack.Screen 
        name="endereco" 
        options={{ 
          title: 'Endereço',
        }} 
      />
      <Stack.Screen 
        name="senha" 
        options={{ 
          title: 'Segurança',
        }} 
      />
      <Stack.Screen 
        name="verificacao" 
        options={{ 
          title: 'Verificar E-mail',
          headerLeft: () => null, // O usuário não deve voltar, deve colocar o token
          gestureEnabled: false,
        }} 
      />
    </Stack>
  );
}
