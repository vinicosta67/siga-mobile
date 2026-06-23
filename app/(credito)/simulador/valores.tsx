import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BASASlider from '../../../src/components/atoms/BASASlider';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import { RootState } from '../../../src/store';
import { nextStep, prevStep, setValorDesejado } from '../../../src/store/slices/simuladorSlice';
import { CreditoMockData } from '../../../src/utils/creditoMockData';

const formatCurrencyInput = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return '';
  const val = parseFloat(numericValue) / 100;
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim();
};

const parseCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9]/g, '');
  if (!numericValue) return 0;
  return parseFloat(numericValue) / 100;
};

const formatCurrencyDisplay = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function ValoresScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { step, produtoSelecionadoId, valorDesejado } = useSelector((state: RootState) => state.simulador);

  const produto = CreditoMockData.produtos.find(p => p.id === produtoSelecionadoId) || CreditoMockData.produtos[0];

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (valorDesejado > 0) {
      setInputValue(formatCurrencyDisplay(valorDesejado).replace('R$', '').trim());
    } else {
      const defaultVal = produto.valorMinimo;
      dispatch(setValorDesejado(defaultVal));
      setInputValue(formatCurrencyDisplay(defaultVal).replace('R$', '').trim());
    }
  }, []);

  const handleInputChange = (text: string) => {
    const formatted = formatCurrencyInput(text);
    setInputValue(formatted);

    const parsed = parseCurrency(text);
    dispatch(setValorDesejado(parsed));
  };

  const handleSliderChange = (val: number) => {
    dispatch(setValorDesejado(val));
    setInputValue(formatCurrencyDisplay(val).replace('R$', '').trim());
  };

  const setQuickValue = (val: number) => {
    dispatch(setValorDesejado(val));
    setInputValue(formatCurrencyDisplay(val).replace('R$', '').trim());
  };

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const handleContinue = () => {
    // Clamp before advancing
    let finalValue = valorDesejado;
    if (finalValue < produto.valorMinimo) finalValue = produto.valorMinimo;
    if (finalValue > produto.valorMaximo) finalValue = produto.valorMaximo;

    dispatch(setValorDesejado(finalValue));
    dispatch(nextStep());
    router.push('/(credito)/simulador/condicoes');
  };

  // Generate quick values based on product limits
  const generateQuickValues = () => {
    const min = produto.valorMinimo;
    const max = produto.valorMaximo;

    if (max <= 50000) return [1000, 5000, 10000, 15000, 30000].filter(v => v >= min && v <= max);
    if (max <= 500000) return [10000, 50000, 100000, 250000, 500000].filter(v => v >= min && v <= max);
    return [50000, 200000, 500000, 1000000, 3000000].filter(v => v >= min && v <= max);
  };

  const quickValues = generateQuickValues();

  // Get mapped icon based on product logic
  const getIcon = (id: string) => {
    if (id.includes('car')) return 'agriculture';
    if (id.includes('inv')) return 'precision-manufacturing';
    if (id.includes('flo')) return 'eco';
    return 'business-center';
  };

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-6 leading-tight">
          Quanto voce{'\n'}precisa?
        </Text>

        {/* Selected Product Pill */}
        <View className="bg-[#E8F3EB] self-start px-3 py-2 rounded-lg flex-row items-center mb-8">
          <MaterialIcons name={getIcon(produto.id) as any} size={16} color="#0A3D24" />
          <Text className="ml-2 text-[#0A3D24] font-bold text-[13px]">{produto.nome}</Text>
        </View>

        {/* Value Input */}
        <View className="mb-2 border-b border-gray-300 pb-2">
          <Text className="text-[14px] text-gray-500 mb-1">Valor desejado</Text>
          <View className="flex-row items-center">
            <Text className="text-[20px] font-bold text-gray-400 mr-2">R$</Text>
            <TextInput
              className="flex-1 text-[24px] font-bold text-gray-900"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={handleInputChange}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Min/Max Limits */}
        <View className="flex-row justify-between mb-8">
          <Text className="text-[12px] text-gray-400">Min: {formatCurrencyDisplay(produto.valorMinimo)}</Text>
          <Text className="text-[12px] text-gray-400">Max: {formatCurrencyDisplay(produto.valorMaximo)}</Text>
        </View>

        {/* Slider */}
        <BASASlider
          min={produto.valorMinimo}
          max={produto.valorMaximo}
          value={valorDesejado}
          onValueChange={handleSliderChange}
        />

        {/* Quick Values */}
        <View className="flex-row flex-wrap gap-2 mt-6">
          {quickValues.map((val) => {
            const isSelected = valorDesejado === val;
            return (
              <TouchableOpacity
                key={val}
                onPress={() => setQuickValue(val)}
                className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-[#0A3D24] border-[#0A3D24]' : 'bg-white border-gray-300'
                  }`}
              >
                <Text
                  className={`font-bold text-[13px] ${isSelected ? 'text-white' : 'text-gray-500'
                    }`}
                >
                  {formatCurrencyDisplay(val).replace(',00', '')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row gap-4"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 16 }}
      >
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 py-4 rounded-full items-center border border-gray-800 bg-white"
          activeOpacity={0.8}
        >
          <Text className="text-gray-800 font-bold text-[16px]">Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContinue}
          className="flex-1 py-4 rounded-full items-center bg-[#0A3D24]"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
