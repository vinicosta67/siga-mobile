import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
}

function ActionButton({ icon, label, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} className="items-center w-20">
      <View className="bg-[#00E65B] w-16 h-16 rounded-full items-center justify-center mb-2 shadow-sm">
        <MaterialCommunityIcons name={icon} size={28} color="white" />
      </View>
      <Text className="text-gray-800 font-bold text-sm text-center leading-tight">{label}</Text>
    </TouchableOpacity>
  );
}

export default function QuickActionButtons() {
  return (
    <View className="flex-row justify-between px-2 mb-8">
      <ActionButton icon="link-variant" label="Pix" onPress={() => { }} />
      <ActionButton icon="arrow-top-right-bottom-left" label="Transferir" onPress={() => { }} />
      <ActionButton icon="qrcode-scan" label="Ler QR Code" onPress={() => { }} />
      <ActionButton icon="receipt" label="Pagar" onPress={() => { }} />
    </View>
  );
}
