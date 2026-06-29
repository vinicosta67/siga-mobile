import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DocumentChecklistTemplate from '../../../../src/components/templates/DocumentChecklistTemplate';
import { useProdutoDetalhes } from '../../../../src/hooks/queries/useSimulador';
import { Alert, ActivityIndicator, View } from 'react-native';
import { updateProposal } from '../../../../src/services/proposalService';

export default function DocumentosController() {
  const router = useRouter();
  const { id, produto_id } = useLocalSearchParams();
  
  // Na versão final, produto_id poderia vir do detalhe da proposta na API
  // Aqui estamos usando do params se passado, ou mockando fallback
  const pId = typeof produto_id === 'string' ? produto_id : 'FNO_RURAL';
  
  const { data: detalhes, isLoading } = useProdutoDetalhes(pId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [documentosBasicos, setDocumentosBasicos] = useState<string[]>([
    "Documento de Identidade (RG/CNH)",
    "CPF",
    "Comprovante de Residência"
  ]);

  const [documentosEspecificos, setDocumentosEspecificos] = useState<string[]>([]);

  useEffect(() => {
    if (detalhes?.documentacao_necessaria) {
      if (detalhes.documentacao_necessaria.basicos?.length > 0) {
        setDocumentosBasicos(detalhes.documentacao_necessaria.basicos);
      }
      
      const esp = [];
      if (detalhes.documentacao_necessaria.especificos) {
        esp.push(...detalhes.documentacao_necessaria.especificos);
      }
      if (detalhes.documentacao_necessaria.condicionantes) {
        esp.push(...detalhes.documentacao_necessaria.condicionantes);
      }
      setDocumentosEspecificos(esp);
    } else {
        // Fallback
        setDocumentosEspecificos([
            "Projeto Técnico",
            "Certidão Negativa de Débitos",
            "Documentação da Garantia Ofertada"
        ]);
    }
  }, [detalhes]);

  const handleFinish = () => {
    Alert.alert(
      "Enviar Proposta",
      "Confirma o envio dos documentos anexados para análise?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Enviar", 
          style: "default",
          onPress: async () => {
            try {
              setIsSubmitting(true);
              const proposalId = typeof id === 'string' ? id : String(id);
              
              // Atualiza o status da proposta para TRIAGEM
              await updateProposal(proposalId, { status: 'TRIAGEM' });
              
              Alert.alert("Sucesso!", "Sua proposta foi enviada para análise técnica. Acompanhe o status pelo menu.");
              router.replace("/(tabs)/credito");
            } catch (error) {
              Alert.alert("Erro", "Não foi possível enviar a proposta para análise. Tente novamente.");
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
    <DocumentChecklistTemplate
      proposalId={typeof id === 'string' ? id : 'nova-proposta'}
      documentosBasicos={documentosBasicos}
      documentosEspecificos={documentosEspecificos}
      isLoading={isLoading}
      onFinish={handleFinish}
      onBack={handleBack}
    />
    {isSubmitting && (
      <View className="absolute inset-0 bg-black/30 items-center justify-center">
        <ActivityIndicator size="large" color="#92dc49" />
      </View>
    )}
    </>
  );
}
