import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { CreditoMockData, OfertaPreAprovada, ProdutoCredito } from '@/src/utils/creditoMockData';
import ManagerCard from '@/src/components/molecules/ManagerCard';
import PreAprovadoHeader from '@/src/components/organisms/PreAprovadoHeader';
import OfertaPreAprovadaCard from '@/src/components/organisms/OfertaPreAprovadaCard';
import ComoFuncionaCredito from '@/src/components/organisms/ComoFuncionaCredito';

export default function PreAprovadoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedOferta, setSelectedOferta] = useState<{ oferta: OfertaPreAprovada, produto: ProdutoCredito } | null>(null);

  const totalPreAprovado = CreditoMockData.ofertasPreAprovadas.reduce(
    (sum, oferta) => sum + oferta.valorPreAprovado, 
    0
  );

  const getProduto = (produtoId: string) => {
    return CreditoMockData.produtos.find(p => p.id === produtoId) || CreditoMockData.produtos[0];
  };

  const handleSimular = (oferta: OfertaPreAprovada, produto: ProdutoCredito) => {
    console.log('Simular oferta:', oferta.id);
    setSelectedOferta(null);
    // Future navigation to simulador
  };

  const formatValue = (value: number) => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Page Header */}
      <View 
        className="px-4 pb-4 flex-row items-center bg-brand-dark"
        style={{ paddingTop: insets.top + 16 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-white font-bold text-[18px]">
            Credito Pre-Aprovado
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <PreAprovadoHeader 
          totalValue={totalPreAprovado} 
          numberOfLines={CreditoMockData.ofertasPreAprovadas.length} 
        />
        
        <ManagerCard 
          managerName="Ana Paula Santos" 
          onContactPress={() => console.log('Contact manager via WhatsApp')} 
        />

        <View className="mt-6 mb-3 px-4">
          <Text className="text-gray-700 font-semibold text-[15px]">
            {CreditoMockData.ofertasPreAprovadas.length} ofertas personalizadas para voce
          </Text>
        </View>

        {CreditoMockData.ofertasPreAprovadas.map(oferta => (
          <OfertaPreAprovadaCard 
            key={oferta.id}
            oferta={oferta}
            produto={getProduto(oferta.produtoId)}
            onSimular={() => handleSimular(oferta, getProduto(oferta.produtoId))}
            onDetalhes={() => setSelectedOferta({ oferta, produto: getProduto(oferta.produtoId) })}
          />
        ))}

        <View className="mt-2">
          <ComoFuncionaCredito />
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={!!selectedOferta}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedOferta(null)}
      >
        {selectedOferta && (
          <View className="flex-1 justify-end bg-black/40">
            <TouchableOpacity 
              style={{ flex: 1 }} 
              onPress={() => setSelectedOferta(null)} 
              activeOpacity={1}
            />
            <View className="bg-white rounded-t-3xl pt-2 pb-8 px-6 max-h-[85%]">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
              
              <Text className="text-gray-800 font-bold text-[20px]">
                {selectedOferta.oferta.nomeProduto}
              </Text>
              
              <View className="mt-5 space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-500 text-[14px]">Valor disponível</Text>
                  <Text className="text-brand-dark font-bold text-[14px]">
                    R$ {formatValue(selectedOferta.oferta.valorPreAprovado)}
                  </Text>
                </View>
                <View className="flex-row justify-between mt-3">
                  <Text className="text-gray-500 text-[14px]">Taxa especial</Text>
                  <Text className="text-brand-dark font-bold text-[14px]">
                    {selectedOferta.oferta.taxaEspecial}% a.a.
                  </Text>
                </View>
                <View className="flex-row justify-between mt-3">
                  <Text className="text-gray-500 text-[14px]">Prazo sugerido</Text>
                  <Text className="text-brand-dark font-bold text-[14px]">
                    {selectedOferta.oferta.prazoSugerido} meses
                  </Text>
                </View>
                <View className="flex-row justify-between mt-3">
                  <Text className="text-gray-500 text-[14px]">Carência</Text>
                  <Text className="text-brand-dark font-bold text-[14px]">
                    {selectedOferta.oferta.carenciaSugerida} meses
                  </Text>
                </View>
                <View className="flex-row justify-between mt-3">
                  <Text className="text-gray-500 text-[14px]">Validade</Text>
                  <Text className="text-brand-dark font-bold text-[14px]">
                    {new Date(selectedOferta.oferta.validadeOferta).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>

              <View className="h-[1px] bg-gray-100 my-5" />

              <Text className="text-gray-800 font-semibold text-[15px]">Motivo da oferta</Text>
              <Text className="text-gray-500 text-[14px] mt-1 leading-relaxed">
                {selectedOferta.oferta.motivoOferta}
              </Text>

              <Text className="text-gray-800 font-semibold text-[15px] mt-4">Sobre o produto</Text>
              <Text className="text-gray-500 text-[14px] mt-1 leading-relaxed">
                {selectedOferta.produto.finalidade}
              </Text>
              <Text className="text-gray-400 text-[12px] mt-2">
                Garantias: {selectedOferta.produto.garantiasAceitas}
              </Text>

              <TouchableOpacity 
                className="bg-brand-green w-full rounded-xl py-4 items-center justify-center mt-8 mb-2"
                onPress={() => handleSimular(selectedOferta.oferta, selectedOferta.produto)}
              >
                <Text className="text-white font-bold text-[16px]">Simular esta oferta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}
