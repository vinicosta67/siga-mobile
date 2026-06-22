import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '@/src/components/Header';
import AccountsCard from '@/src/components/AccountsCard';
import QuickActionButtons from '@/src/components/QuickActionButtons';
import CreditCardBanner from '@/src/components/CreditCardBanner';
import InvestmentsCard from '@/src/components/InvestmentsCard';
import CreditDashboardBanner from '@/src/components/CreditDashboardBanner';
import PreApprovedCard from '@/src/components/PreApprovedCard';
import ProposalCard from '@/src/components/ProposalCard';
import ContractCard from '@/src/components/ContractCard';
import CreditSolutionsList from '@/src/components/CreditSolutionsList';
import HelpCenter from '@/src/components/HelpCenter';
import FeedbackCard from '@/src/components/FeedbackCard';
import { useRouter } from 'expo-router';
import SectionTitle from '@/src/components/SectionTitle';

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleToggleVisibility = () => setIsVisible(!isVisible);

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Header 
          isVisible={isVisible} 
          onToggleVisibility={handleToggleVisibility} 
        />
        
        <View className="-mt-16 px-4">
          <AccountsCard isVisible={isVisible} />
          
          <QuickActionButtons />
          
          <CreditCardBanner isVisible={isVisible} />

          <InvestmentsCard isVisible={isVisible} />

          <CreditDashboardBanner 
            isVisible={isVisible} 
            onSimulatePress={() => console.log('Simular')} 
          />

          {/* Missing Sections Added Below */}
          <View className="mt-6 mb-4">
            <PreApprovedCard 
              count={3} 
              onPress={() => router.push('/(credito)/pre-aprovado')} 
            />
          </View>

          <View className="mt-4">
            <SectionTitle title="Minhas Propostas" />
            <ProposalCard 
              title="FNO-CAR" 
              id="#SIGA-2026-001847" 
              progress={58} 
              onPress={() => router.push('/(propostas)/' as any)} 
            />
          </View>

          <View className="mt-6">
            <SectionTitle title="Meus Contratos" />
            <ContractCard 
              title="FNO-Investimento" 
              value="R$ 150.000,00" 
              dueDate="20/10/2026" 
              status="adimplente" 
              onPress={() => console.log('Contrato')} 
            />
          </View>

          <View className="mt-6">
            <SectionTitle title="Soluções de crédito" />
            <CreditSolutionsList />
          </View>

          <View className="mt-8">
            <SectionTitle title="Precisa de ajuda?" />
            <HelpCenter />
          </View>

          <View className="mt-8">
            <SectionTitle title="O que está achando?" />
            <FeedbackCard />
          </View>
        </View>
      </ScrollView>

      {/* FAB Gear Icon */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-gray-200 w-14 h-14 rounded-full items-center justify-center shadow-md border-4 border-white"
        onPress={() => console.log('Settings')}
      >
        <MaterialIcons name="settings" size={28} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}
