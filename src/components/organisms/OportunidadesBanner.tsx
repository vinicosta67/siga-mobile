import { Text, TouchableOpacity, View } from 'react-native';

interface OportunidadesBannerProps {
  onSimulatePress: () => void;
}

export default function OportunidadesBanner({ onSimulatePress }: OportunidadesBannerProps) {
  return (
    <View className="bg-brand-dark rounded-2xl mx-4 mb-4 p-5 mt-4">
      <Text className="text-white font-bold text-[20px] mb-2">Plano Safra 2026/2027</Text>
      <Text className="text-white opacity-90 text-[14px] leading-relaxed mb-4">
        Taxas especiais a partir de 3,5% a.a. para agricultura familiar. Condições exclusivas para clientes BASA.
      </Text>
      <TouchableOpacity
        className="bg-brand-green py-3.5 rounded-xl items-center"
        activeOpacity={0.8}
        onPress={onSimulatePress}
      >
        <Text className="text-white font-bold text-[15px]">Simular agora</Text>
      </TouchableOpacity>
    </View>
  );
}
