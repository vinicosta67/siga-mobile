import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../src/store';
import { resetRegisterData } from '../../../src/store/slices/registerSlice';
import { authService } from '../../../src/services/auth';
import { RegisterPayload } from '../../../src/types/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

export default function PasswordScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const registerState = useSelector((state: RootState) => state.register);

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').parse(password);
      setError('');
    } catch (e: any) {
      setError(e.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      // Monta o payload final conforme esperado pelo backend
      const payload: RegisterPayload = {
        name: registerState.pfType === 'FISICA' ? registerState.name : (registerState.mainPartnerName || registerState.name),
        email: registerState.email,
        password: password,
        pfType: registerState.pfType!,
      };

      if (registerState.pfType === 'FISICA') {
        payload.pfDetails = {
          cpf: registerState.cpfCnpj,
          phone: registerState.phone,
          birthDate: registerState.birthDate,
          zipCode: registerState.zipCode,
          city: registerState.city,
          state: registerState.state,
        };
      } else {
        payload.pjDetails = {
          cnpj: registerState.cpfCnpj,
          companyName: registerState.name,
          mainPartnerName: registerState.mainPartnerName || '',
          cpf: registerState.mainPartnerCpf || '',
          birthDate: registerState.mainPartnerBirthDate,
          phone: registerState.phone,
          zipCode: registerState.zipCode,
          city: registerState.city,
          state: registerState.state,
          companySize: registerState.companySize || '',
        };
      }

      await authService.register(payload);
      
      // Se sucesso, vai para a tela de verificar e-mail, passando o email como params
      router.push({
        pathname: '/(auth)/registro/verificacao',
        params: { email: registerState.email }
      });

    } catch (err: any) {
      const apiError = err.response?.data?.error || 'Ocorreu um erro ao criar a conta.';
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
        <View className="mb-8 mt-4">
          <Text className="text-3xl font-black text-[#0A3D24] mb-3">
            Crie sua senha
          </Text>
          <Text className="text-gray-500 font-medium text-base leading-relaxed">
            Sua senha deve ter no mínimo 6 caracteres. Evite senhas simples.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Senha de acesso</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="lock" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={isSecure}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
            />
            <TouchableOpacity onPress={() => setIsSecure(!isSecure)} className="p-2">
              <MaterialIcons name={isSecure ? "visibility" : "visibility-off"} size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          {error ? <Text className="text-red-500 font-bold mt-2 ml-1">{error}</Text> : null}
        </View>

        <TouchableOpacity 
          className="w-full bg-[#0A3D24] py-4 mt-auto mb-6 flex-row justify-center items-center shadow-md"
          style={{ borderRadius: 12, opacity: isLoading ? 0.7 : 1 }}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-white font-black text-lg mr-2">Criar Minha Conta</Text>
              <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
