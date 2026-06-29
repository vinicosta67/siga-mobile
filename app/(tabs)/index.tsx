import AccountsCard from '@/src/components/AccountsCard';
import ContractCard from '@/src/components/ContractCard';
import CreditCardBanner from '@/src/components/CreditCardBanner';
import CreditDashboardBanner from '@/src/components/CreditDashboardBanner';
import FeedbackCard from '@/src/components/FeedbackCard';
import Header from '@/src/components/Header';
import HelpCenter from '@/src/components/HelpCenter';
import InvestmentsCard from '@/src/components/InvestmentsCard';
import PreApprovedCard from '@/src/components/PreApprovedCard';
import PropostaListCard from '@/src/components/molecules/PropostaListCard';
import QuickActionButtons from '@/src/components/QuickActionButtons';
import SectionTitle from '@/src/components/SectionTitle';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePropostas } from '@/src/hooks/queries/usePropostas';

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: propostas, isLoading: isLoadingPropostas } = usePropostas();

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
            onSimulatePress={() => router.push('/(credito)/simulador/necessidade')}
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
            {isLoadingPropostas ? (
              <View className="py-8 items-center justify-center bg-white rounded-[16px] border border-gray-200">
                <ActivityIndicator size="small" color="#0A3D24" />
                <Text className="text-gray-500 mt-2 text-[12px]">Buscando propostas...</Text>
              </View>
            ) : propostas && propostas.length > 0 ? (
              propostas.slice(0, 3).map((prop) => (
                <View key={prop.id} className="mb-3">
                  <PropostaListCard
                    proposta={prop}
                    onPress={() => router.push(`/(propostas)/${prop.id}` as any)}
                  />
                </View>
              ))
            ) : (
              <View className="py-8 items-center justify-center bg-white rounded-[16px] border border-gray-200">
                <Text className="text-gray-500 text-[14px]">Nenhuma proposta encontrada.</Text>
              </View>
            )}
          </View>

          <View className="mt-6">
            <SectionTitle title="Meus Contratos" />
            <ContractCard
              title="FNO-Investimento"
              value="R$ 150.000,00"
              dueDate="20/10/2026"
              status="adimplente"
              onPress={() => router.push('/(credito)/meus-contratos')}
            />
          </View>

          {/* <View className="mt-6">
            <SectionTitle title="Soluções de crédito" />
            <CreditSolutionsList />
          </View> */}

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
    </View>
  );
}
