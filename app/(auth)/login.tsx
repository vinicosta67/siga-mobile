import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../src/store/slices/authSlice';
import { storage } from '../../src/services/storage';
import { authService } from '../../src/services/auth';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para lidar com o foco
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      storage.set('siga_logger_token', response.token);
      dispatch(loginSuccess({ token: response.token, user: response.user }));
      router.replace('/(tabs)');
    } catch (err: any) {
      const apiError = err.response?.data?.message || 'Erro ao conectar com o servidor.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Fundo Verde Falso: Fica fixo no topo e cobre metade da tela. 
          Usando inline style para garantir que o React Native entenda os 70% independente do Tailwind */}
      <View 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '70%', 
          backgroundColor: '#0A3D24' 
        }} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Header Section */}
          <View className="px-8 pb-8" style={{ paddingTop: Math.max(insets.top, 40) + 20 }}>
            <View className="flex-row items-center mb-6">
              <View className="bg-white/10 p-2 rounded-lg mr-3" style={{ borderRadius: 8 }}>
                <Text className="text-white font-black text-xl">A</Text>
              </View>
              <View>
                <Text className="text-white font-black text-sm uppercase">Banco da Amazônia</Text>
                <Text className="text-[#00E65B] font-bold text-xs">SIGA V2.0</Text>
              </View>
            </View>
            
            <Text className="text-white text-5xl font-black leading-tight tracking-tight">
              Acesso{'\n'}Profissional{'\n'}BASA.
            </Text>
            <Text className="text-white/70 text-base mt-4 font-medium">
              Pipeline completo de crédito rural para gerentes, analistas e equipes do Banco da Amazônia.
            </Text>
          </View>

          {/* Bottom Login Card */}
          <View 
            className="bg-white w-full px-8 pt-14 shadow-2xl" 
            style={{ 
              borderTopLeftRadius: 40, 
              borderTopRightRadius: 40,
              paddingBottom: Math.max(insets.bottom, 24) + 16
            }}
          >
            <View className="flex-row items-center mb-8">
              <View className="bg-gray-100 p-3 rounded-2xl mr-4" style={{ borderRadius: 16 }}>
                <MaterialIcons name="security" size={24} color="#0A3D24" />
              </View>
              <View>
                <Text className="text-[#0A3D24] text-2xl font-black">Entrar no SIGA</Text>
                <Text className="text-gray-500 font-medium">Profissional BASA</Text>
              </View>
            </View>

            <View className="space-y-5">
              <View>
                <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">E-mail corporativo</Text>
                <View 
                  className={`flex-row items-center border px-4 bg-gray-50 ${isEmailFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
                  style={{ borderRadius: 12 }}
                >
                  <MaterialIcons name="email" size={20} color="#9CA3AF" />
                  <TextInput 
                    className="flex-1 py-4 px-3 text-gray-800 font-medium"
                    placeholder="seu@bancoamazonia.com.br"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                  />
                </View>
              </View>
              
              <View className="mt-5">
                <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Senha</Text>
                <View 
                  className={`flex-row items-center border px-4 bg-gray-50 ${isPasswordFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
                  style={{ borderRadius: 12 }}
                >
                  <MaterialIcons name="lock" size={20} color="#9CA3AF" />
                  <TextInput 
                    className="flex-1 py-4 px-3 text-gray-800 font-medium"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                  <MaterialIcons name="visibility" size={20} color="#9CA3AF" />
                </View>
              </View>

              {error ? (
                <Text className="text-red-500 font-bold text-center mt-2">{error}</Text>
              ) : null}

              <TouchableOpacity 
                className="w-full bg-[#0A3D24] py-4 mt-8 flex-row justify-center items-center shadow-md"
                style={{ borderRadius: 12 }}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text className="text-white font-black text-lg mr-2">Entrar</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="mt-6 items-center">
                <Text className="text-gray-500 font-medium text-sm">
                  Problemas com acesso? <Text className="text-[#0A3D24] font-bold">Suporte TI</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
