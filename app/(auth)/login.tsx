import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../src/store/slices/authSlice';
import { storage } from '../../src/services/api';
import { authService } from '../../src/services/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      
      // Salva no storage (usando nosso mock em memória ou MMKV)
      storage.set('siga_logger_token', response.token);
      
      // Atualiza o estado global
      dispatch(loginSuccess({ token: response.token, user: response.user }));
      
      // Redireciona
      router.replace('/(tabs)');
    } catch (err: any) {
      // Tenta extrair a mensagem de erro da API
      const apiError = err.response?.data?.message || 'Erro ao conectar com o servidor.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <Text className="text-3xl font-black text-[#0A3D24] mb-8">SIGA Mobile</Text>
      
      <View className="w-full space-y-4">
        <View>
          <Text className="text-gray-800 font-bold mb-2">E-mail</Text>
          <TextInput 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-800"
            placeholder="Digite seu e-mail"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        
        <View className="mt-4">
          <Text className="text-gray-800 font-bold mb-2">Senha</Text>
          <TextInput 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-800"
            placeholder="Digite sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error ? (
          <Text className="text-red-500 font-bold text-center mt-2">{error}</Text>
        ) : null}

        <TouchableOpacity 
          className="w-full bg-[#00E65B] py-4 rounded-lg mt-6 flex-row justify-center items-center"
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#0A3D24" />
          ) : (
            <Text className="text-[#0A3D24] font-black text-lg">Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
