import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../../src/store/slices/registerSlice';
import { RootState } from '../../../src/store';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

export default function ContactScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { email: initialEmail, phone: initialPhone } = useSelector((state: RootState) => state.register);

  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const formatPhone = (text: string) => {
    const raw = text.replace(/\D/g, '');
    return raw
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handlePhoneChange = (text: string) => {
    setPhoneError('');
    setPhone(formatPhone(text));
  };

  const handleNext = () => {
    let isValid = true;
    
    // Validate Email
    try {
      z.string().email('E-mail inválido.').parse(email);
      setEmailError('');
    } catch (e: any) {
      setEmailError(e.errors[0].message);
      isValid = false;
    }

    // Validate Phone
    const rawPhone = phone.replace(/\D/g, '');
    try {
      z.string().length(11, 'O celular deve ter 11 dígitos com o DDD.').parse(rawPhone);
      setPhoneError('');
    } catch (e: any) {
      setPhoneError(e.errors[0].message);
      isValid = false;
    }

    if (isValid) {
      dispatch(updateRegisterData({ email: email.trim().toLowerCase(), phone: rawPhone }));
      router.push('/(auth)/registro/endereco');
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
            Como entramos em contato?
          </Text>
          <Text className="text-gray-500 font-medium text-base leading-relaxed">
            Usaremos esses dados apenas para segurança da sua conta e comunicações importantes.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">E-mail</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isEmailFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="email" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg"
              placeholder="seu@email.com.br"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(''); }}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
              autoFocus
            />
          </View>
          {emailError ? <Text className="text-red-500 font-bold mt-2 ml-1">{emailError}</Text> : null}
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Celular (com DDD)</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isPhoneFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="phone-android" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg"
              placeholder="(00) 00000-0000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={15}
              value={phone}
              onChangeText={handlePhoneChange}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
            />
          </View>
          {phoneError ? <Text className="text-red-500 font-bold mt-2 ml-1">{phoneError}</Text> : null}
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
