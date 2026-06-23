import React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';

interface BASASliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onValueChange: (val: number) => void;
}

export default function BASASlider({ value, min, max, step, onValueChange }: BASASliderProps) {
  return (
    <View className="py-2">
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step || 1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#0A3D24" // Dark green (escuro)
        maximumTrackTintColor="#E5E7EB" // Gray-200
        thumbTintColor="#0A3D24"
      />
    </View>
  );
}
