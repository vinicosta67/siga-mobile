import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateProposal } from '../../../../../src/services/proposalService';
import { RootState } from '../../../../../src/store';
import { setNegocio } from '../../../../../src/store/slices/complementoSlice';
import { useProdutoDetalhes } from '../../../../../src/hooks/queries/useSimulador';

export default function NegocioComplementoScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { id, produto_id } = params;

  const negocioState = useSelector((state: RootState) => state.complemento);

  const { data: produtoData, isLoading: isLoadingProduto } = useProdutoDetalhes(produto_id as string);
  
  const publicoAlvo = (produtoData?.publico_alvo || '').toUpperCase();
  const exclusivelyPF = publicoAlvo.includes('FÍSICA') && !publicoAlvo.includes('JURÍDICA');
  const exclusivelyPJ = publicoAlvo.includes('JURÍDICA') && !publicoAlvo.includes('FÍSICA');

  const allowPF = !exclusivelyPJ;
  const allowPJ = !exclusivelyPF;

  // Determinar o defaultTipo
  let defaultTipo: 'PF' | 'PJ' = 'PF';
  if (!allowPF && allowPJ) defaultTipo = 'PJ';
  else if (allowPF && !allowPJ) defaultTipo = 'PF';
  else {
    // Fallback original se ambos são permitidos ou se não tem publicoAlvo
    const prodIdStr = typeof produto_id === 'string' ? produto_id.toUpperCase() : '';
    if (prodIdStr.includes('PJ') || prodIdStr.includes('EMPRESA')) {
      defaultTipo = 'PJ';
    }
  }

  const [tipoPessoa, setTipoPessoa] = useState<'PF' | 'PJ'>(negocioState.tipoPessoa || defaultTipo);

  const [documento, setDocumento] = useState(negocioState.cpfCnpj || '');
  const [nome, setNome] = useState(negocioState.nomeRazaoSocial || '');
  const [faturamento, setFaturamento] = useState(negocioState.faturamento ? String(negocioState.faturamento) : '');
  const [cultura, setCultura] = useState(negocioState.culturaPrincipal || '');
  const [tamanho, setTamanho] = useState(negocioState.tamanhoColaboradores || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDoc = (v: string, tipo: 'PF' | 'PJ') => {
    const digits = v.replace(/\D/g, '');
    if (tipo === 'PF') {
      return digits.slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return digits.slice(0, 14)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  };

  const handleDocChange = (text: string) => {
    setDocumento(formatDoc(text, tipoPessoa));
  };

  const handleFaturamentoChange = (text: string) => {
    const numeric = text.replace(/\D/g, '');
    if (!numeric) {
      setFaturamento('');
      return;
    }
    const val = parseFloat(numeric) / 100;
    setFaturamento(val.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  };

  const saveToBackend = async () => {
    const payload = {
      companyName: nome,
      revenue: faturamento ? parseFloat(faturamento.replace(/\./g, '').replace(',', '.')) : 0,
      clientDocumentNumber: documento.replace(/\D/g, ''),
      industry: cultura,
      size: tamanho,
    };
    if (id) {
      await updateProposal(id as string, payload);
    }
  };

  const handleContinue = async () => {
    dispatch(
      setNegocio({
        tipoPessoa,
        cpfCnpj: documento.replace(/\D/g, ''),
        nomeRazaoSocial: nome,
        faturamento: faturamento ? parseFloat(faturamento.replace(/\./g, '').replace(',', '.')) : 0,
        culturaPrincipal: cultura,
        tamanhoColaboradores: tamanho,
      })
    );

    setIsSubmitting(true);
    try {
      await saveToBackend();
      router.push({
        pathname: `/(credito)/proposta/${id}/complemento/endereco` as any,
        params,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndExit = async () => {
    dispatch(
      setNegocio({
        tipoPessoa,
        cpfCnpj: documento.replace(/\D/g, ''),
        nomeRazaoSocial: nome,
        faturamento: faturamento ? parseFloat(faturamento.replace(/\./g, '').replace(',', '.')) : 0,
        culturaPrincipal: cultura,
        tamanhoColaboradores: tamanho,
      })
    );
    setIsSubmitting(true);
    try {
      await saveToBackend();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      router.replace("/(tabs)/credito");
    }
  };

  const isDocValid = tipoPessoa === 'PF' ? documento.replace(/\D/g, '').length === 11 : documento.replace(/\D/g, '').length === 14;
  const isNomeValid = nome.length > 3;
  const isFaturamentoValid = faturamento.length > 0;

  let isValid = isDocValid && isNomeValid && isFaturamentoValid;
  if (!cultura && publicoAlvo.includes('RURAL')) isValid = false; // Se for rural, exige cultura
  if (tipoPessoa === 'PJ' && !tamanho) isValid = false;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-6 mt-4">
          <View className="flex-row items-center flex-1 mr-8">
            <View className="h-2 flex-1 bg-[#92dc49] rounded-full mr-1" />
            <View className="h-2 flex-1 bg-gray-200 rounded-full mx-1" />
            <View className="h-2 flex-1 bg-gray-200 rounded-full ml-1" />
          </View>
          <TouchableOpacity
            onPress={handleSaveAndExit}
            disabled={isSubmitting}
            className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#4B5563" className="mr-1" />
            ) : (
              <Text className="text-gray-600 font-bold text-[12px] mr-1">Salvar e Sair</Text>
            )}
            <MaterialIcons name="close" size={16} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <Text className="text-[32px] font-bold text-gray-900 mb-2 leading-tight">
          Detalhes do Negócio
        </Text>
        <Text className="text-[16px] text-gray-500 mb-8">
          Precisamos identificar {allowPF && allowPJ ? 'o produtor/empresa' : tipoPessoa === 'PJ' ? 'a empresa' : 'o cliente'} para a análise de crédito.
        </Text>
        <View className="space-y-6 mb-8">
          {isLoadingProduto ? (
            <ActivityIndicator size="small" color="#92dc49" />
          ) : (allowPF && allowPJ) ? (
            <View className="flex-row gap-4 mb-2">
              <TouchableOpacity
                onPress={() => { setTipoPessoa('PF'); setDocumento(''); }}
                className={`flex-1 py-3 rounded-xl border flex-row justify-center items-center ${tipoPessoa === 'PF' ? 'border-[#92dc49] bg-[#92dc49]/10' : 'border-gray-200'}`}
              >
                <MaterialIcons name="person" size={20} color={tipoPessoa === 'PF' ? '#0A3D24' : '#9CA3AF'} />
                <Text className={`ml-2 font-bold ${tipoPessoa === 'PF' ? 'text-[#0A3D24]' : 'text-gray-400'}`}>Pessoa Física</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setTipoPessoa('PJ'); setDocumento(''); }}
                className={`flex-1 py-3 rounded-xl border flex-row justify-center items-center ${tipoPessoa === 'PJ' ? 'border-[#92dc49] bg-[#92dc49]/10' : 'border-gray-200'}`}
              >
                <MaterialIcons name="business" size={20} color={tipoPessoa === 'PJ' ? '#0A3D24' : '#9CA3AF'} />
                <Text className={`ml-2 font-bold ${tipoPessoa === 'PJ' ? 'text-[#0A3D24]' : 'text-gray-400'}`}>Pessoa Jurídica</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">{tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
              <TextInput
                className="text-[16px] text-gray-900"
                keyboardType="numeric"
                value={documento}
                onChangeText={handleDocChange}
                placeholder={tipoPessoa === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                placeholderTextColor="#9CA3AF"
                maxLength={tipoPessoa === 'PF' ? 14 : 18}
              />
            </View>
          </View>

          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">{tipoPessoa === 'PF' ? 'Nome Completo' : 'Razão Social'}</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
              <TextInput
                className="text-[16px] text-gray-900"
                value={nome}
                onChangeText={setNome}
                placeholder={tipoPessoa === 'PF' ? 'Ex: João da Silva' : 'Ex: Fazenda Boa Esperança Ltda'}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Faturamento Anual Bruto</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center flex-row items-center">
              <Text className="text-[16px] text-gray-400 mr-2">R$</Text>
              <TextInput
                className="flex-1 text-[16px] text-gray-900"
                keyboardType="numeric"
                value={faturamento}
                onChangeText={handleFaturamentoChange}
                placeholder="0,00"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {(publicoAlvo.includes('RURAL') || (!publicoAlvo && typeof produto_id === 'string' && produto_id.toUpperCase().includes('RURAL'))) && (
            <View>
              <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Cultura Principal (Segmento)</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  className="text-[16px] text-gray-900"
                  value={cultura}
                  onChangeText={setCultura}
                  placeholder="Ex: Soja, Milho, Pecuária de Corte"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          )}

          {tipoPessoa === 'PJ' && (
            <View>
              <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Porte / Número de Colaboradores</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  className="text-[16px] text-gray-900"
                  value={tamanho}
                  onChangeText={setTamanho}
                  placeholder="Ex: 2 a 20 colaboradores"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          )}

        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row gap-4"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 16 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-[1] py-4 rounded-full items-center border border-gray-800 bg-white"
          activeOpacity={0.8}
        >
          <Text className="text-gray-800 font-bold text-[16px]">Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isValid || isSubmitting}
          onPress={handleContinue}
          className={`flex-[2] py-4 rounded-full flex-row items-center justify-center ${isValid && !isSubmitting ? 'bg-[#92dc49]' : 'bg-gray-300'
            }`}
          activeOpacity={0.8}
        >
          {isSubmitting && <ActivityIndicator size="small" color="#ffffff" className="mr-2" />}
          <Text className="text-white font-bold text-[16px]">Continuar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
