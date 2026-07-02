import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../src/store';
import { setEndereco } from '../../../../../src/store/slices/complementoSlice';
import { updateProposal } from '../../../../../src/services/proposalService';

const formatCEP = (v: string) => {
  const digits = v.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
};

export default function EnderecoComplementoScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { id, produto_id, tipo_produto } = params;

  const enderecoState = useSelector((state: RootState) => state.complemento);
  
  const [cep, setCepInput] = useState(enderecoState.cep || '');
  const [logradouro, setLogradouro] = useState(enderecoState.logradouro || '');
  const [bairro, setBairro] = useState(enderecoState.bairro || '');
  const [cidade, setCidade] = useState(enderecoState.cidade || '');
  const [uf, setUfInput] = useState(enderecoState.uf || '');
  const [numero, setNumero] = useState(enderecoState.numero || '');
  const [complemento, setComplemento] = useState(enderecoState.complemento || '');

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCep = async (cepStr: string) => {
    const cleanCep = cepStr.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setLogradouro(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setUfInput(data.uf || '');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleCepChange = (text: string) => {
    const formatted = formatCEP(text);
    setCepInput(formatted);
    if (formatted.length === 9) {
      fetchCep(formatted);
    }
  };

  const saveToBackend = async () => {
    const payload = {
      zip: cep.replace(/\D/g, ''),
      state: uf,
      city: cidade,
      neighborhood: bairro,
      address: logradouro,
      addressInfo: {
        numero,
        complemento,
      }
    };
    if (id) {
      await updateProposal(id as string, payload);
    }
  };

  const handleContinue = async () => {
    dispatch(
      setEndereco({
        cep,
        logradouro,
        bairro,
        cidade,
        uf,
        numero,
        complemento,
      })
    );

    setIsSubmitting(true);
    try {
      await saveToBackend();
      router.push({
        pathname: `/(credito)/proposta/${id}/complemento/contato` as any,
        params: { produto_id, tipo_produto },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndExit = async () => {
    dispatch(setEndereco({ cep, logradouro, bairro, cidade, uf, numero, complemento }));
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

  const isValid = cep.length === 9 && logradouro && bairro && cidade && uf && numero;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between mb-6 mt-4">
          <View className="flex-row items-center flex-1 mr-8">
            <View className="h-2 flex-1 bg-[#92dc49] rounded-full mr-1" />
            <View className="h-2 flex-1 bg-[#92dc49] rounded-full mx-1" />
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
          Onde o crédito será aplicado?
        </Text>
        <Text className="text-[16px] text-gray-500 mb-8">
          Preencha o CEP para carregarmos o endereço automaticamente.
        </Text>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">CEP</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14">
              <TextInput
                className="flex-1 text-[16px] text-gray-900"
                keyboardType="numeric"
                value={cep}
                onChangeText={handleCepChange}
                placeholder="00000-000"
                placeholderTextColor="#9CA3AF"
                maxLength={9}
              />
              {isLoadingCep && <ActivityIndicator size="small" color="#92dc49" />}
            </View>
          </View>

          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Logradouro</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
              <TextInput
                className="text-[16px] text-gray-900"
                value={logradouro}
                onChangeText={setLogradouro}
                placeholder="Ex: Rua das Flores"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-[2]">
              <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Número</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  className="text-[16px] text-gray-900"
                  value={numero}
                  onChangeText={setNumero}
                  placeholder="Ex: 123"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View className="flex-[3]">
              <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Complemento</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  className="text-[16px] text-gray-900"
                  value={complemento}
                  onChangeText={setComplemento}
                  placeholder="Ex: Sala 2"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Bairro</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
              <TextInput
                className="text-[16px] text-gray-900"
                value={bairro}
                onChangeText={setBairro}
                placeholder="Ex: Centro"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-[3]">
              <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Cidade</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  className="text-[16px] text-gray-900"
                  value={cidade}
                  onChangeText={setCidade}
                  placeholder="Ex: São Paulo"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View className="flex-[1]">
              <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">UF</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
                <TextInput
                  className="text-[16px] text-gray-900 text-center"
                  value={uf}
                  onChangeText={setUfInput}
                  placeholder="SP"
                  placeholderTextColor="#9CA3AF"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>
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
          className={`flex-[2] py-4 rounded-full flex-row items-center justify-center ${
            isValid && !isSubmitting ? 'bg-[#92dc49]' : 'bg-gray-300'
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
