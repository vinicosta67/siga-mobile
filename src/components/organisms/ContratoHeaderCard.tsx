import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ContratoAtivo } from '../../utils/creditoMockData';
import { CardLabel, CardValue } from '../atoms/CardTypography';

interface ContratoHeaderCardProps {
  contrato: ContratoAtivo;
  onAction: (action: string) => void;
}

export default function ContratoHeaderCard({ contrato, onAction }: ContratoHeaderCardProps) {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'adimplente': return { bg: '#00C853', text: '#064E3B', label: 'ADIMPLENTE' };
      case 'atraso_leve': return { bg: '#EAB308', text: '#713F12', label: 'ATRASO LEVE' };
      case 'atraso_grave': return { bg: '#EF4444', text: '#450A0A', label: 'ATRASO GRAVE' };
      default: return { bg: '#6B7280', text: '#FFFFFF', label: status.toUpperCase() };
    }
  };

  const statusInfo = getStatusColor(contrato.statusContrato);
  const pagoPercent = Math.round(((contrato.totalParcelas - contrato.parcelasRestantes) / contrato.totalParcelas) * 100);

  return (
    <View className="mx-4 mt-2 mb-4 rounded-xl overflow-hidden" style={{ backgroundColor: '#0A3D24' }}>
      {/* Top Content */}
      <View className="p-5">
        <View className="mb-5">
          <View className="flex-row gap-2 mb-2">
            <View className="px-2 py-1 rounded-md" style={{ backgroundColor: statusInfo.bg }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: statusInfo.text }}>{statusInfo.label}</Text>
            </View>
            <View className="px-2 py-1 rounded-md flex-row items-center" style={{ backgroundColor: '#475330' }}>
              <MaterialIcons name="link" size={12} color="#D9F99D" />
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#D9F99D', marginLeft: 4 }}>CMN 5.267</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#A1B5A8' }}>Contrato {contrato.numeroContrato}</Text>
        </View>

        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 24 }}>
          {contrato.produto.nome}
        </Text>

        <View className="flex-row justify-between mb-4">
          <View>
            <CardLabel>Saldo devedor</CardLabel>
            <CardValue>R$ {formatCurrency(contrato.saldoDevedor)}</CardValue>
          </View>
          <View>
            <CardLabel>Parcela</CardLabel>
            <CardValue>R$ {formatCurrency(contrato.valorParcelaAtual)}</CardValue>
          </View>
          <View>
            <CardLabel style={{ textAlign: 'right' }}>Restantes</CardLabel>
            <CardValue style={{ textAlign: 'right' }}>{contrato.parcelasRestantes}/{contrato.totalParcelas}</CardValue>
          </View>
        </View>

        <View className="mb-2 mt-2">
          <View style={{ height: 6, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 4, overflow: 'hidden' }}>
            <View 
              style={{ height: '100%', backgroundColor: '#D9F99D', borderRadius: 4, width: `${pagoPercent}%` }} 
            />
          </View>
        </View>
        <Text style={{ fontSize: 12, color: '#A1B5A8' }}>{pagoPercent}% pago</Text>
      </View>

      {/* Quick Actions (Bottom Bar) */}
      <View className="flex-row justify-between px-5 pb-6 pt-4">
        <ActionItem icon="receipt-long" label="Boleto" onPress={() => onAction('boleto')} />
        <ActionItem icon="payment" label="Pagar" onPress={() => onAction('pagar')} />
        <ActionItem icon="sync" label="Deb. Auto" onPress={() => onAction('debito')} />
        <ActionItem icon="download" label="Contrato" onPress={() => onAction('download')} />
      </View>
    </View>
  );
}

function ActionItem({ icon, label, onPress }: { icon: keyof typeof MaterialIcons.glyphMap, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="items-center flex-1">
      <View className="w-14 h-14 rounded-2xl items-center justify-center mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <MaterialIcons name={icon} size={26} color="#D9F99D" />
      </View>
      <Text style={{ fontSize: 13, fontWeight: '500', color: '#FFFFFF' }}>{label}</Text>
    </TouchableOpacity>
  );
}
