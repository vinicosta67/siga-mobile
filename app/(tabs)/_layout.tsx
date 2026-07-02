import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#18A354', // brand-green
        tabBarInactiveTintColor: '#9CA3AF', // text-gray-400
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6', // gray-100
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="credito"
        options={{
          title: 'Credito',
          tabBarIcon: ({ color }) => <MaterialIcons name="credit-card" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pix"
        options={{
          title: 'Pix',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="link-variant" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pagar"
        options={{
          title: 'Pagar',
          tabBarIcon: ({ color }) => <MaterialIcons name="receipt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <MaterialIcons name="menu" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
