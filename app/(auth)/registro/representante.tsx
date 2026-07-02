import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../../src/store/slices/registerSlice';
import { RootState } from '../../../src/store';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

export default function RepresentanteScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { mainPartnerName, mainPartnerCpf, mainPartnerBirthDate } = useSelector((state: RootState) => state.register);

  const [name, setName] = useState(mainPartnerName || '');
  const [cpf, setCpf] = useState(mainPartnerCpf || '');
  const [birthDate, setBirthDate] = useState(mainPartnerBirthDate || '');
  
  const [errors, setErrors] = useState<{name?: string, cpf?: string, birthDate?: string}>({});
  
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isCpfFocused, setIsCpfFocused] = useState(false);
  const [isBirthFocused, setIsBirthFocused] = useState(false);

  const formatCpf = (text: string) => {
    const raw = text.replace(/\D/g, '');
    return raw
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatBirthDate = (text: string) => {
    const raw = text.replace(/\D/g, '');
    return raw
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const handleNext = () => {
    const newErrors: {name?: string, cpf?: string, birthDate?: string} = {};
    let isValid = true;

    // Validate Name
    try {
      z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.').trim().parse(name);
    } catch (e: any) {
      newErrors.name = e.errors[0].message;
      isValid = false;
    }

    // Validate CPF
    const rawCpf = cpf.replace(/\D/g, '');
    if (rawCpf.length !== 11) {
      newErrors.cpf = 'O CPF deve ter 11 dígitos.';
      isValid = false;
    }

    // Validate Birth Date
    const rawDate = birthDate.replace(/\D/g, '');
    if (rawDate.length !== 8) {
      newErrors.birthDate = 'Data de nascimento inválida.';
      isValid = false;
    } else {
      const day = parseInt(rawDate.substring(0, 2), 10);
      const month = parseInt(rawDate.substring(2, 4), 10);
      const year = parseInt(rawDate.substring(4, 8), 10);
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
        newErrors.birthDate = 'Data de nascimento inválida.';
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      const parts = birthDate.split('/');
      const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;

      dispatch(updateRegisterData({ 
        mainPartnerName: name.trim(), 
        mainPartnerCpf: rawCpf,
        mainPartnerBirthDate: isoDate 
      }));
      router.push('/(auth)/registro/contato');
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
            Quem é o representante legal?
          </Text>
          <Text className="text-gray-500 font-medium text-base leading-relaxed">
            Precisamos dos dados do sócio principal ou do representante legal da empresa.
          </Text>
        </View>

        {/* Nome */}
        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Nome Completo do Sócio</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isNameFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="person" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg"
              placeholder="João da Silva"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={(t) => { setName(t); setErrors(prev => ({...prev, name: ''})); }}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              autoCapitalize="words"
            />
          </View>
          {errors.name ? <Text className="text-red-500 font-bold mt-2 ml-1">{errors.name}</Text> : null}
        </View>

        {/* CPF */}
        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">CPF do Sócio</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isCpfFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="badge" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg"
              placeholder="000.000.000-00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={14}
              value={cpf}
              onChangeText={(t) => { setCpf(formatCpf(t)); setErrors(prev => ({...prev, cpf: ''})); }}
              onFocus={() => setIsCpfFocused(true)}
              onBlur={() => setIsCpfFocused(false)}
            />
          </View>
          {errors.cpf ? <Text className="text-red-500 font-bold mt-2 ml-1">{errors.cpf}</Text> : null}
        </View>

        {/* Data de Nascimento */}
        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Data de Nascimento do Sócio</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isBirthFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="cake" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg"
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={10}
              value={birthDate}
              onChangeText={(t) => { setBirthDate(formatBirthDate(t)); setErrors(prev => ({...prev, birthDate: ''})); }}
              onFocus={() => setIsBirthFocused(true)}
              onBlur={() => setIsBirthFocused(false)}
            />
          </View>
          {errors.birthDate ? <Text className="text-red-500 font-bold mt-2 ml-1">{errors.birthDate}</Text> : null}
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
