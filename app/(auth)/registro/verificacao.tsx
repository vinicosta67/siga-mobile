import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { authService } from '../../../src/services/auth';
import { resetRegisterData } from '../../../src/store/slices/registerSlice';

export default function VerificationScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    try {
      z.string().length(6, 'O código deve ter 6 números.').parse(token);
      setError('');
    } catch (e: any) {
      setError(e.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyEmail({ token });

      // Limpa os dados do Redux de registro já que terminou o fluxo
      dispatch(resetRegisterData());

      // Vai para a tela de login
      router.replace('/(auth)/login');
    } catch (err: any) {
      const apiError = err.response?.data?.error || 'Código inválido ou expirado.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="items-center mt-10 mb-8">
          <View className="bg-[#E6F9EE] w-24 h-24 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="mark-email-read" size={48} color="#00E65B" />
          </View>
          <Text className="text-3xl font-black text-[#0A3D24] mb-3 text-center">
            Verifique seu e-mail
          </Text>
          <Text className="text-gray-500 font-medium text-base text-center leading-relaxed">
            Enviamos um código de 6 dígitos para{'\n'}
            <Text className="font-bold text-gray-800">{email}</Text>.{'\n'}
            Digite abaixo para ativar sua conta.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm text-center">Código de Verificação</Text>
          <View
            className={`flex-row items-center border px-4 bg-gray-50 mx-8 ${isFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <TextInput
              className="flex-1 py-4 text-gray-800 font-black text-3xl text-center"
              style={{ letterSpacing: 12, paddingLeft: 12, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) } as any}
              placeholder="000000"
              placeholderTextColor="#D1D5DB"
              keyboardType="numeric"
              maxLength={6}
              value={token}
              onChangeText={(t) => { setToken(t); setError(''); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
            />
          </View>
          {error ? <Text className="text-red-500 font-bold mt-3 text-center">{error}</Text> : null}
        </View>

        <TouchableOpacity
          className="w-full bg-[#0A3D24] py-4 mt-auto mb-6 flex-row justify-center items-center shadow-md"
          style={{ borderRadius: 12, opacity: isLoading ? 0.7 : 1 }}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-black text-lg">Validar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
