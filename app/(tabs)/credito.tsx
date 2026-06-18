import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/src/components/Header';
import CreditNavigationMenu from '@/src/components/CreditNavigationMenu';

export default function Credito() {
  const [isVisible, setIsVisible] = useState(true);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-brand-bg">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Header 
          isVisible={isVisible} 
          onToggleVisibility={() => setIsVisible(!isVisible)} 
        />
        <View className="-mt-10 px-4">
          <CreditNavigationMenu />
        </View>
      </ScrollView>
    </View>
  );
}
