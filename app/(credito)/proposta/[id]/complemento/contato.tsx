import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { triggerAgronavis, triggerXcurve, updateProposal } from '../../../../../src/services/proposalService';
import { RootState } from '../../../../../src/store';
import { resetComplemento, setContato } from '../../../../../src/store/slices/complementoSlice';

const formatPhone = (v: string) => {
  const digits = v.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

export default function ContatoComplementoScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const { id, produto_id } = params;

  const authUser = useSelector((state: RootState) => state.auth.user);
  const complemento = useSelector((state: RootState) => state.complemento);

  const [telefone, setTelefoneInput] = useState(complemento.telefone || '');
  const [email, setEmail] = useState(complemento.email || authUser?.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prodId = typeof produto_id === 'string' ? produto_id.toUpperCase() : '';
  const isRural = prodId.includes('RURAL') || prodId.includes('AGRO') || prodId.includes('FNO');

  const handlePhoneChange = (text: string) => {
    setTelefoneInput(formatPhone(text));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    dispatch(setContato({ telefone, email }));

    try {
      // Prepara payload baseado no estado acumulado
      const payload: any = {
        email,
        phone: telefone.replace(/\D/g, ''),
        zip: complemento.cep.replace(/\D/g, ''),
        state: complemento.uf,
        city: complemento.cidade,
        neighborhood: complemento.bairro,
        address: complemento.logradouro,

        // No back-end o AddressInfo pode acumular numero e complemento
        addressInfo: {
          numero: complemento.numero,
          complemento: complemento.complemento,
        },

        companyName: complemento.nomeRazaoSocial,
        revenue: complemento.faturamento,
        documentNumber: complemento.cpfCnpj,
      };

      if (complemento.culturaPrincipal) {
        payload.industry = complemento.culturaPrincipal; // Ou segment/cultura apropriado na API
      }

      if (complemento.tamanhoColaboradores) {
        payload.size = complemento.tamanhoColaboradores;
      }

      const proposalId = typeof id === 'string' ? id : String(id);

      // 1. Atualiza a proposta (PUT)
      await updateProposal(proposalId, payload);

      // 2. Dispara motores (Fire and Forget)
      triggerXcurve(complemento.cpfCnpj);
      if (isRural) {
        triggerAgronavis(complemento.cpfCnpj);
      }

      // 3. Limpa estado temporário
      dispatch(resetComplemento());

      // 4. Redireciona para documentos
      router.replace({
        pathname: `/(credito)/proposta/${proposalId}/documentos` as any,
        params: { produto_id },
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao atualizar proposta.');
      setIsSubmitting(false);
    }
  };

  const saveToBackend = async () => {
    const payload = {
      email,
      phone: telefone.replace(/\D/g, ''),
    };
    const proposalId = typeof id === 'string' ? id : String(id);
    await updateProposal(proposalId, payload);
  };

  const handleSaveAndExit = async () => {
    dispatch(setContato({ telefone, email }));
    setIsSubmitting(true);
    try {
      await saveToBackend();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      router.replace("/(tabs)/credito");
    }
  };

  const isValid = telefone.replace(/\D/g, '').length >= 10 && email.includes('@');

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
            <View className="h-2 flex-1 bg-[#92dc49] rounded-full ml-1" />
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
          Informações de Contato
        </Text>
        <Text className="text-[16px] text-gray-500 mb-8">
          Para finalizarmos, como o seu gerente deve entrar em contato com você?
        </Text>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">Telefone (Celular)</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
              <TextInput
                className="text-[16px] text-gray-900"
                keyboardType="numeric"
                value={telefone}
                onChangeText={handlePhoneChange}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#9CA3AF"
                maxLength={15}
              />
            </View>
          </View>

          <View>
            <Text className="text-[14px] text-gray-700 font-bold mb-1 ml-1">E-mail</Text>
            <View className="bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 justify-center">
              <TextInput
                className="text-[16px] text-gray-900"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {error && (
          <View className="bg-red-50 p-4 rounded-xl mb-4">
            <Text className="text-red-600 text-center font-medium">{error}</Text>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex-row gap-4"
        style={{ paddingBottom: Platform.OS === 'ios' ? 32 : 16 }}
      >
        <TouchableOpacity
          disabled={isSubmitting}
          onPress={() => router.back()}
          className="flex-[1] py-4 rounded-full items-center border border-gray-800 bg-white"
          activeOpacity={0.8}
        >
          <Text className="text-gray-800 font-bold text-[16px]">Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!isValid || isSubmitting}
          onPress={handleFinish}
          className={`flex-[2] py-4 rounded-full items-center flex-row justify-center ${isValid && !isSubmitting ? 'bg-[#92dc49]' : 'bg-gray-300'
            }`}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          ) : null}
          <Text className="text-white font-bold text-[16px]">Finalizar Cadastro</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
