import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../../src/store/slices/registerSlice';
import { RootState } from '../../../src/store';
import { MaterialIcons } from '@expo/vector-icons';
import { z } from 'zod';

export default function PersonalDataScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { pfType, name, birthDate: initialBirthDate } = useSelector((state: RootState) => state.register);

  const [value, setValue] = useState(name || '');
  const [birthDate, setBirthDate] = useState(initialBirthDate || '');
  const [error, setError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isBirthFocused, setIsBirthFocused] = useState(false);

  // Novo estado para PJ
  const { companySize: initialCompanySize } = useSelector((state: RootState) => state.register);
  const [companySize, setCompanySize] = useState(initialCompanySize || '');
  const [sizeError, setSizeError] = useState('');
  const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);

  const companySizeOptions = [
    { value: 'MEI', label: 'MEI (1 func.)' },
    { value: 'ME', label: 'Microempresa (Até 9 func.)' },
    { value: 'EPP', label: 'Pequeno Porte (10-49 func.)' },
    { value: 'MEDIO', label: 'Médio Porte (50-99 func.)' },
    { value: 'GRANDE', label: 'Grande Porte (100+ func.)' },
  ];

  const isPF = pfType === 'FISICA';
  const title = isPF ? 'Como podemos te chamar?' : 'Qual o nome da sua empresa?';
  const label = isPF ? 'Nome Completo' : 'Razão Social';
  const placeholder = isPF ? 'João da Silva' : 'Empresa Agro LTDA';

  const formatBirthDate = (text: string) => {
    const raw = text.replace(/\D/g, '');
    return raw
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const handleBirthChange = (text: string) => {
    setBirthError('');
    setBirthDate(formatBirthDate(text));
  };

  const handleNext = () => {
    const nameSchema = z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.').trim();
    let isValid = true;
    let validName = '';

    try {
      validName = nameSchema.parse(value);
      setError('');
    } catch (e: any) {
      setError(e.errors[0].message);
      isValid = false;
    }

    if (isPF) {
      const rawDate = birthDate.replace(/\D/g, '');
      if (rawDate.length !== 8) {
        setBirthError('Data de nascimento inválida.');
        isValid = false;
      } else {
        // Validação básica de dia/mês/ano
        const day = parseInt(rawDate.substring(0, 2), 10);
        const month = parseInt(rawDate.substring(2, 4), 10);
        const year = parseInt(rawDate.substring(4, 8), 10);
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
          setBirthError('Data de nascimento inválida.');
          isValid = false;
        } else {
          setBirthError('');
        }
      }
    }

    if (!isPF && !companySize) {
      setSizeError('Selecione o tamanho da sua empresa.');
      isValid = false;
    } else {
      setSizeError('');
    }

    if (isValid) {
      // Converter DD/MM/YYYY para YYYY-MM-DDT00:00:00.000Z
      let isoDate = '';
      if (isPF) {
        const parts = birthDate.split('/');
        isoDate = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`;
      }

      dispatch(updateRegisterData({ 
        name: validName, 
        ...(isPF && { birthDate: isoDate }),
        ...(!isPF && { companySize })
      }));
      if (isPF) {
        router.push('/(auth)/registro/contato');
      } else {
        router.push('/(auth)/registro/representante');
      }
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
            {title}
          </Text>
          <Text className="text-gray-500 font-medium text-base leading-relaxed">
            {isPF 
              ? 'Digite seu nome completo conforme consta no seu documento.' 
              : 'Digite a razão social exata que consta no seu cartão CNPJ.'}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">{label}</Text>
          <View 
            className={`flex-row items-center border px-4 bg-gray-50 ${isFocused ? 'border-[#00E65B]' : 'border-gray-300'}`}
            style={{ borderRadius: 12 }}
          >
            <MaterialIcons name={isPF ? 'person' : 'business'} size={20} color="#9CA3AF" />
            <TextInput 
              className="flex-1 py-4 px-3 text-gray-800 font-medium text-lg"
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              value={value}
              onChangeText={(text) => {
                setValue(text);
                setError('');
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoCapitalize="words"
              autoFocus
            />
          </View>
          {error ? <Text className="text-red-500 font-bold mt-2 ml-1">{error}</Text> : null}
        </View>

        {isPF && (
          <View className="mb-6">
            <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Data de Nascimento</Text>
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
                onChangeText={handleBirthChange}
                onFocus={() => setIsBirthFocused(true)}
                onBlur={() => setIsBirthFocused(false)}
              />
            </View>
            {birthError ? <Text className="text-red-500 font-bold mt-2 ml-1">{birthError}</Text> : null}
          </View>
        )}

        {!isPF && (
          <View className="mb-6">
            <Text className="text-gray-700 font-bold mb-2 ml-1 text-sm">Quantidade de Funcionários</Text>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setIsSizeModalVisible(true)}
              className="flex-row items-center justify-between border border-gray-300 px-4 bg-gray-50 py-4"
              style={{ borderRadius: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Selecionar quantidade de funcionários"
              accessibilityHint="Abre uma lista para escolher o porte da empresa"
            >
              <View className="flex-row items-center">
                <MaterialIcons name="groups" size={20} color="#9CA3AF" />
                <Text className={`ml-3 font-medium text-lg ${companySize ? 'text-gray-800' : 'text-gray-400'}`}>
                  {companySize ? companySizeOptions.find(o => o.value === companySize)?.label : 'Selecione...'}
                </Text>
              </View>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            {sizeError ? <Text className="text-red-500 font-bold mt-2 ml-1">{sizeError}</Text> : null}

            {/* Modal Customizado para o Dropdown */}
            <Modal
              visible={isSizeModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsSizeModalVisible(false)}
            >
              <View className="flex-1 justify-end bg-black/50">
                <Pressable className="flex-1" onPress={() => setIsSizeModalVisible(false)} />
                <View className="bg-white rounded-t-3xl pt-2 pb-8 px-6 shadow-xl" style={{ maxHeight: '80%' }}>
                  <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
                  <Text className="text-xl font-black text-[#0A3D24] mb-4 text-center">Porte da Empresa</Text>
                  
                  {companySizeOptions.map((option) => {
                    const isSelected = companySize === option.value;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                          setCompanySize(option.value);
                          setSizeError('');
                          setIsSizeModalVisible(false);
                        }}
                        className={`py-4 border-b border-gray-100 flex-row items-center justify-between ${isSelected ? 'bg-green-50/50' : ''}`}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                      >
                        <Text className={`font-medium text-lg ${isSelected ? 'text-[#00E65B]' : 'text-gray-700'}`}>
                          {option.label}
                        </Text>
                        {isSelected && <MaterialIcons name="check-circle" size={24} color="#00E65B" />}
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity 
                    className="mt-6 py-4 bg-gray-100 rounded-xl items-center"
                    onPress={() => setIsSizeModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-bold text-lg">Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
