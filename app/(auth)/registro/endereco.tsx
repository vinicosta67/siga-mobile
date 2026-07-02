import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../../src/store/slices/registerSlice';
import { RootState } from '../../../src/store';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';
import axios from 'axios';

export default function AddressScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { zipCode: initialZip } = useSelector((state: RootState) => state.register);

  const [zipCode, setZipCode] = useState(initialZip || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateUF, setStateUF] = useState('');
  
  const [zipError, setZipError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const formatCep = (text: string) => {
    const raw = text.replace(/\D/g, '');
    return raw.replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
  };

  const fetchCep = async (rawCep: string) => {
    if (rawCep.length !== 8) return;
    
    setIsLoadingCep(true);
    setZipError('');
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${rawCep}/json/`);
      if (response.data.erro) {
        setZipError('CEP não encontrado.');
      } else {
        setAddress(response.data.logradouro);
        setCity(response.data.localidade);
        setStateUF(response.data.uf);
      }
    } catch (e) {
      setZipError('Erro ao buscar o CEP.');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleZipChange = (text: string) => {
    setZipError('');
    const formatted = formatCep(text);
    setZipCode(formatted);
    
    const raw = formatted.replace(/\D/g, '');
    if (raw.length === 8) {
      fetchCep(raw);
    }
  };

  const handleNext = () => {
    const rawZip = zipCode.replace(/\D/g, '');
    try {
      z.string().length(8, 'O CEP deve ter 8 números.').parse(rawZip);
      z.string().min(1, 'Cidade é obrigatória.').parse(city);
      z.string().length(2, 'UF inválida.').parse(stateUF);
      
      dispatch(updateRegisterData({ 
        zipCode: rawZip,
        city,
        state: stateUF,
        address
      }));
      router.push('/(auth)/registro/senha');
    } catch (e: any) {
      setZipError(e.errors ? e.errors[0].message : 'Preencha um CEP válido para buscar sua cidade.');
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
            Onde você mora?
          </Text>
          <Text className="text-gray-500 font-medium text-base leading-relaxed">
            Digite seu CEP. Nós preencheremos a cidade e estado automaticamente para você.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">CEP</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name="place" size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg tracking-widest"
              placeholder="00000-000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={9}
              value={zipCode}
              onChangeText={handleZipChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
            />
            {isLoadingCep && <ActivityIndicator size="small" color="#00E65B" />}
          </View>
          {zipError ? <Text className="text-red-500 font-bold mt-2 ml-1">{zipError}</Text> : null}
        </View>

        {(city !== '' && stateUF !== '') && (
          <View className="bg-[#F0FDF4] p-5 rounded-2xl border border-[#BBF7D0] flex-row items-start mb-6">
            <MaterialIcons name="check-circle" size={24} color="#16A34A" style={{ marginTop: 2, marginRight: 12 }} />
            <View className="flex-1">
              <Text className="text-[#166534] font-bold text-base mb-1">Localização Confirmada</Text>
              <Text className="text-[#15803D] font-medium text-sm">
                {address ? `${address}\n` : ''}
                {city} - {stateUF}
              </Text>
            </View>
          </View>
        )}

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
