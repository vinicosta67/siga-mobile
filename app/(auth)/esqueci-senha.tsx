import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from '../../src/services/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EsqueciSenhaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [isEmailFocused, setIsEmailFocused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Informe seu e-mail corporativo.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      await authService.forgotPassword({ email: email.toLowerCase().trim() });
      setIsSent(true);
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isLoading) return;
    setIsLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword({ email: email.toLowerCase().trim() });
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao reenviar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <View className="flex-1 bg-white">
        <View style={{ paddingTop: Math.max(insets.top, 40) + 20 }} className="px-8 pb-4">
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')} className="mb-6 flex-row items-center">
            <MaterialIcons name="arrow-back" size={24} color="#0A3D24" />
            <Text className="text-[#0A3D24] font-bold ml-2">Voltar ao login</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-8 items-center justify-center -mt-20">
          <View className="bg-[#E6F9EE] w-20 h-20 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="mark-email-read" size={40} color="#00E65B" />
          </View>
          
          <Text className="text-3xl font-black text-[#0A3D24] text-center mb-4">
            E-mail enviado!
          </Text>
          
          <Text className="text-gray-500 font-medium text-base text-center leading-relaxed">
            Enviamos um link de redefinição de senha para o e-mail:
          </Text>
          <Text className="text-gray-800 font-bold text-lg text-center mt-2 mb-8">
            {email}
          </Text>
          
          <Text className="text-gray-400 text-sm text-center mb-8 px-4">
            * Se não encontrar na caixa de entrada, verifique também a pasta de spam ou lixo eletrônico.
          </Text>

          <TouchableOpacity 
            className={`w-full py-4 rounded-xl flex-row justify-center items-center border ${countdown > 0 ? 'bg-gray-100 border-gray-200' : 'bg-white border-[#0A3D24]'}`}
            onPress={handleResend}
            disabled={countdown > 0 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#0A3D24" />
            ) : (
              <Text className={`font-bold text-lg ${countdown > 0 ? 'text-gray-400' : 'text-[#0A3D24]'}`}>
                {countdown > 0 ? `Reenviar e-mail em ${countdown}s` : 'Reenviar e-mail'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <View style={{ paddingTop: Math.max(insets.top, 40) + 20 }} className="px-8 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-6 flex-row items-center">
            <MaterialIcons name="arrow-back" size={24} color="#0A3D24" />
            <Text className="text-[#0A3D24] font-bold ml-2">Voltar</Text>
          </TouchableOpacity>
          
          <View className="mb-8 mt-4">
            <Text className="text-3xl font-black text-[#0A3D24] mb-3">
              Esqueceu sua senha?
            </Text>
            <Text className="text-gray-500 font-medium text-base leading-relaxed">
              Informe seu e-mail corporativo abaixo para enviarmos um link de recuperação.
            </Text>
          </View>
        </View>

        <View className="flex-1 px-8 pt-4">
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
                onChangeText={(t) => { setEmail(t); setError(''); }}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </View>
          </View>

          {error ? (
            <Text className="text-red-500 font-bold text-center mt-4">{error}</Text>
          ) : null}

          <TouchableOpacity 
            className="w-full bg-[#0A3D24] py-4 mt-8 flex-row justify-center items-center shadow-md"
            style={{ borderRadius: 12, opacity: isLoading ? 0.7 : 1 }}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-white font-black text-lg mr-2">Enviar link de acesso</Text>
                <MaterialIcons name="send" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
