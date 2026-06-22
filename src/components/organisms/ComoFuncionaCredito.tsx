import React from 'react';
import { View, Text } from 'react-native';

export default function ComoFuncionaCredito() {
  const Step = ({ 
    num, 
    titulo, 
    desc, 
    isLast = false 
  }: { 
    num: string; 
    titulo: string; 
    desc: string; 
    isLast?: boolean 
  }) => (
    <View className="flex-row">
      <View className="items-center">
        <View className="w-7 h-7 rounded-full bg-brand-dark items-center justify-center z-10">
          <Text className="text-white font-bold text-[12px]">{num}</Text>
        </View>
        {!isLast && <View className="w-0.5 h-10 bg-gray-100 -mt-1" />}
      </View>
      <View className={`flex-1 ml-3 ${isLast ? '' : 'pb-4'}`}>
        <Text className="text-gray-700 font-semibold text-[13px]">{titulo}</Text>
        <Text className="text-gray-400 text-[12px] mt-0.5 leading-tight">{desc}</Text>
      </View>
    </View>
  );

  return (
    <View className="m-4 p-5 bg-white rounded-2xl border border-gray-100">
      <Text className="text-gray-800 font-semibold text-[16px] mb-4">
        Como funciona o crédito pré-aprovado?
      </Text>
      
      <Step 
        num="1" 
        titulo="Analisamos seu histórico" 
        desc="Com base no seu relacionamento com o BASA, identificamos oportunidades de crédito." 
      />
      <Step 
        num="2" 
        titulo="Ofertas personalizadas" 
        desc="Seu gerente prepara condições especiais de taxa, prazo e carência." 
      />
      <Step 
        num="3" 
        titulo="Simule e compare" 
        desc="Você pode simular cada oferta e comparar condições antes de decidir." 
      />
      <Step 
        num="4" 
        titulo="Contrate pelo app" 
        desc="Se aprovar, inicie a proposta diretamente e acompanhe cada etapa." 
        isLast 
      />
    </View>
  );
}
