import { Stack } from 'expo-router';
import React from 'react';

export default function CreditoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pre-aprovado" />
    </Stack>
  );
}
