import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  isLoading = false,
  className = '',
  ...props 
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary';
      case 'destructive':
        return 'bg-destructive';
      case 'outline':
        return 'bg-transparent border border-border';
      case 'primary':
      default:
        return 'bg-primary';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'text-secondary-foreground';
      case 'destructive':
        return 'text-destructive-foreground';
      case 'outline':
        return 'text-foreground';
      case 'primary':
      default:
        return 'text-primary-foreground';
    }
  };

  return (
    <TouchableOpacity
      className={`w-full flex-row justify-center items-center py-4 rounded-md ${getVariantClasses()} ${props.disabled ? 'opacity-50' : ''} ${className}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? 'hsl(var(--foreground))' : 'hsl(var(--primary-foreground))'} />
      ) : (
        <Text className={`font-heading text-lg ${getTextClasses()}`}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
