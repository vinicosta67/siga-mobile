import { File } from 'expo-file-system';
import { fetch } from 'expo/fetch';
import { api } from './api';

export const getProposals = async () => {
  const { data } = await api.get('/proposals');
  return data;
};

export const getProposalById = async (proposalId: string) => {
  const { data } = await api.get(`/proposals/${proposalId}`);
  return data;
};

export const createProposal = async (payload: any) => {
  const { data } = await api.post('/proposals', payload);
  return data;
};

export const updateProposal = async (proposalId: string, payload: any) => {
  const { data } = await api.put(`/proposals/${proposalId}`, payload);
  return data;
};

export const generateSasToken = async (proposalId: string, originalName: string, type: string, description: string = '') => {
  const { data } = await api.post(`/proposals/${proposalId}/documents/sas-token`, {
    originalName,
    type,
    description
  });
  return data;
};

export const uploadToAzure = async (sasUrl: string, fileUri: string, mimeType: string) => {
  // A nova API do Expo 54+ utiliza a classe File e a implementação nativa de fetch 
  // para realizar uploads de binários de forma otimizada e sem vazamento de memória.
  const file = new File(fileUri);

  const azureResponse = await fetch(sasUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': mimeType,
    },
    body: file,
  });

  if (!azureResponse.ok) {
    const errorText = await azureResponse.text();
    throw new Error('Falha no upload: ' + errorText);
  }

  return azureResponse;
};

export const getDocumentReadUrl = async (proposalId: string, docId: string) => {
  const { data } = await api.get(`/proposals/${proposalId}/documents/${docId}/sas-token`);
  return data.sasUrl;
};

export const confirmDocumentUpload = async (proposalId: string, payload: { originalName: string, type: string, description: string, blobUrl: string }) => {
  const { data } = await api.post(`/proposals/${proposalId}/documents/confirm`, payload);
  return data;
};

export const triggerXcurve = async (cpfOuCnpj: string) => {
  try {
    const isCnpj = cpfOuCnpj.length > 11;
    const { data } = await api.post('/xcurve/analyze', { 
      cpf: isCnpj ? '' : cpfOuCnpj, 
      cnpj: isCnpj ? cpfOuCnpj : '' 
    });
    return data;
  } catch (err) {
    console.warn('Erro disparando Xcurve em background:', err);
  }
};

export const triggerAgronavis = async (cpfOuCnpj: string) => {
  try {
    const isCnpj = cpfOuCnpj.length > 11;
    const { data } = await api.post('/agronavis/analyze', { 
      cpf: isCnpj ? '' : cpfOuCnpj, 
      cnpj: isCnpj ? cpfOuCnpj : '' 
    });
    return data;
  } catch (err) {
    console.warn('Erro disparando Agronavis em background:', err);
  }
};
