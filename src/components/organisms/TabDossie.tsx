import { MaterialIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useProdutoDetalhes } from '../../hooks/queries/useSimulador';
import { getDocumentReadUrl, updateProposal } from '../../services/proposalService';
import { PropostaModel } from '../../utils/propostaMockData';
import { DocumentUploadCard } from './DocumentUploadCard';

interface TabDossieProps {
  proposta: PropostaModel;
}

export default function TabDossie({ proposta }: TabDossieProps) {
  const [uploadModal, setUploadModal] = useState({ visible: false, documentType: '', description: '' });
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  let pId = 'P16';
  const metadata = (proposta as any).metadata;
  if (typeof metadata === 'string') {
    try {
      pId = JSON.parse(metadata).produto_id || pId;
    } catch (e) { }
  } else if (metadata?.produto_id) {
    pId = metadata.produto_id;
  }

  const { data: detalhes } = useProdutoDetalhes(pId);

  const documentosVisiveis = useMemo(() => {
    // Remove os documentos fictícios do backend gerados automaticamente (ex: "Documento 1")
    const listaUploads = proposta.documentos.filter(d => !/^Documento \d+$/i.test(d.nome));
    const finalDocs: any[] = [];
    const nomesAdicionados = new Set<string>();

    let basicos: string[] = [];
    let especificos: string[] = [];
    let condicionantes: string[] = [];

    if (detalhes?.documentacao_necessaria) {
      basicos = detalhes.documentacao_necessaria.basicos || [];
      especificos = detalhes.documentacao_necessaria.especificos || [];
      condicionantes = detalhes.documentacao_necessaria.condicionantes || [];
    } else {
      // Fallback estrito caso a API de vitrine não encontre o produto (ex: P16)
      const sigla = proposta.siglaProduto?.toUpperCase();
      if (sigla === 'INVESTIMENTO') {
        basicos = ['Documento de Identidade (RG/CNH)', 'CPF', 'Imposto de Renda / Balanço'];
        especificos = ['Projeto Técnico Agronômico', 'Matrícula do Imóvel (CRI)', 'Orçamento dos Bens'];
        condicionantes = ['Licença Ambiental'];
      } else if (sigla === 'CUSTEIO') {
        basicos = ['Contrato Social / Estatuto', 'Certidão Negativa de Débitos'];
        especificos = ['CCIR – Certificado de Imóvel Rural', 'CAR – Cadastro Ambiental Rural', 'Matrícula do Imóvel (CRI)', 'Orçamento de Custeio'];
        condicionantes = [];
      } else {
        basicos = ['Documento de Identidade (RG/CNH)', 'CPF/CNPJ', 'Comprovante de Residência'];
      }
    }

    const mapDocs = (listaNomes: string[], categoria: string) => {
      listaNomes.forEach(nomeNecessario => {
        const jaExiste = listaUploads.find(d => d.nome.toLowerCase() === nomeNecessario.toLowerCase());
        if (jaExiste) {
          finalDocs.push({ ...jaExiste, categoria });
        } else {
          finalDocs.push({
            id: `temp_${Math.random()}`,
            nome: nomeNecessario,
            tipo: 'N/A',
            tamanho: '0 KB',
            status: 'Pendente',
            ok: false,
            categoria
          });
        }
        nomesAdicionados.add(nomeNecessario.toLowerCase());
      });
    };

    mapDocs(basicos, 'DOCUMENTOS BÁSICOS');
    mapDocs(especificos, 'DOCUMENTOS ESPECÍFICOS DA OPERAÇÃO');
    mapDocs(condicionantes, 'CONDICIONANTES');

    // Adiciona os que o usuário enviou e não estavam em nenhuma lista
    listaUploads.forEach(u => {
      if (!nomesAdicionados.has(u.nome.toLowerCase())) {
        finalDocs.push({ ...u, categoria: 'DOCUMENTOS ADICIONAIS' });
      }
    });

    return finalDocs;
  }, [proposta.documentos, detalhes]);

  const handleUploadSuccess = async () => {
    try {
      // Limpa todo o cache de documentos para forçar o download dos novos
      const cacheDir = new Directory(Paths.cache, 'siga_docs');
      if (cacheDir.exists) {
        await cacheDir.deleteAsync();
      }
    } catch (e) {
      console.warn('Erro ao limpar cache:', e);
    }

    // Invalida a query para forçar o recarregamento dos dados e mostrar o arquivo como "Validado/Enviado" (Ficando verde)
    queryClient.invalidateQueries({ queryKey: ['proposta', proposta.id] });
  };

  const handleViewDocument = async (docId: string, extension: string) => {
    // Evita múltiplos cliques que causam o erro "Destination already exists"
    if (loadingDocId) return;

    try {
      setLoadingDocId(docId);

      // 1. Busca a URL segura temporária no back-end
      const url = await getDocumentReadUrl(proposta.id, docId);

      // 2. Prepara o diretório de destino usando a nova API nativa
      const cacheDir = new Directory(Paths.cache, 'siga_docs');
      if (!cacheDir.exists) {
        cacheDir.create();
      }

      const ext = extension.toLowerCase() === 'arquivo' ? 'pdf' : extension.toLowerCase();
      const localFile = new File(cacheDir, `documento_${docId}.${ext}`);

      // 3. Faz o download direto apenas se o arquivo não estiver no cache
      if (!localFile.exists) {
        const downloadedFile = await File.downloadFileAsync(url, cacheDir);
        // O downloadFileAsync já salva o arquivo com seu nome original baseado na URL
        // Como o arquivo baixado pode não ter a extensão correta caso o backend não devolva no nome,
        // renomeamos o arquivo de forma inteligente.
        // Se, por milagre, o arquivo já existir aqui, o move não deve quebrar
        if (!localFile.exists) {
          downloadedFile.move(localFile);
        }
      }

      // 4. Abre o arquivo nativamente usando a URI do objeto File
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(localFile.uri, {
          mimeType: ext === 'pdf' ? 'application/pdf' : `image/${ext}`,
          dialogTitle: 'Visualizar Documento',
          UTI: ext === 'pdf' ? 'com.adobe.pdf' : 'public.image' // Melhora compatibilidade no iOS
        });
      } else {
        Alert.alert('Erro', 'O compartilhamento não está disponível no seu dispositivo.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar o documento.');
    } finally {
      setLoadingDocId(null);
    }
  };

  const total = documentosVisiveis.length;
  const validados = documentosVisiveis.filter(d => d.status === 'Validado').length;
  const pendentes = documentosVisiveis.filter(d => d.status === 'Pendente').length;
  const vencidos = documentosVisiveis.filter(d => d.status === 'Vencido').length;

  const canSubmit = proposta.status === 'RASCUNHO' && pendentes === 0 && vencidos === 0 && validados > 0;

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
              await updateProposal(proposta.id, { status: 'TRIAGEM' });
              Alert.alert("Sucesso!", "Sua proposta foi enviada para análise técnica. Acompanhe o status.");
              queryClient.invalidateQueries({ queryKey: ['proposta', proposta.id] });
              queryClient.invalidateQueries({ queryKey: ['propostas'] });
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

  return (
    <ScrollView className="bg-gray-50 flex-1" contentContainerStyle={{ padding: 16 }}>
      {/* KPIs Minimalistas */}
      <View className="flex-row items-center justify-between mb-6 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <KpiMini label="Total" valor={total} color="#4B5563" icon="folder" />
        <View className="w-[1px] h-8 bg-gray-100" />
        <KpiMini label="Validados" valor={validados} color="#10B981" icon="check-circle" />
        <View className="w-[1px] h-8 bg-gray-100" />
        <KpiMini label="Pendentes" valor={pendentes + vencidos} color="#F59E0B" icon="pending-actions" />
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-bold text-[16px] text-gray-800">Documentos</Text>
        <Text className="text-[12px] font-medium text-gray-400">{validados} de {total} enviados</Text>
      </View>

      {/* Lista de Documentos por Categoria */}
      {['DOCUMENTOS BÁSICOS', 'DOCUMENTOS ESPECÍFICOS DA OPERAÇÃO', 'CONDICIONANTES', 'DOCUMENTOS ADICIONAIS'].map(categoria => {
        const docsDaCategoria = documentosVisiveis.filter(d => d.categoria === categoria);

        if (docsDaCategoria.length === 0) return null;

        return (
          <View key={categoria} className="mb-6">
            <Text className="text-[12px] font-bold text-gray-800 mb-3 ml-1 uppercase tracking-wider">{categoria}</Text>

            {docsDaCategoria.map((doc) => {
              const isPendente = doc.status === 'Pendente' || doc.status === 'Vencido';

              if (isPendente) {
                // Renderiza o componente de upload real
                return (
                  <View key={doc.id} className="mb-4">
                    <DocumentUploadCard
                      proposalId={proposta.id}
                      documentType={doc.nome}
                      description={doc.status === 'Vencido' ? 'Documento vencido, por favor envie um atualizado.' : (categoria === 'CONDICIONANTES' ? 'Necessário para liberação ou continuidade.' : 'Obrigatório para o seu perfil ou operação.')}
                      onUploadSuccess={handleUploadSuccess}
                    />
                  </View>
                );
              }

              // Renderiza o documento validado (minimalista)
              return (
                <View key={doc.id} className="bg-white rounded-xl p-4 mb-3 border border-gray-100 flex-row items-center justify-between shadow-sm">
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-8 h-8 rounded-full bg-green-50 items-center justify-center mr-3">
                      <MaterialIcons name="check" size={16} color="#10B981" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-gray-700 text-[13px] mb-0.5" numberOfLines={1} ellipsizeMode="tail">{doc.nome}</Text>
                      <Text className="text-gray-400 text-[11px] font-medium">{doc.tamanho} • {doc.tipo}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      className="p-1 mr-3"
                      onPress={() => setUploadModal({ visible: true, documentType: doc.nome, description: 'Reenviar documento atualizado.' })}
                    >
                      <MaterialIcons name="refresh" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-1" onPress={() => handleViewDocument(doc.id, doc.tipo)}>
                      {loadingDocId === doc.id ? (
                        <ActivityIndicator size="small" color="#10B981" />
                      ) : (
                        <MaterialIcons name="remove-red-eye" size={20} color="#9CA3AF" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}

      {/* Botão extra para envio espontâneo caso necessário */}
      <TouchableOpacity
        onPress={() => setUploadModal({ visible: true, documentType: 'Documento Adicional', description: 'Anexe um arquivo complementar à sua proposta.' })}
        className="mt-2 py-3 px-4 rounded-xl border border-dashed border-gray-300 flex-row items-center justify-center bg-gray-50 mb-4"
      >
        <MaterialIcons name="add" size={18} color="#6B7280" />
        <Text className="text-gray-500 font-bold text-[13px] ml-2">Anexar outro documento</Text>
      </TouchableOpacity>

      {/* Botão de Envio para Análise */}
      {canSubmit && (
        <TouchableOpacity
          onPress={handleFinish}
          disabled={isSubmitting}
          className="bg-[#0A3D24] p-4 rounded-xl flex-row justify-center items-center mb-8 shadow-sm"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold text-[16px]">Enviar para Análise</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Modal dinâmico de Upload */}
      <Modal visible={uploadModal.visible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 min-h-[50%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[18px] font-bold text-gray-900">{uploadModal.documentType === 'Documento Adicional' ? 'Novo Documento' : 'Substituir Documento'}</Text>
              <TouchableOpacity onPress={() => setUploadModal({ visible: false, documentType: '', description: '' })}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <DocumentUploadCard
              proposalId={proposta.id}
              documentType={uploadModal.documentType}
              description={uploadModal.description}
              onUploadSuccess={() => {
                setUploadModal({ visible: false, documentType: '', description: '' });
                handleUploadSuccess();
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function KpiMini({ label, valor, color, icon }: { label: string, valor: number, color: string, icon: string }) {
  return (
    <View className="items-center justify-center px-2">
      <View className="flex-row items-center mb-1">
        <MaterialIcons name={icon as any} size={14} color={color} />
        <Text className="font-bold text-[18px] ml-1.5" style={{ color }}>{valor}</Text>
      </View>
      <Text className="font-medium text-[10px] text-gray-500 uppercase tracking-wider">{label}</Text>
    </View>
  );
}
