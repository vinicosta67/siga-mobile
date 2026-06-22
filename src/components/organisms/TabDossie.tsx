import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { PropostaModel } from '../../utils/propostaMockData';

interface TabDossieProps {
  proposta: PropostaModel;
}

export default function TabDossie({ proposta }: TabDossieProps) {
  const total = proposta.documentos.length;
  const validados = proposta.documentos.filter(d => d.status === 'Validado').length;
  const pendentes = proposta.documentos.filter(d => d.status === 'Pendente').length;
  const vencidos = proposta.documentos.filter(d => d.status === 'Vencido').length;

  return (
    <View className="px-4 py-2 bg-gray-50 flex-1">
      {/* KPIs Responsivos */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <KpiDossie label="Total" valor={total} color="#0A3D24" bg="bg-brand-green/10" />
        <KpiDossie label="Validados" valor={validados} color="#18A354" bg="bg-green-100" />
        <KpiDossie label="Pendentes" valor={pendentes} color="#D97706" bg="bg-orange-100" />
        <KpiDossie label="Vencidos" valor={vencidos} color="#DC2626" bg="bg-red-100" />
      </View>

      <Text className="font-bold text-[16px] text-gray-800 mb-4">Arquivos do Dossiê</Text>

      {/* Lista de Documentos (Mobile Friendly Cards) */}
      {proposta.documentos.map((doc) => (
        <View key={doc.id} className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm flex-row items-center">
          <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${doc.tipo === 'PDF' ? 'bg-red-100' : 'bg-green-100'}`}>
            <MaterialIcons name={doc.tipo === 'PDF' ? 'picture-as-pdf' : 'table-chart'} size={20} color={doc.tipo === 'PDF' ? '#DC2626' : '#18A354'} />
          </View>
          
          <View className="flex-1 mr-2">
            <Text className="font-bold text-gray-800 text-[14px] leading-tight mb-1">{doc.nome}</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-400 text-[11px] font-medium mr-2">{doc.tamanho}</Text>
              <View className="w-1 h-1 bg-gray-300 rounded-full mr-2" />
              <Text className={`text-[11px] font-bold ${
                doc.status === 'Validado' ? 'text-green-600' : 
                doc.status === 'Vencido' ? 'text-red-600' : 'text-orange-600'
              }`}>
                {doc.status}
              </Text>
            </View>
          </View>

          <TouchableOpacity className="p-2" activeOpacity={0.7}>
            <MaterialIcons name={doc.ok ? 'visibility' : 'file-upload'} size={22} color={doc.ok ? '#9CA3AF' : '#D97706'} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity className="bg-brand-dark rounded-xl py-3.5 mt-2 flex-row items-center justify-center shadow-sm" activeOpacity={0.8}>
        <MaterialIcons name="add" size={18} color="#E6FF55" />
        <Text className="text-white font-bold text-[15px] ml-2">Enviar Novo Documento</Text>
      </TouchableOpacity>
    </View>
  );
}

function KpiDossie({ label, valor, color, bg }: { label: string, valor: number, color: string, bg: string }) {
  return (
    <View className={`w-[48%] p-3 rounded-xl mb-3 ${bg}`}>
      <Text className="font-bold text-[12px]" style={{ color }}>{label}</Text>
      <Text className="font-black text-[22px] mt-1" style={{ color }}>{valor}</Text>
    </View>
  );
}
