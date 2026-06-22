import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

export type FiltroCategoria = 'todos' | 'destaque' | 'rural' | 'mpe' | 'educativo';

interface FilterPillsProps {
  filtros: { id: FiltroCategoria; label: string }[];
  activeFiltro: FiltroCategoria;
  onSelectFiltro: (id: FiltroCategoria) => void;
}

export default function FilterPills({ filtros, activeFiltro, onSelectFiltro }: FilterPillsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
      className="max-h-[50px]"
    >
      {filtros.map((f) => {
        const isActive = activeFiltro === f.id;
        return (
          <TouchableOpacity
            key={f.id}
            onPress={() => onSelectFiltro(f.id)}
            activeOpacity={0.7}
            className={`mr-2 px-4 py-2.5 rounded-full border ${
              isActive 
                ? 'bg-brand-dark border-brand-dark' 
                : 'bg-white border-gray-200'
            }`}
          >
            <Text 
              className={`text-[13px] font-bold ${
                isActive ? 'text-white' : 'text-gray-500'
              }`}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
