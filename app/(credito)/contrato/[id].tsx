import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CreditoMockData } from '@/src/utils/creditoMockData';

import ContratoHeaderCard from '@/src/components/organisms/ContratoHeaderCard';
import TabMenuScrollable, { TabOption } from '@/src/components/molecules/TabMenuScrollable';
import ParcelaListaCard from '@/src/components/organisms/ParcelaListaCard';
import AlertaAtrasoCard from '@/src/components/organisms/AlertaAtrasoCard';

const tabs: TabOption[] = [
  { id: 'parcelas', label: 'Parcelas' },
  { id: 'pagamentos', label: 'Pagamentos' },
  { id: 'gis', label: 'GIS / NDVI' },
  { id: 'nf', label: 'NF Comprov.' },
  { id: 'aging', label: 'Aging' },
  { id: 'cadastros', label: 'Cadastros' },
];

export default function ContratoDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState<string>('parcelas');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'fornecedor' | 'comprador'>('fornecedor');
  const [actionModal, setActionModal] = useState<'pagar' | 'boleto' | 'debito' | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Na vida real, faria um fetch pelo ID. Aqui usamos o mock ativo.
  const contrato = CreditoMockData.contratoAtivo;
  
  const [isDebitoAtivo, setIsDebitoAtivo] = useState(contrato.debitoAutomatico);

  const handleAction = (action: string) => {
    if (action === 'download') {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      setActionModal(action as any);
    }
  };

  const openCadastroModal = (type: 'fornecedor' | 'comprador') => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'parcelas':
        return (
          <View className="px-4 mt-4">
            <AlertaAtrasoCard 
              quantidadeAtraso={contrato.parcelasEmAtraso} 
              onPagar={() => console.log('Pagar atraso')} 
            />
            {contrato.parcelas.map(p => (
              <ParcelaListaCard key={p.numero} parcela={p} />
            ))}
          </View>
        );

      case 'pagamentos':
        return (
          <View className="px-4 mt-4">
            <View className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
              <View className="flex-row justify-between mb-4">
                <View>
                  <Text className="text-[12px] text-gray-400">Valor contratado</Text>
                  <Text className="text-[15px] font-bold text-gray-800">
                    R$ {contrato.valorContratado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <View>
                  <Text className="text-[12px] text-gray-400 text-right">Total pago</Text>
                  <Text className="text-[15px] font-bold text-gray-800 text-right">
                    R$ {(contrato.valorContratado - contrato.saldoDevedor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-[12px] text-gray-400">Saldo devedor</Text>
                  <Text className="text-[15px] font-bold text-gray-800">
                    R$ {contrato.saldoDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <View>
                  <Text className="text-[12px] text-gray-400 text-right">Débito automático</Text>
                  <Text className="text-[15px] font-bold text-brand-dark text-right">
                    {contrato.debitoAutomatico ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
            </View>

            <Text className="font-bold text-[16px] text-gray-800 mb-4">Extrato de transações</Text>
            {contrato.transacoes.map((t, i) => (
              <View key={i} className="bg-white p-4 rounded-xl border border-gray-100 mb-2 flex-row justify-between items-center shadow-sm">
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
                    <MaterialIcons name={t.tipo === 'pagamento' ? 'arrow-upward' : 'arrow-downward'} size={20} color={t.tipo === 'pagamento' ? '#16A34A' : '#DC2626'} />
                  </View>
                  <View>
                    <Text className="text-[14px] font-bold text-gray-800">{t.descricao}</Text>
                    <Text className="text-[12px] text-gray-400">{t.data.toLocaleDateString('pt-BR')}</Text>
                  </View>
                </View>
                <Text className={`font-bold text-[14px] ${t.tipo === 'pagamento' ? 'text-green-600' : 'text-gray-800'}`}>
                  R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'gis':
        const gis = contrato.monitoramentoGis;
        if (!gis) return <Text className="p-4 text-center text-gray-500">GIS não disponível</Text>;
        
        const historicoNDVI = [
          { data: '01/Jun', valor: 0.72 },
          { data: '17/Jun', valor: 0.75 },
          { data: '03/Jul', valor: 0.68 },
          { data: '19/Jul', valor: 0.71 },
          { data: '04/Ago', valor: 0.65 },
          { data: '20/Ago', valor: 0.58 },
        ];
        
        const historicoEVI = [
          { data: '01/Jun', valor: 0.48 },
          { data: '17/Jun', valor: 0.51 },
          { data: '03/Jul', valor: 0.45 },
          { data: '19/Jul', valor: 0.47 },
          { data: '04/Ago', valor: 0.42 },
          { data: '20/Ago', valor: 0.38 },
        ];

        return (
          <View className="px-4 mt-4">
            {/* Banner Topo */}
            <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex-row items-center">
              <MaterialIcons name="satellite-alt" size={32} color="#22C55E" />
              <View className="flex-1 ml-4">
                <Text className="text-[14px] font-bold text-green-600">Monitoramento: CONFORME</Text>
                <Text className="text-[12px] text-gray-500 mt-0.5">Última imagem: 10/06/2026</Text>
              </View>
              <View className="items-end">
                <Text className="text-[10px] text-gray-400 font-bold mb-0.5">NDVI</Text>
                <Text className="text-[22px] font-bold text-green-500">0.78</Text>
              </View>
            </View>

            {/* Gráficos NDVI / EVI */}
            <View className="bg-white p-4 rounded-xl border border-gray-200 mb-4 shadow-sm">
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="show-chart" size={20} color="#374151" />
                <Text className="font-bold text-[16px] text-gray-800 ml-2">Índice de vegetação (16 dias)</Text>
              </View>
              <Text className="text-[12px] text-gray-400 mb-6 ml-7">Frequência conforme CMN 5.267/2025</Text>

              <Text className="text-[13px] font-bold text-gray-600 mb-3">NDVI (Normalized Difference Vegetation Index)</Text>
              {historicoNDVI.map((item, index) => (
                <ProgressoIndiceBar key={`ndvi-${index}`} data={item.data} valor={item.valor} />
              ))}

              <Text className="text-[13px] font-bold text-gray-600 mb-3 mt-6">EVI (Enhanced Vegetation Index)</Text>
              {historicoEVI.map((item, index) => (
                <ProgressoIndiceBar key={`evi-${index}`} data={item.data} valor={item.valor} isEvi />
              ))}

              <View className="flex-row items-center mt-6 gap-4">
                <View className="flex-row items-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
                  <Text className="text-[11px] text-gray-500">{'> 0.6 Saudável'}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-[#D97706] mr-2" />
                  <Text className="text-[11px] text-gray-500">{'0.3-0.6 Atenção'}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2" />
                  <Text className="text-[11px] text-gray-500">{'< 0.3 Crítico'}</Text>
                </View>
              </View>
            </View>

            {/* Banner PRODES */}
            <View className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="park" size={20} color="#16A34A" />
                <Text className="font-bold text-[14px] text-green-600 ml-2">PRODES / Detecção de Desmatamento</Text>
              </View>
              <Text className="text-[13px] text-green-600">Nenhuma irregularidade detectada na área monitorada.</Text>
              <Text className="text-[13px] text-green-600">Sistema PRODES/DETER em conformidade.</Text>
            </View>

            {/* Cronograma da Safra */}
            <Text className="font-bold text-[16px] text-gray-800 mb-3">Cronograma da safra</Text>
            {gis.cronogramaSafra.map((etapa, idx) => (
              <View key={idx} className="bg-white p-4 rounded-xl border border-gray-200 mb-3 flex-row items-center justify-between shadow-sm">
                <View className="flex-row items-center flex-1">
                  {etapa.percentualConcluido === 100 ? (
                    <MaterialIcons name="check-circle" size={24} color="#22C55E" />
                  ) : (
                    <MaterialIcons name="sync" size={24} color="#2563EB" />
                  )}
                  <View className="ml-3">
                    <Text className="text-[14px] font-bold text-gray-800">{etapa.nome}</Text>
                    <Text className="text-[12px] text-gray-400">
                      {etapa.dataInicioPrevista.getDate()}/{etapa.dataInicioPrevista.getMonth() + 1} - {etapa.dataFimPrevista.getDate()}/{etapa.dataFimPrevista.getMonth() + 1}/{etapa.dataFimPrevista.getFullYear()}
                    </Text>
                  </View>
                </View>
                <View 
                  className="w-12 h-12 rounded-full border-[3px] items-center justify-center"
                  style={{ borderColor: etapa.percentualConcluido === 100 ? '#22C55E' : '#2563EB' }}
                >
                  <Text 
                    className="font-bold text-[11px]"
                    style={{ color: etapa.percentualConcluido === 100 ? '#22C55E' : '#2563EB' }}
                  >
                    {etapa.percentualConcluido}%
                  </Text>
                </View>
              </View>
            ))}

            {/* Alertas GIS */}
            <Text className="font-bold text-[16px] text-gray-800 mb-3 mt-4">Alertas GIS</Text>
            {gis.alertas.map((alerta, idx) => (
              <View key={idx} className="bg-white p-4 rounded-xl border border-blue-200 mb-3 flex-row items-start shadow-sm">
                <MaterialIcons name="info-outline" size={20} color="#2563EB" className="mt-0.5" />
                <View className="flex-1 ml-3 mr-2">
                  <Text className="text-[14px] font-bold text-blue-600 mb-1">{alerta.titulo}</Text>
                  <Text className="text-[12px] text-gray-500">{alerta.descricao}</Text>
                </View>
                <Text className="text-[12px] text-gray-400">{alerta.data.getDate()}/{alerta.data.getMonth() + 1}</Text>
              </View>
            ))}

            {/* Banner CMN */}
            <View className="bg-blue-50 p-4 rounded-xl mb-6 mt-4 flex-row items-start">
              <MaterialIcons name="gavel" size={24} color="#2563EB" />
              <View className="flex-1 ml-3">
                <Text className="text-[14px] font-bold text-blue-700 mb-1">Resolução CMN 5.267/2025</Text>
                <Text className="text-[12px] text-blue-600 leading-relaxed">
                  Monitoramento remoto obrigatório para áreas {'>'} 300 ha. Frequência: imagens NDVI/EVI a cada 16 dias.
                </Text>
              </View>
            </View>

            {/* Info Propriedade */}
            <View className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
              <Text className="font-bold text-[15px] text-gray-800 mb-3">Propriedade Monitorada</Text>
              <InfoRow label="Nome" value={gis.propriedadeNome} />
              <InfoRow label="CAR" value={gis.car} />
              <InfoRow label="Área total" value={`${gis.areaTotalHa} ha`} />
              <InfoRow label="Área financiada" value={`${gis.areaFinanciadaHa} ha`} />
              <InfoRow label="Cultura" value={gis.cultura} />
              <InfoRow label="Safra" value={gis.safra} />
            </View>
          </View>
        );

      case 'cadastros':
        const cGis = contrato.monitoramentoGis;
        if (!cGis) return <Text className="p-4 text-center text-gray-500">Cadastros não disponíveis</Text>;
        return (
          <View className="px-4 mt-4">
            <View className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex-row items-start mb-6">
              <MaterialIcons name="info-outline" size={20} color="#CA8A04" />
              <Text className="flex-1 ml-2 text-[12px] text-yellow-800 leading-relaxed">
                Conforme normativa CMN 5.267, o cadastro de fornecedores e compradores é obrigatório para operações de crédito rural.
              </Text>
            </View>

            <Text className="font-bold text-[16px] text-gray-800 mb-3">Fornecedores</Text>
            {cGis.fornecedores.map(f => (
              <CadastroCard key={f.id} nome={f.nome} doc={f.cpfCnpj} produto={f.produto} status={f.status} />
            ))}
            <TouchableOpacity 
              className="py-3 border border-brand-green rounded-xl items-center mb-6"
              onPress={() => openCadastroModal('fornecedor')}
            >
              <Text className="text-brand-green font-bold text-[14px]">+ Adicionar fornecedor</Text>
            </TouchableOpacity>

            <Text className="font-bold text-[16px] text-gray-800 mb-3">Compradores</Text>
            {cGis.compradores.map(c => (
              <CadastroCard key={c.id} nome={c.nome} doc={c.cpfCnpj} produto={c.produto} status={c.status} />
            ))}
            <TouchableOpacity 
              className="py-3 border border-brand-green rounded-xl items-center mb-6"
              onPress={() => openCadastroModal('comprador')}
            >
              <Text className="text-brand-green font-bold text-[14px]">+ Adicionar comprador</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'nf':
        return (
          <View className="px-4 mt-10 items-center opacity-50">
            <MaterialIcons name="receipt" size={60} color="#9CA3AF" />
            <Text className="text-[16px] font-bold text-gray-600 mt-4">Nenhuma Nota Fiscal</Text>
            <Text className="text-[13px] text-gray-400 text-center mt-2">Você ainda não enviou os comprovantes de insumos desta safra.</Text>
            <TouchableOpacity className="mt-6 bg-brand-dark px-6 py-3 rounded-xl">
              <Text className="text-white font-bold">Enviar Nota Fiscal</Text>
            </TouchableOpacity>
          </View>
        );

      case 'aging':
        return (
          <View className="px-4 mt-10 items-center opacity-50">
            <MaterialIcons name="insert-chart-outlined" size={60} color="#9CA3AF" />
            <Text className="text-[16px] font-bold text-gray-600 mt-4">Relatório Aging</Text>
            <Text className="text-[13px] text-gray-400 text-center mt-2">O seu histórico de pagamentos e análise de envelhecimento da dívida será gerado após o fechamento do semestre.</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header NavBar */}
      <View className="px-4 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()} className="mb-4" activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-[22px] font-bold text-gray-900">Gestão Pós-Crédito</Text>
        <Text className="text-[14px] text-gray-500 mt-1">Contrato {contrato.numeroContrato}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        
        {/* Contrato Header Card (The big green one) */}
        <ContratoHeaderCard contrato={contrato} onAction={handleAction} />

        {/* Tab Navigation */}
        <TabMenuScrollable tabs={tabs} activeTabId={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {renderTabContent()}

      </ScrollView>

      {/* Toast Notificacao Contrato PDF */}
      {showToast && (
        <View className="absolute bottom-10 left-4 right-4 bg-[#00C853] p-4 rounded-xl flex-row items-center justify-center shadow-lg z-50">
          <Text className="text-white font-bold text-[14px]">Contrato PDF gerado e disponível para download</Text>
        </View>
      )}

      {/* Action Modals */}
      <Modal visible={!!actionModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableOpacity className="flex-1" onPress={() => setActionModal(null)} activeOpacity={1} />
          
          <View 
            className="bg-white rounded-t-3xl p-6" 
            style={{ 
              paddingBottom: insets.bottom + 24, 
              elevation: 10, 
              boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.15)'
            } as any}
          >
            {actionModal === 'pagar' && (
              <View>
                <Text className="text-[18px] font-bold text-gray-800 text-center mb-6">Opções de pagamento</Text>
                
                <PaymentOptionItem 
                  icon="account-balance" 
                  title="Débito em conta corrente" 
                  subtitle="Conta BASA AG 0001 CC 12345-6" 
                />
                <PaymentOptionItem 
                  icon="qr-code-scanner" 
                  title="Pagar via Pix" 
                  subtitle="Copie o QR Code para pagamento" 
                />
                <PaymentOptionItem 
                  icon="receipt" 
                  title="Gerar boleto" 
                  subtitle="Boleto para pagamento em qualquer banco" 
                />
                <PaymentOptionItem 
                  icon="calendar-today" 
                  title="Agendar pagamento" 
                  subtitle="Programe para data futura" 
                />
              </View>
            )}

            {actionModal === 'boleto' && (
              <View className="items-center">
                <MaterialIcons name="receipt-long" size={40} color="#0A3D24" className="mb-4" />
                <Text className="text-[18px] font-bold text-gray-800 mb-1">Boleto da parcela</Text>
                <Text className="text-[13px] text-gray-500 mb-6">Parcela 7/24 — Venc: 15/07/2026</Text>
                
                <Text className="text-[28px] font-bold text-[#0A3D24] mb-6">R$ 18.520,33</Text>
                
                <View className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex-row justify-between items-center mb-8">
                  <Text className="text-[13px] text-gray-600 font-mono tracking-widest flex-1 mr-4 leading-relaxed">
                    23793.38128 60000.000003 00014.523001 1 92340000018520
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <MaterialIcons name="content-copy" size={24} color="#374151" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  className="bg-[#0A3D24] py-4 rounded-full items-center w-full"
                  activeOpacity={0.8}
                  onPress={() => setActionModal(null)}
                >
                  <Text className="text-white font-bold text-[16px]">Compartilhar boleto</Text>
                </TouchableOpacity>
              </View>
            )}

            {actionModal === 'debito' && (
              <View className="items-center px-4">
                <Text className="text-[20px] font-bold text-gray-800 mb-6">Débito Automático</Text>
                
                <View 
                  className="rounded-full items-center justify-center mb-6" 
                  style={{ 
                    width: 64, 
                    height: 64, 
                    backgroundColor: isDebitoAtivo ? '#00C853' : '#EF4444' 
                  }}
                >
                  <MaterialIcons name={isDebitoAtivo ? "check" : "close"} size={40} color="#FFFFFF" />
                </View>

                <Text className="text-[14px] text-gray-600 text-center mb-8 leading-relaxed">
                  Débito automático {isDebitoAtivo ? 'ATIVO' : 'INATIVO'}{'\n'}
                  {isDebitoAtivo 
                    ? 'Suas parcelas serão debitadas automaticamente da sua conta corrente BASA.' 
                    : 'Você precisará efetuar o pagamento das parcelas manualmente via Pix ou Boleto.'}
                </Text>

                <View className="flex-row w-full gap-4">
                  <TouchableOpacity 
                    className="flex-1 py-4 items-center"
                    activeOpacity={0.8}
                    onPress={() => setActionModal(null)}
                  >
                    <Text className="text-gray-600 font-bold text-[16px]">Fechar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-1 py-4 rounded-full items-center"
                    style={{ backgroundColor: isDebitoAtivo ? '#DC2626' : '#0A3D24' }}
                    activeOpacity={0.8}
                    onPress={() => setIsDebitoAtivo(!isDebitoAtivo)}
                  >
                    <Text className="text-white font-bold text-[16px]">
                      {isDebitoAtivo ? 'Desativar' : 'Ativar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Cadastro Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View 
            className="bg-white rounded-t-3xl p-6" 
            style={{ 
              paddingBottom: insets.bottom + 24, 
              elevation: 10, 
              boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.15)'
            } as any}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[18px] font-bold text-gray-800">
                Novo {modalType === 'fornecedor' ? 'Fornecedor' : 'Comprador'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase">Razão Social / Nome</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-gray-800"
                placeholder="Digite o nome"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-4">
              <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase">CNPJ / CPF</Text>
              <TextInput 
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-gray-800"
                placeholder="Digite o documento"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
              />
            </View>

            <View className="mb-8">
              <Text className="text-[12px] font-bold text-gray-500 mb-2 uppercase">
                {modalType === 'fornecedor' ? 'Produto Fornecido' : 'Produto Comprado'}
              </Text>
              <TextInput 
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-gray-800"
                placeholder="Ex: Sementes, Soja, Fertilizantes..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity 
              className="bg-brand-green py-4 rounded-xl items-center"
              activeOpacity={0.8}
              onPress={() => setIsModalVisible(false)}
            >
              <Text className="text-white font-bold text-[15px]">Salvar Cadastro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-gray-100 last:border-0">
      <Text className="text-[13px] text-gray-500">{label}</Text>
      <Text className="text-[13px] font-bold text-gray-800 text-right flex-1 ml-4">{value}</Text>
    </View>
  );
}

function CadastroCard({ nome, doc, produto, status }: { nome: string, doc: string, produto: string, status: string }) {
  return (
    <View className="bg-white p-4 rounded-xl border border-gray-200 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-[14px] font-bold text-gray-800 flex-1">{nome}</Text>
        <View className={`px-2 py-1 rounded-md ml-2 ${status === 'ativo' ? 'bg-green-100' : 'bg-yellow-100'}`}>
          <Text className={`text-[10px] font-bold ${status === 'ativo' ? 'text-green-700' : 'text-yellow-700'}`}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>
      <Text className="text-[12px] text-gray-500 mb-1">{doc}</Text>
      <Text className="text-[12px] text-gray-400">Produto: {produto}</Text>
    </View>
  );
}

function PaymentOptionItem({ icon, title, subtitle }: { icon: keyof typeof MaterialIcons.glyphMap, title: string, subtitle: string }) {
  return (
    <TouchableOpacity activeOpacity={0.7} className="flex-row items-center mb-6">
      <View className="w-12 h-12 rounded-xl bg-green-50 items-center justify-center mr-4">
        <MaterialIcons name={icon} size={24} color="#0A3D24" />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-bold text-gray-800 mb-0.5">{title}</Text>
        <Text className="text-[13px] text-gray-500">{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

function ProgressoIndiceBar({ data, valor, isEvi = false }: { data: string, valor: number, isEvi?: boolean }) {
  let color = '#22C55E';
  
  if (isEvi) {
    color = '#D97706';
  } else {
    if (valor < 0.3) {
      color = '#DC2626';
    } else if (valor <= 0.6) {
      color = '#F59E0B';
    }
  }

  return (
    <View className="flex-row items-center mb-2" style={{ width: '100%' }}>
      <Text className="w-16 text-[12px] text-gray-500">{data}</Text>
      <View style={{ flex: 1, height: 12, backgroundColor: '#E5E7EB', borderRadius: 999, marginHorizontal: 12, overflow: 'hidden' }}>
        <View style={{ height: '100%', borderRadius: 999, width: `${Math.min(valor * 100, 100)}%`, backgroundColor: color }} />
      </View>
      <Text className="w-10 text-right text-[12px] font-bold" style={{ color }}>{valor.toFixed(2)}</Text>
    </View>
  );
}
