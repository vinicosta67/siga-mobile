import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../../src/store/slices/registerSlice';
import { RootState } from '../../../src/store';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

export default function IdentityScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pfType, cpfCnpj } = useSelector((state: RootState) => state.register);

  const [value, setValue] = useState(cpfCnpj || '');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isPF = pfType === 'FISICA';
  const label = isPF ? 'CPF' : 'CNPJ';
  const placeholder = isPF ? '000.000.000-00' : '00.000.000/0000-00';
  const maxLength = isPF ? 14 : 18; // com máscara

  // Máscara simples
  const formatDocument = (text: string) => {
    const raw = text.replace(/\D/g, '');
    if (isPF) {
      return raw
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return raw
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  const handleChange = (text: string) => {
    setError('');
    setValue(formatDocument(text));
  };

  const handleNext = () => {
    const rawValue = value.replace(/\D/g, '');
    
    // Validação de tamanho usando Zod
    const schema = z.string().length(isPF ? 11 : 14, `O ${label} deve ter ${isPF ? 11 : 14} números.`);
    
    try {
      schema.parse(rawValue);
      // Salva sem máscara no Redux para enviar pra API limpo
      dispatch(updateRegisterData({ cpfCnpj: rawValue }));
      router.push('/(auth)/registro/dados');
    } catch (e: any) {
      setError(e.errors[0].message);
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
            Qual o seu {label}?
          </Text>
          <Text className="text-gray-500 font-medium text-base leading-relaxed">
            Precisamos do seu {label} para iniciar o seu cadastro com segurança.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">{label}</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="badge" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg tracking-widest"
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={value}
              maxLength={maxLength}
              onChangeText={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
            />
          </View>
          {error ? <Text className="text-red-500 font-bold mt-2 ml-1">{error}</Text> : null}
        </View>

        <TouchableOpacity 
          className="w-full bg-[#0A3D24] py-4 mt-auto mb-6 flex-row justify-center items-center shadow-md"
          style={{ borderRadius: 12 }}
          onPress={handleNext}
        >
          <Text className="text-white font-black text-lg mr-2">Continuar</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
