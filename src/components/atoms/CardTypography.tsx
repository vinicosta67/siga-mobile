import React from 'react';
import { Text, TextProps } from 'react-native';

export function CardLabel(props: TextProps) {
  return (
    <Text 
      {...props} 
      style={[{ color: '#A1B5A8', fontSize: 12, marginBottom: 4 }, props.style]} 
    />
  );
}

export function CardValue(props: TextProps) {
  return (
    <Text 
      {...props} 
      style={[{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }, props.style]} 
    />
  );
}
