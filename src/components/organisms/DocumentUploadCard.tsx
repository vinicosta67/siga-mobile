import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { CheckCircle2, FileUp, Camera, Paperclip, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { generateSasToken, uploadToAzure, confirmDocumentUpload } from '../../services/proposalService';

interface DocumentUploadCardProps {
  proposalId: string;
  documentType: string;
  description?: string;
  onUploadSuccess?: () => void;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({ 
  proposalId, 
  documentType, 
  description,
  onUploadSuccess 
}) => {
  const [status, setStatus] = useState<'IDLE' | 'COMPRESSING' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const processAndUploadImage = async (uri: string, originalName: string, mimeType: string = 'image/jpeg') => {
    try {
      setStatus('COMPRESSING');
      
      // Comprime a imagem para evitar gargalo de upload
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }], // Redimensiona mantendo proporção
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      setThumbnail(manipResult.uri);
      await performUpload(manipResult.uri, originalName, mimeType);
    } catch (error: any) {
      console.error(error);
      setStatus('ERROR');
      setErrorMessage(error.message || 'Erro ao processar imagem');
    }
  };

  const performUpload = async (uri: string, fileName: string, mimeType: string) => {
    try {
      setStatus('UPLOADING');
      
      // 1. Pede Token SAS pro Backend
      const sasData = await generateSasToken(proposalId, fileName, documentType, description);
      
      // 2. Faz PUT direto no Azure usando o Token
      await uploadToAzure(sasData.sasUrl, uri, mimeType);
      
      // 3. Confirma o upload no backend para criar o registro no banco (Padrão ACID)
      await confirmDocumentUpload(proposalId, {
        originalName: fileName,
        type: documentType,
        description: description || '',
        blobUrl: sasData.blobUrl
      });
      
      setStatus('SUCCESS');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      console.error(error);
      setStatus('ERROR');
      setErrorMessage(error.message || 'Falha no upload para o servidor');
    }
  };

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à câmera para tirar fotos dos documentos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1, // Manipulamos a qualidade depois
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileName = asset.fileName || `${documentType.replace(/\\s/g, '_')}_${Date.now()}.jpg`;
      await processAndUploadImage(asset.uri, fileName, asset.mimeType || 'image/jpeg');
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        
        // Se for imagem, joga pro pipeline de compressão
        if (asset.mimeType?.startsWith('image/')) {
          await processAndUploadImage(asset.uri, asset.name, asset.mimeType);
        } else {
          // Se for PDF ou outro doc, sobe direto sem compressão de imagem
          setThumbnail(null); // PDF não tem thumbnail simples aqui
          await performUpload(asset.uri, asset.name, asset.mimeType || 'application/pdf');
        }
      }
    } catch (error: any) {
      console.error("Erro ao escolher documento:", error);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex-row items-center justify-between">
      <View className="flex-1 mr-4 flex-row items-center">
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} className="w-12 h-12 rounded-lg mr-3 bg-gray-100" />
        ) : (
          <View className={`w-12 h-12 rounded-lg mr-3 flex items-center justify-center ${status === 'SUCCESS' ? 'bg-green-50' : 'bg-gray-50'}`}>
            {status === 'SUCCESS' ? (
              <CheckCircle2 className="text-green-500" size={24} />
            ) : (
              <FileUp className="text-gray-400" size={24} />
            )}
          </View>
        )}
        
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-sm">{documentType}</Text>
          {description && <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>{description}</Text>}
          
          {status === 'ERROR' && (
            <Text className="text-red-500 text-xs mt-1 font-medium">{errorMessage}</Text>
          )}
          {status === 'COMPRESSING' && (
            <Text className="text-blue-500 text-xs mt-1">Otimizando arquivo...</Text>
          )}
          {status === 'UPLOADING' && (
            <Text className="text-blue-500 text-xs mt-1">Enviando de forma segura...</Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {status === 'COMPRESSING' || status === 'UPLOADING' ? (
          <View className="p-2">
            <ActivityIndicator size="small" color="#92dc49" />
          </View>
        ) : status === 'SUCCESS' ? (
          <TouchableOpacity 
            className="p-2 bg-gray-50 rounded-full"
            onClick={() => {
              setStatus('IDLE');
              setThumbnail(null);
            }}
          >
            <X size={16} className="text-gray-400" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              className="bg-gray-50 p-3 rounded-xl hover:bg-gray-100 active:scale-95 transition-transform"
              onPress={handleCamera}
            >
              <Camera size={20} className="text-gray-600" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-[#92dc49]/10 p-3 rounded-xl hover:bg-[#92dc49]/20 active:scale-95 transition-transform"
              onPress={handleDocumentPick}
            >
              <Paperclip size={20} className="text-[#92dc49]" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};
