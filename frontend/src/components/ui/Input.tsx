import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className={`w-full mb-4 ${className}`}>
      {label && <Text className="text-subtext mb-2 font-medium ml-1">{label}</Text>}
      <TextInput
        className={`bg-surface text-text rounded-xl p-4 border ${error ? 'border-red-500' : 'border-transparent'} focus:border-primary`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error && <Text className="text-red-500 mt-1 text-sm ml-1">{error}</Text>}
    </View>
  );
}
