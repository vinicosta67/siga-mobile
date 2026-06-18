import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

export default function Badge({ text, variant = 'success', className = '', ...rest }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100',
  };

  const textStyles = {
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    info: 'text-blue-700',
  };

  return (
    <View 
      className={`px-2 py-1 rounded-full items-center justify-center ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      <Text className={`text-xs font-bold ${textStyles[variant]}`}>
        {text}
      </Text>
    </View>
  );
}
