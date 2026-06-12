import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  className?: string;
}

export function Button({ title, variant = 'primary', isLoading = false, className = '', ...props }: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-xl py-4 px-6 active:opacity-80';
  
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-surface',
    outline: 'border-2 border-primary bg-transparent'
  };

  const textClasses = {
    primary: 'text-white font-bold text-lg text-center',
    secondary: 'text-text font-semibold text-lg text-center',
    outline: 'text-primary font-bold text-lg text-center'
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${isLoading ? 'opacity-70' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#6366f1' : '#ffffff'} />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
