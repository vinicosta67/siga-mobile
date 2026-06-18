import React from 'react';
import { Text, TextProps } from 'react-native';

interface SectionTitleProps extends TextProps {
  title: string;
}

export default function SectionTitle({ title, className = '', ...rest }: SectionTitleProps) {
  return (
    <Text 
      className={`text-lg font-bold text-brand-dark mb-4 ${className}`}
      {...rest}
    >
      {title}
    </Text>
  );
}
