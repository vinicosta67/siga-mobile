import React from 'react';
import { Stack } from 'expo-router';

export default function SimuladorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
      <Stack.Screen name="necessidade" />
      <Stack.Screen name="produtos" />
    </Stack>
  );
}
