import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface PreAprovadoHeaderProps {
  totalValue: number;
  numberOfLines: number;
}

export default function PreAprovadoHeader({ totalValue, numberOfLines }: PreAprovadoHeaderProps) {

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1).replace('.', ',')} mi`;
    }

    // Format to BRL locale: R$ 850.000,00
    const formatted = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `R$ ${formatted}`;
  };

  return (
    <View className="mx-4 mt-2 mb-4 p-5 bg-brand-dark rounded-2xl shadow-sm">
      <View className="flex-row items-start">
        <View className="bg-[#416838] p-2.5 rounded-xl mr-4 mt-1">
          <MaterialIcons name="verified" size={26} color="#E6FF55" />
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-[20px] tracking-tight leading-tight">
            Você tem crédito pré-aprovado!
          </Text>
          <Text className="text-white/80 font-bold text-[13px] mt-1.5 leading-tight">
            Baseado no seu histórico como cliente BASA
          </Text>
        </View>
      </View>

      <View className="mt-8">
        <Text className="text-white/80 font-bold text-[13px]">
          Até
        </Text>
        <Text
          className="tracking-normal mt-0 leading-tight font-bold"
          style={{ fontSize: 44, color: '#E6FF55' }}
        >
          {formatValue(totalValue)}
        </Text>
        <Text className="text-white/70 font-medium text-[13px] mt-0.5">
          disponíveis em {numberOfLines} linhas de crédito
        </Text>
      </View>
    </View>
  );
}
