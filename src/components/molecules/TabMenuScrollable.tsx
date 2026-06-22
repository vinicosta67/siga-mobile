import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export interface TabOption {
  id: string;
  label: string;
}

interface TabMenuScrollableProps {
  tabs: TabOption[];
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export default function TabMenuScrollable({ tabs, activeTabId, onTabChange }: TabMenuScrollableProps) {
  return (
    <View className="border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          minWidth: 500
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
              className="py-4 justify-center items-center relative"
            >
              <Text
                className={`text-[15px] ${isActive ? 'font-bold text-[#0A3D24]' : 'font-medium text-gray-400'
                  }`}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0A3D24] rounded-t-md" />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
