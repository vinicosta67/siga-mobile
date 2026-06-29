import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from '../../../src/store';
import { prevStep, resetSimulador } from '../../../src/store/slices/simuladorSlice';
import SimuladorStepperHeader from '../../../src/components/organisms/SimuladorStepperHeader';
import { useCalcularParcelas } from '../../../src/hooks/queries/useSimulador';

const formatCurrency = (value: any) => {
  if (value === undefined || value === null) return 'R$ 0,00';
  const num = Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default function ResumoScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state: RootState) => state.simulador);

  const { mutate, data: responseData, isPending, isError } = useCalcularParcelas();

  useEffect(() => {
    if (state.produtoSelecionadoId && state.valorDesejado > 0) {
      mutate({
        produto_id: state.produtoSelecionadoId,
        valor_solicitado: state.valorDesejado,
        prazo_meses: state.prazoMeses,
        carencia_meses: state.carenciaMeses,
        sistema_amortizacao: state.sistemaAmortizacao,
      });
    }
  }, []);

  const handleBack = () => {
    dispatch(prevStep());
    router.back();
  };

  const handleFinish = () => {
    router.push({
      pathname: '/(credito)/proposta/iniciar',
      params: {
        produto_id: state.produtoSelecionadoId,
        valor_solicitado: state.valorDesejado,
        prazo_meses: state.prazoMeses,
        carencia_meses: state.carenciaMeses,
        sistema_amortizacao: state.sistemaAmortizacao,
        garantias: JSON.stringify(
          (state.garantiasSelecionadas || []).map((g: any) => ({
            assetType: g.tipo,
            assetName: g.descricao,
            assetValue: g.valor
          }))
        ),
      }
    });
  };

  const handleExportPDF = async () => {
    if (!responseData) return;
    
    const simulacao = responseData.resumo;
    const parcelasHtml = responseData.parcelas_estimadas.map((p: any) => `
      <tr>
        <td class="text-center font-bold text-gray-700">${p.numero}</td>
        <td>${formatCurrency(p.saldo_devedor)}</td>
        <td>${formatCurrency(p.amortizacao)}</td>
        <td>${formatCurrency(p.juros)}</td>
        <td class="font-bold text-green-900">${formatCurrency(p.valor)}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              color: #1F2937; 
              background-color: #ffffff;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #0A3D24;
              padding-bottom: 16px;
              margin-bottom: 32px;
            }
            .header-title {
              color: #0A3D24;
              font-size: 24px;
              font-weight: 800;
              margin: 0;
            }
            .header-date {
              color: #6B7280;
              font-size: 14px;
            }
            .summary-card { 
              background-color: #E8F3EB; 
              padding: 24px; 
              border-radius: 16px; 
              margin-bottom: 32px;
              border: 1px solid #D1E5D7;
            }
            .summary-title {
              color: #0A3D24;
              font-size: 18px;
              font-weight: 700;
              margin-top: 0;
              margin-bottom: 16px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }
            .summary-item {
              display: flex;
              flex-direction: column;
            }
            .summary-label {
              color: #4B5563;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 4px;
            }
            .summary-value {
              color: #111827;
              font-size: 16px;
              font-weight: 600;
            }
            .highlight-value {
              color: #0A3D24;
              font-size: 20px;
              font-weight: 800;
            }
            .section-title {
              color: #111827;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 16px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 13px; 
            }
            th, td { 
              border-bottom: 1px solid #E5E7EB; 
              padding: 12px 8px; 
              text-align: right; 
            }
            th { 
              background-color: #F9FAFB; 
              color: #4B5563; 
              font-weight: 600;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 0.05em;
              border-top: 1px solid #E5E7EB;
            }
            th:first-child, td:first-child {
              text-align: center;
            }
            .text-center { text-align: center; }
            .font-bold { font-weight: 700; }
            .text-gray-700 { color: #374151; }
            .text-green-900 { color: #0A3D24; }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #9CA3AF;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="header-title">SIGA - Simulador de Crédito</h1>
            <span class="header-date">Emitido em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
          
          <div class="summary-card">
            <h2 class="summary-title">Resumo Financeiro</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Valor Solicitado</span>
                <span class="summary-value">${formatCurrency(state.valorDesejado)}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Valor a Financiar</span>
                <span class="summary-value">${formatCurrency(simulacao.valor_financiado)}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Prazo e Carência</span>
                <span class="summary-value">${simulacao.prazo_total_meses} meses (Carência: ${simulacao.carencia_meses})</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Taxa Efetiva</span>
                <span class="summary-value">${simulacao.taxa_juros_aa.toFixed(2)}% a.a.</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total de Juros</span>
                <span class="summary-value">${formatCurrency(simulacao.juros_totais)}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Sistema de Amortização</span>
                <span class="summary-value">${simulacao.sistema_amortizacao}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Total a Pagar</span>
                <span class="highlight-value">${formatCurrency(simulacao.valor_total_a_pagar)}</span>
              </div>
            </div>
          </div>

          <h2 class="section-title">Detalhamento de Parcelas Estimadas</h2>
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Saldo Devedor Inicial</th>
                <th>Amortização</th>
                <th>Juros</th>
                <th>Valor da Parcela</th>
              </tr>
            </thead>
            <tbody>
              ${parcelasHtml}
            </tbody>
          </table>

          <div class="footer">
            Documento gerado pelo sistema SIGA Mobile. Valores sujeitos a análise de crédito.
          </div>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === 'web') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          // Esperar o CSS carregar
          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
      } else {
        const printResult = await Print.printToFileAsync({ html, width: 612, height: 792 });
        if (printResult && printResult.uri) {
          await Sharing.shareAsync(printResult.uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } else {
          throw new Error("printToFileAsync não retornou um URI válido.");
        }
      }
    } catch (error) {
      console.error('Erro ao gerar PDF', error);
      alert('Não foi possível gerar o PDF. Tente novamente.');
    }
  };

  const simulacao = responseData?.resumo;

  return (
    <View className="flex-1 bg-white">
      <SimuladorStepperHeader currentStep={state.step} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[32px] font-bold text-gray-900 mb-6 leading-tight">
          Resultado da{'\n'}simulação
        </Text>

        {isPending ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#0A3D24" />
            <Text className="text-gray-500 mt-4 text-center">Processando simulação no motor financeiro...</Text>
          </View>
        ) : isError || !simulacao ? (
          <View className="items-center py-12">
            <MaterialIcons name="error-outline" size={48} color="#EF4444" />
            <Text className="text-red-500 text-center mt-4">Erro ao calcular a simulação. Tente novamente mais tarde.</Text>
          </View>
        ) : (
          <>
            {/* Dark Card */}
            <View className="bg-[#0A3D24] p-6 rounded-2xl mb-6 shadow-md items-center">
              <Text className="text-white/70 text-[13px] font-bold uppercase tracking-wider mb-2">
                Parcela estimada
              </Text>
              <Text className="text-[#39FF14] text-[40px] font-extrabold mb-1 tracking-tighter">
                {formatCurrency(simulacao.primeira_parcela).replace('R$', '').trim()}
              </Text>
              <Text className="text-white/70 text-[13px] font-bold">
                /mês {simulacao.sistema_amortizacao === 'SAC' ? '(1ª parcela)' : ''}
              </Text>

              <View className="flex-row justify-between w-full mt-6 pt-6 border-t border-white/20">
                <View className="items-center flex-1">
                  <Text className="text-white/60 text-[12px] mb-1">Valor</Text>
                  <Text className="text-white text-[15px] font-bold">
                    {state.valorDesejado >= 1000 ? `${state.valorDesejado / 1000}k` : state.valorDesejado}
                  </Text>
                </View>
                <View className="w-px h-10 bg-white/20 mx-2" />
                <View className="items-center flex-1">
                  <Text className="text-white/60 text-[12px] mb-1">Prazo</Text>
                  <Text className="text-white text-[15px] font-bold">{simulacao.prazo_total_meses}m</Text>
                </View>
                <View className="w-px h-10 bg-white/20 mx-2" />
                <View className="items-center flex-1">
                  <Text className="text-white/60 text-[12px] mb-1">CET</Text>
                  <Text className="text-white text-[15px] font-bold">{simulacao.cet_calculado_aa.toFixed(1)}%</Text>
                </View>
              </View>
            </View>

            {/* Detalhes Financeiros */}
            <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
              <Text className="text-gray-900 font-bold text-[16px] mb-4">Detalhes financeiros</Text>
              
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">Valor solicitado</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(state.valorDesejado)}</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">IOF</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.custo_iof)}</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">TAC</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.custo_tac)}</Text>
              </View>

              <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                <Text className="text-gray-500 text-[14px]">Valor a financiar</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.valor_financiado)}</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">Taxa Efetiva (a.a)</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{simulacao.taxa_juros_aa.toFixed(2)}%</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">Total de juros</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.juros_totais)}</Text>
              </View>

              <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                <Text className="text-gray-800 text-[15px] font-bold">Total a pagar</Text>
                <Text className="text-[#0A3D24] text-[15px] font-bold">{formatCurrency(simulacao.valor_total_a_pagar)}</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">Carência</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{simulacao.carencia_meses} meses</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">Sistema</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{simulacao.sistema_amortizacao}</Text>
              </View>

              <View className="flex-row justify-between mt-1 mb-3 pt-4 border-t border-gray-100">
                <Text className="text-gray-500 text-[14px]">Primeira parcela</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.primeira_parcela)}</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[14px]">Última parcela</Text>
                <Text className="text-gray-900 text-[14px] font-bold">{formatCurrency(simulacao.ultima_parcela)}</Text>
              </View>
            </View>

            {/* Export PDF Button */}
            <TouchableOpacity 
              onPress={handleExportPDF}
              activeOpacity={0.8}
              className="flex-row items-center justify-center bg-gray-100 p-4 rounded-xl mb-6 border border-gray-200"
            >
              <MaterialIcons name="picture-as-pdf" size={24} color="#0A3D24" />
              <Text className="ml-3 font-bold text-[#0A3D24] text-[16px]">Exportar Detalhamento em PDF</Text>
            </TouchableOpacity>
          </>
        )}

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
          disabled={isPending || isError || !simulacao}
          onPress={handleFinish}
          className={`flex-1 py-4 rounded-full items-center ${
            !isPending && !isError && simulacao ? 'bg-[#0A3D24]' : 'bg-gray-300'
          }`}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Iniciar Proposta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
