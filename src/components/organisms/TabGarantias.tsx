import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from '../../services/api';
import { getProposalById, updateProposal } from '../../services/proposalService';
import { PropostaModel } from '../../utils/propostaMockData';

interface TabGarantiasProps {
  proposta: PropostaModel;
}

export default function TabGarantias({ proposta }: TabGarantiasProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: '', type: '', estimatedValue: '' });
  const [tiposGarantia, setTiposGarantia] = useState<string[]>([]);
  const [fetchingTipos, setFetchingTipos] = useState(false);
  const queryClient = useQueryClient();

  // Carrega as opções de garantia baseado no produto assim que abrir o modal
  React.useEffect(() => {
    if (modalVisible) {
      const carregarTiposGarantia = async () => {
        setFetchingTipos(true);
        let tipos: string[] = [];
        try {
          const proposal = await getProposalById(proposta.id);
          let produtoId = null;
          if (proposal.metadata) {
            const meta = typeof proposal.metadata === 'string' ? JSON.parse(proposal.metadata) : proposal.metadata;
            produtoId = meta.produto_id;
          }

          if (produtoId) {
            try {
              const { data } = await api.get(`/v1/simulador/produtos/${produtoId}/detalhes`);
              if (data?.garantias_exigidas?.tipos_aceitos && data.garantias_exigidas.tipos_aceitos.length > 0) {
                tipos = data.garantias_exigidas.tipos_aceitos;
              }
            } catch (apiError) {
              console.warn('Erro ao buscar produto na API:', apiError);
            }
          }
        } catch (e) {
          console.warn('Erro ao carregar proposta para garantias:', e);
        } finally {
          // Fallback robusto: se a API falhar ou não retornar
          if (tipos.length === 0) {
            const tiposExistentes = (proposta.garantias || []).map(g => g.tipo).filter(Boolean);
            tipos = [...new Set(tiposExistentes)];

            if (tipos.length === 0) {
              tipos = ['Alienação Fiduciária', 'Hipoteca', 'Avalista', 'Penhor Agrícola'];
            }
          }

          setTiposGarantia(tipos);
          if (tipos.length > 0 && !form.type) {
            setForm(prev => ({ ...prev, type: tipos[0] }));
          }
          setFetchingTipos(false);
        }
      };
      carregarTiposGarantia();
    }
  }, [modalVisible, proposta.id]);

  const handleAddGuarantee = async () => {
    if (!form.description || !form.estimatedValue || !form.type) {
      Alert.alert('Atenção', 'Preencha todos os campos da garantia e selecione um tipo.');
      return;
    }

    const valorNumerico = parseFloat(form.estimatedValue.replace(/[R$\s.]/g, '').replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    try {
      setLoading(true);
      // Busca o payload original
      const currentProposal = await getProposalById(proposta.id);

      const novaGarantia = {
        description: form.description,
        type: form.type, // O tipo de garantia selecionado baseado no Produto
        estimatedValue: valorNumerico
      };

      const updatedGuarantees = [...(currentProposal.guarantees || []), novaGarantia];

      // Envia APENAS o array de garantias atualizado no payload
      // A rota suporta updates parciais, isso evita conflitos de validação (ex: requestedValue que vem como string da API)
      const payload = {
        guarantees: updatedGuarantees
      };

      await updateProposal(proposta.id, payload as any);

      queryClient.invalidateQueries({ queryKey: ['proposta', proposta.id] });
      setModalVisible(false);
      setForm({ description: '', type: '', estimatedValue: '' });
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Não foi possível salvar a garantia.';
      Alert.alert('Erro ao Salvar', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number) => {
    if (isNaN(value)) return 'R$ 0,00';
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2).replace('.', ',')} mi`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)} mil`;
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const handleValueChange = (text: string) => {
    const numericValue = text.replace(/\D/g, '');
    if (!numericValue) {
      setForm({ ...form, estimatedValue: '' });
      return;
    }
    const floatValue = parseFloat(numericValue) / 100;
    const formatted = floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    setForm({ ...form, estimatedValue: formatted });
  };

  const totalGarantias = proposta.garantias.reduce((acc, g) => acc + (g.valor || 0), 0);
  const ltv = proposta.valorSolicitado > 0 ? ((totalGarantias / proposta.valorSolicitado) * 100).toFixed(0) : '0';

  return (
    <ScrollView className="bg-gray-50 flex-1" contentContainerStyle={{ padding: 16 }}>
      {/* KPIs Minimalistas */}
      <View className="flex-row items-center justify-between mb-6 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <KpiMini label="Financiado" valor={formatValue(proposta.valorSolicitado)} color="#4B5563" icon="monetization-on" />
        <View className="w-[1px] h-8 bg-gray-100" />
        <KpiMini label="Garantias" valor={formatValue(totalGarantias)} color="#10B981" icon="security" />
        <View className="w-[1px] h-8 bg-gray-100" />
        <KpiMini label="LTV Atual" valor={`${ltv}%`} color={Number(ltv) >= 120 ? '#10B981' : '#F59E0B'} icon="show-chart" />
      </View>

      <Text className="font-bold text-[16px] text-gray-800 mb-4">Garantias Vinculadas</Text>

      {/* Lista de Garantias */}
      {proposta.garantias.length === 0 ? (
        <View className="bg-white rounded-xl p-6 border border-gray-100 items-center justify-center">
          <MaterialIcons name="security" size={40} color="#D1D5DB" />
          <Text className="text-gray-500 font-medium mt-3 text-[14px]">Nenhuma garantia vinculada.</Text>
        </View>
      ) : (
        proposta.garantias.map((gar) => (
          <View key={gar.id} className="bg-white rounded-xl p-4 mb-3 border border-gray-100 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-3">
                <MaterialIcons name="security" size={20} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-gray-700 text-[14px] mb-1" numberOfLines={1} ellipsizeMode="tail">{gar.descricao}</Text>
                <Text className="text-brand-dark font-black text-[15px] mb-0.5">{formatValue(gar.valor)}</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-400 text-[11px] font-medium mr-2" numberOfLines={1}>{gar.tipo}</Text>
                  <View className="w-1 h-1 bg-gray-300 rounded-full mr-2" />
                  <Text className="text-green-600 font-bold text-[11px]">Cob: {gar.cobertura}</Text>
                </View>
              </View>
            </View>
          </View>
        ))
      )}

      {/* Botão para Adicionar Nova Garantia */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="mt-2 py-3 px-4 rounded-xl border border-dashed border-gray-300 flex-row items-center justify-center bg-gray-50 mb-4"
      >
        <MaterialIcons name="add" size={20} color="#6B7280" />
        <Text className="text-gray-600 font-medium ml-2">Adicionar nova garantia</Text>
      </TouchableOpacity>

      {/* Parecer Técnico */}
      {proposta.garantias.length > 0 && (
        <View className="bg-white rounded-xl p-4 mt-2 border border-green-200 shadow-sm">
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="check-circle" size={18} color="#10B981" />
            <Text className="font-bold text-gray-800 text-[14px] ml-2">Parecer do Sistema</Text>
          </View>
          <Text className="text-gray-600 text-[13px] leading-relaxed">
            Garantias mapeadas. LTV de {ltv}% {Number(ltv) >= 120 ? 'atende ao' : 'está abaixo do'} mínimo exigido de 120% pelo produto.
          </Text>
        </View>
      )}

      {/* Modal de Adicionar Garantia */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-6 min-h-[60%]">
              <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[18px] font-bold text-gray-900">Nova Garantia</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View className="mb-4">
                <Text className="text-gray-700 font-medium text-[14px] mb-2">Descrição do Bem</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-800"
                  placeholder="Ex: Apartamento em São Paulo"
                  value={form.description}
                  onChangeText={(t) => setForm({ ...form, description: t })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 font-medium text-[14px] mb-2">Tipo de Garantia Aceito</Text>
                {fetchingTipos ? (
                  <ActivityIndicator size="small" color="#10B981" className="self-start mt-2" />
                ) : tiposGarantia.length > 0 ? (
                  <View className="flex-row flex-wrap gap-2">
                    {tiposGarantia.map((tipo, idx) => {
                      const isSelected = form.type === tipo;
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => setForm({ ...form, type: tipo })}
                          className={`px-4 py-2 rounded-lg border ${isSelected ? 'border-[#10B981] bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                        >
                          <Text className={`font-medium text-[13px] ${isSelected ? 'text-[#10B981]' : 'text-gray-600'}`}>{tipo}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <Text className="text-gray-500 text-[13px] mt-1">Nenhum tipo de garantia configurado para este produto.</Text>
                )}
              </View>

              <View className="mb-6">
                <Text className="text-gray-700 font-medium text-[14px] mb-2">Valor Estimado (R$)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-800"
                  placeholder="R$ 0,00"
                  keyboardType="numeric"
                  value={form.estimatedValue}
                  onChangeText={handleValueChange}
                />
              </View>

              <TouchableOpacity
                disabled={loading}
                onPress={handleAddGuarantee}
                className={`py-4 rounded-xl items-center justify-center flex-row shadow-sm ${loading ? 'bg-gray-400' : 'bg-[#10B981]'}`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
                    <Text className="text-white font-bold text-[16px] ml-2">Vincular Garantia</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

function KpiMini({ label, valor, color, icon }: { label: string, valor: string, color: string, icon: string }) {
  return (
    <View className="items-center justify-center px-2">
      <View className="flex-row items-center mb-1">
        <MaterialIcons name={icon as any} size={14} color={color} />
        <Text className="font-bold text-[16px] ml-1.5" style={{ color }} numberOfLines={1}>{valor}</Text>
      </View>
      <Text className="font-medium text-[10px] text-gray-500 uppercase tracking-wider">{label}</Text>
    </View>
  );
}
