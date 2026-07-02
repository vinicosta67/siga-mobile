import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import { useProdutoDetalhes } from '../../../src/hooks/queries/useSimulador';
import { RootState } from '../../../src/store';
import { addGarantia, nextStep, prevStep, removeGarantia } from '../../../src/store/slices/simuladorSlice';

const getIconForGarantia = (nome: string) => {
  const n = nome.toLowerCase();
  if (n.includes('avalista') || n.includes('fiador') || n.includes('aval')) return 'person-add-alt-1';
  if (n.includes('rural')) return 'landscape';
  if (n.includes('urbano')) return 'home-work';
  if (n.includes('máquina') || n.includes('maquina') || n.includes('equipamento') || n.includes('alienação fiduciária')) return 'precision-manufacturing';
  if (n.includes('veículo') || n.includes('veiculo')) return 'directions-car';
  if (n.includes('penhor') || n.includes('animais') || n.includes('safra')) return 'pets';
  if (n.includes('fundo') || n.includes('fgi') || n.includes('fampe') || n.includes('proagro')) return 'shield';
  return 'verified';
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function GarantiaScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { step, produtoSelecionadoId, garantiasSelecionadas, valorDesejado } = useSelector((state: RootState) => state.simulador);

  const { data, isLoading, isError } = useProdutoDetalhes(produtoSelecionadoId);

  const [modalVisible, setModalVisible] = useState(false);
  const [tipoGarantia, setTipoGarantia] = useState<string>('');
  const [descricao, setDescricao] = useState('');
  const [valorGarantiaStr, setValorGarantiaStr] = useState('');

  const garantiasDisponiveis = data?.garantias_exigidas?.tipos_aceitos ? [...data.garantias_exigidas.tipos_aceitos] : [];


  if (garantiasDisponiveis.length === 0) {
    garantiasDisponiveis.push('Alienação Fiduciária', 'Hipoteca', 'Avalista', 'Penhor Agrícola');
  }

  if (data?.garantias_exigidas?.fundo_garantidor_disponivel) {
    const nomeFundo = data.garantias_exigidas.fundo_garantidor_nome || 'Fundo de Aval';
    if (!garantiasDisponiveis.includes(nomeFundo)) {
      garantiasDisponiveis.push(nomeFundo);
    }
  }

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const handleContinue = () => {
    dispatch(nextStep());
    router.push('/(credito)/simulador/resumo');
  };

  const handleAddGarantia = () => {
    if (!tipoGarantia || !descricao || !valorGarantiaStr) return;

    // Corrige a regex que também estava errada (\\D)
    const numericValue = valorGarantiaStr.replace(/\D/g, '');
    const valor = Number(numericValue) / 100;

    if (isNaN(valor) || valor <= 0) return;

    dispatch(addGarantia({ tipo: tipoGarantia, descricao, valor }));
    setModalVisible(false);
    setTipoGarantia('');
    setDescricao('');
    setValorGarantiaStr('');
  };

  const handleValorChange = (text: string) => {
    let digits = text.replace(/\D/g, '');

    if (!digits) {
      setValorGarantiaStr('');
      return;
    }

    // Converte para inteiro para remover zeros à esquerda
    const numberValue = parseInt(digits, 10);
    if (isNaN(numberValue)) {
      setValorGarantiaStr('');
      return;
    }

    // Garante no mínimo 3 dígitos para formatar os centavos
    digits = numberValue.toString().padStart(3, '0');

    const integerPart = digits.slice(0, -2);
    const decimalPart = digits.slice(-2);

    // Expressão regular universal e segura para formato de milhares brasileiro (ponto)
    const formattedInteger = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    setValorGarantiaStr(`${formattedInteger},${decimalPart}`);
  };

  const handleRemove = (id: string) => {
    dispatch(removeGarantia(id));
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white">
        <SimuladorStepperHeader currentStep={step} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0A3D24" />
          <Text className="text-gray-500 mt-4">Carregando requisitos de garantia...</Text>
        </View>
      </View>
    );
  }

  if (isError || !data?.garantias_exigidas) {
    return (
      <View className="flex-1 bg-white">
        <SimuladorStepperHeader currentStep={step} />
        <View className="flex-1 justify-center items-center px-6">
          <MaterialIcons name="error-outline" size={48} color="#EF4444" />
          <Text className="text-red-500 text-center mt-4">Não foi possível carregar as regras de garantia para este produto.</Text>
          <TouchableOpacity onPress={handleBack} className="mt-8 py-3 px-6 rounded-full border border-gray-300">
            <Text className="text-gray-700 font-bold">Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const minGarantiaObrigatoria = data.garantias_exigidas.garantia_valor_minimo_obrigatorio;
  // minGarantiaObrigatoria == 0 significa que é SEMPRE obrigatória independente do valor.
  const isObrigatorio = data.garantias_exigidas.garantia_real_obrigatoria && (minGarantiaObrigatoria === 0 || valorDesejado >= (minGarantiaObrigatoria || 99999999));

  const coberturaNecessaria = data.garantias_exigidas.cobertura_maxima_exigida || 100;
  const valorTotalExigido = valorDesejado * (coberturaNecessaria / 100);

  const somaGarantias = garantiasSelecionadas.reduce((acc, curr) => acc + curr.valor, 0);
  const progresso = Math.min((somaGarantias / valorTotalExigido) * 100, 100);

  const isSuficiente = somaGarantias >= valorTotalExigido;
  const podeContinuar = isObrigatorio ? isSuficiente : true;

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={step} />

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">Garantias</Text>
        <Text className="text-[16px] text-gray-500 mb-6">Cadastre os bens que servirão de garantia para esta operação.</Text>

        <View className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-row mb-6">
          <MaterialIcons name="info-outline" size={18} color="#2563EB" />
          <Text className="text-blue-700 text-[13px] ml-2 flex-1 leading-relaxed">
            {isObrigatorio
              ? (minGarantiaObrigatoria === 0 ? 'Para esta modalidade, a apresentação de Garantia é obrigatória.' : `Garantia real exigida para financiamentos a partir de ${formatCurrency(minGarantiaObrigatoria!)}.`)
              : 'Garantias são opcionais para este simulador, mas podem ajudar a aprovar seu crédito.'}
          </Text>
        </View>

        {isObrigatorio && (
          <View className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-6 shadow-sm">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 font-medium">Suficiência da Garantia</Text>
              <Text className={`font-bold ${isSuficiente ? 'text-green-600' : 'text-red-500'}`}>
                {progresso.toFixed(0)}%
              </Text>
            </View>
            <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
              <View className={`h-full ${isSuficiente ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${progresso}%` }} />
            </View>
            <Text className="text-[12px] text-gray-500 text-center">
              Necessário: <Text className="font-bold text-gray-800">{formatCurrency(valorTotalExigido)}</Text> ({coberturaNecessaria}%)
            </Text>
          </View>
        )}

        {garantiasSelecionadas.length > 0 && (
          <View className="mb-6">
            <Text className="text-[16px] font-bold text-gray-800 mb-3">Bens adicionados</Text>
            {garantiasSelecionadas.map((g) => (
              <View key={g.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
                <View className="w-12 h-12 rounded-full bg-[#E8F3EB] items-center justify-center mr-3">
                  <MaterialIcons name={getIconForGarantia(g.tipo) as any} size={24} color="#0A3D24" />
                </View>
                <View className="flex-1">
                  <Text className="text-[12px] text-gray-500 font-medium">{g.tipo}</Text>
                  <Text className="text-[15px] font-bold text-gray-800" numberOfLines={1}>{g.descricao}</Text>
                  <Text className="text-[14px] font-bold text-[#0A3D24] mt-1">{formatCurrency(g.valor)}</Text>
                </View>
                <TouchableOpacity onPress={() => handleRemove(g.id)} className="p-2">
                  <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {garantiasDisponiveis.length > 0 ? (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="flex-row justify-center items-center p-4 border-2 border-dashed border-[#0A3D24] rounded-xl mb-6 bg-[#E8F3EB]/30"
          >
            <MaterialIcons name="add-circle-outline" size={24} color="#0A3D24" />
            <Text className="ml-2 font-bold text-[#0A3D24] text-[16px]">Adicionar Garantia</Text>
          </TouchableOpacity>
        ) : (
          <View className="items-center py-6">
            <Text className="text-gray-400 text-center">Nenhuma garantia permitida para este produto.</Text>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      {/* Modal de Adicionar Garantia */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 min-h-[60%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[20px] font-bold text-gray-900">Nova Garantia</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2">
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-[14px] font-bold text-gray-700 mb-2">Tipo de Garantia</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {garantiasDisponiveis.map((tipo, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setTipoGarantia(tipo)}
                    className={`mr-3 px-4 py-2 rounded-full border ${tipoGarantia === tipo ? 'border-[#0A3D24] bg-[#0A3D24]' : 'border-gray-300 bg-white'}`}
                  >
                    <Text className={`font-medium ${tipoGarantia === tipo ? 'text-white' : 'text-gray-600'}`}>{tipo}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text className="text-[14px] font-bold text-gray-700 mb-2">Descrição do Bem</Text>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Ex: Trator John Deere 2021"
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-[16px] text-gray-900"
              />

              <Text className="text-[14px] font-bold text-gray-700 mb-2">Valor Estimado do Bem</Text>
              <View className="relative justify-center mb-8">
                <Text className="absolute left-4 font-bold text-gray-500 text-[16px] z-10">R$</Text>
                <TextInput
                  value={valorGarantiaStr}
                  onChangeText={handleValorChange}
                  keyboardType="numeric"
                  placeholder="0,00"
                  style={{ paddingLeft: 42, height: 56 }}
                  className="bg-gray-50 border border-gray-200 rounded-xl pr-4 text-[16px] text-gray-900 justify-center"
                />
              </View>

              <TouchableOpacity
                onPress={handleAddGarantia}
                disabled={!tipoGarantia || !descricao || !valorGarantiaStr}
                className={`py-4 rounded-full items-center mb-10 ${(!tipoGarantia || !descricao || !valorGarantiaStr) ? 'bg-gray-300' : 'bg-[#0A3D24]'}`}
              >
                <Text className="text-white font-bold text-[16px]">Salvar Garantia</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row gap-4"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 16 }}
      >
        <TouchableOpacity onPress={handleBack} className="flex-1 py-4 rounded-full items-center border border-gray-800 bg-white" activeOpacity={0.8}>
          <Text className="text-gray-800 font-bold text-[16px]">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!podeContinuar}
          onPress={handleContinue}
          className={`flex-1 py-4 rounded-full items-center ${podeContinuar ? 'bg-[#0A3D24]' : 'bg-gray-400'}`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
