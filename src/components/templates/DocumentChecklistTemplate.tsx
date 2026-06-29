import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DocumentUploadCard } from '../organisms/DocumentUploadCard';

interface DocumentChecklistTemplateProps {
  proposalId: string;
  documentosBasicos: string[];
  documentosEspecificos: string[];
  isLoading: boolean;
  onFinish: () => void;
  onBack: () => void;
}

export default function DocumentChecklistTemplate({
  proposalId,
  documentosBasicos,
  documentosEspecificos,
  isLoading,
  onFinish,
  onBack,
}: DocumentChecklistTemplateProps) {

  return (
    <SafeAreaView className="flex-1 bg-[#f4f7f5]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white border-b border-gray-100 shadow-sm z-10">
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1 ml-2">
          <Text className="font-bold text-gray-900 text-lg">Documentação</Text>
          <Text className="text-gray-500 text-xs">Proposta #{proposalId.substring(0, 8).toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="text-2xl font-bold text-gray-900 mb-2">Envio de Documentos</Text>
        <Text className="text-gray-500 mb-6 font-medium leading-relaxed">
          Para darmos andamento à sua solicitação, por favor anexe os documentos listados abaixo.
          Você pode tirar uma foto com o celular ou escolher um arquivo em PDF.
        </Text>

        {isLoading ? (
          <View className="py-10 items-center justify-center">
            <ActivityIndicator size="large" color="#92dc49" />
            <Text className="text-gray-400 mt-4">Carregando lista de exigências...</Text>
          </View>
        ) : (
          <>
            {documentosBasicos.length > 0 && (
              <View className="mb-6">
                <Text className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-4 ml-1">Documentos Básicos</Text>
                {documentosBasicos.map((doc, idx) => (
                  <DocumentUploadCard 
                    key={`basic-${idx}`} 
                    proposalId={proposalId} 
                    documentType={doc} 
                  />
                ))}
              </View>
            )}

            {documentosEspecificos.length > 0 && (
              <View className="mb-6">
                <Text className="font-bold text-gray-900 text-sm uppercase tracking-widest mb-4 ml-1">Documentos Específicos da Operação</Text>
                {documentosEspecificos.map((doc, idx) => (
                  <DocumentUploadCard 
                    key={`esp-${idx}`} 
                    proposalId={proposalId} 
                    documentType={doc} 
                    description="Obrigatório para o seu perfil ou garantia"
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Footer / Finish Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <TouchableOpacity
          onPress={onFinish}
          className="bg-[#0A3D24] py-4 rounded-full items-center active:scale-95 transition-transform shadow-lg shadow-[#0A3D24]/30"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-[16px]">Enviar para Análise</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
