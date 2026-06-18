import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  onToggleVisibility?: () => void;
  isVisible?: boolean;
}

export default function Header({ onToggleVisibility, isVisible = true }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="bg-[#00E65B] px-6 pb-24 w-full"
      style={{ paddingTop: insets.top + 20 }}
    >
      <View className="flex-row justify-between items-center w-full">
        {/* Logo Placeholder */}
        <View className="flex-row items-center">
          <Text className="text-white font-heading text-3xl italic font-black tracking-tighter">A</Text>
        </View>

        {/* Right Actions */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity 
            testID="toggle-visibility-btn" 
            onPress={onToggleVisibility}
            className="p-1"
          >
            <MaterialIcons 
              name={isVisible ? "visibility" : "visibility-off"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            testID="notifications-btn"
            className="p-1"
          >
            <MaterialIcons name="notifications-none" size={24} color="white" />
          </TouchableOpacity>

          {/* User Avatar */}
          <View className="bg-white rounded-full w-10 h-10 items-center justify-center border-2 border-transparent">
            <Text className="text-black font-heading text-sm">NS</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
