import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { CreditoMockData } from '@/src/utils/creditoMockData';

import OportunidadesBanner from '@/src/components/organisms/OportunidadesBanner';
import FilterPills, { FiltroCategoria } from '@/src/components/molecules/FilterPills';
import ProdutoCreditoCard from '@/src/components/organisms/ProdutoCreditoCard';
import OportunidadeListaCard from '@/src/components/organisms/OportunidadeListaCard';
import EducativoAccordion from '@/src/components/molecules/EducativoAccordion';

export default function OportunidadesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [activeFiltro, setActiveFiltro] = useState<FiltroCategoria>('todos');
  const [expandedEducativo, setExpandedEducativo] = useState<string | null>(null);

  const filtros = [
    { id: 'todos' as FiltroCategoria, label: 'Todos' },
    { id: 'destaque' as FiltroCategoria, label: 'Destaques' },
    { id: 'rural' as FiltroCategoria, label: 'Rural' },
    { id: 'mpe' as FiltroCategoria, label: 'MPE' },
    { id: 'educativo' as FiltroCategoria, label: 'Aprender' },
  ];

  const oportunidadesFiltradas = CreditoMockData.oportunidades.filter(
    o => activeFiltro === 'todos' || o.categoria === activeFiltro
  );

  const conteudosEducativos = [
    { titulo: 'O que é o FNO?', conteudo: 'O Fundo Constitucional de Financiamento do Norte (FNO) é um fundo público destinado a financiar o desenvolvimento sustentável da Amazônia Legal. Criado pela Constituição de 1988, o FNO oferece crédito com taxas subsidiadas para produtores rurais, microempreendedores e empresas da região Norte. O Banco da Amazônia é o operador exclusivo do FNO.' },
    { titulo: 'Guia de documentos para crédito rural', conteudo: 'Para solicitar crédito rural, você precisará de:\n\n- CPF/CNPJ e documento de identidade\n- CAR (Cadastro Ambiental Rural) atualizado\n- Comprovante de posse ou propriedade da terra\n- Orçamento da safra ou projeto técnico\n- ZARC para operações de custeio\n- DAP/CAF para agricultura familiar\n\nO banco pode solicitar documentos adicionais conforme o produto.' },
    { titulo: 'Como funciona a simulação?', conteudo: 'A simulação de crédito permite que você veja as condições do financiamento antes de solicitar. Você informa o que precisa (plantar, comprar maquinário, etc.), o valor e o prazo desejado. O sistema calcula automaticamente a taxa de juros, valor das parcelas, carência e o custo efetivo total (CET). Após a simulação, você pode iniciar a proposta diretamente pelo app.' },
    { titulo: 'O que é PRONAF?', conteudo: 'O Programa Nacional de Fortalecimento da Agricultura Familiar (PRONAF) oferece crédito com as menores taxas do mercado para agricultores familiares. Via BASA, você pode acessar o PRONAF com taxas a partir de 3,5% a.a., sem TAC e sem IOF. É necessário possuir DAP/CAF (Declaração de Aptidão ao PRONAF ou Cadastro da Agricultura Familiar).' },
  ];

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200 mb-4 shadow-sm" activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 font-bold text-[24px]">Oportunidades de Crédito</Text>
          <Text className="text-gray-500 text-[14px] mt-1">Explore as linhas de crédito disponíveis para você</Text>
        </View>

        {/* Banner */}
        <OportunidadesBanner onSimulatePress={() => console.log('Simular')} />

        {/* Filtros */}
        <FilterPills 
          filtros={filtros} 
          activeFiltro={activeFiltro} 
          onSelectFiltro={setActiveFiltro} 
        />

        {/* Linhas de crédito disponíveis (Carrossel Horizontal) */}
        <View className="mt-6">
          <View className="px-4 mb-3">
            <Text className="font-bold text-gray-800 text-[16px]">Linhas de crédito disponíveis</Text>
            <Text className="text-gray-400 text-[13px] mt-0.5">10 produtos FNO e BNDES para sua necessidade</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {CreditoMockData.produtos.map(p => (
              <ProdutoCreditoCard 
                key={p.id} 
                produto={p} 
                onTap={() => console.log('Abrir Produto', p.id)} 
              />
            ))}
          </ScrollView>
        </View>

        {/* Oportunidades para você (Lista Vertical) */}
        {oportunidadesFiltradas.length > 0 && activeFiltro !== 'educativo' && (
          <View className="px-4 mt-8">
            <Text className="font-bold text-gray-800 text-[16px] mb-4">Oportunidades para você</Text>
            {oportunidadesFiltradas.map(op => (
              <OportunidadeListaCard 
                key={op.id} 
                oportunidade={op} 
                onTap={() => console.log('Ver detalhe oportunidade', op.id)} 
              />
            ))}
          </View>
        )}

        {/* Seção Educativa */}
        <View className="px-4 mt-6">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="school" size={20} color="#0A3D24" />
            <Text className="font-bold text-gray-800 text-[16px] ml-2">Aprenda sobre crédito</Text>
          </View>
          {conteudosEducativos.map(c => (
            <EducativoAccordion 
              key={c.titulo} 
              titulo={c.titulo} 
              conteudo={c.conteudo} 
              isExpanded={expandedEducativo === c.titulo}
              onToggle={() => setExpandedEducativo(expandedEducativo === c.titulo ? null : c.titulo)}
            />
          ))}
        </View>

        {/* Fale com seu gerente */}
        <View className="mx-4 mt-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm items-center">
          <MaterialIcons name="support-agent" size={40} color="#0A3D24" />
          <Text className="text-gray-900 font-bold text-[16px] mt-3">Fale com seu gerente</Text>
          <Text className="text-gray-500 text-[14px] text-center mt-1 mb-4 leading-relaxed">
            Tire dúvidas sobre os produtos ou receba uma orientação personalizada
          </Text>
          <View className="flex-row w-full">
            <TouchableOpacity 
              className="flex-1 bg-white border border-gray-300 py-3 rounded-xl items-center mr-3"
              activeOpacity={0.7}
              onPress={() => Linking.openURL('whatsapp://send?text=Olá Gerente&phone=559130049999')}
            >
              <Text className="text-gray-700 font-bold text-[14px]">WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-brand-dark py-3 rounded-xl items-center"
              activeOpacity={0.8}
              onPress={() => Linking.openURL('tel:9130049999')}
            >
              <Text className="text-white font-bold text-[14px]">Ligar</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
