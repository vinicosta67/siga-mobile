import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ComplementoState {
  // Endereço
  cep: string;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;

  // Negócio
  tipoPessoa: 'PF' | 'PJ' | null;
  cpfCnpj: string;
  nomeRazaoSocial: string;
  culturaPrincipal: string;
  faturamento: number;
  tamanhoColaboradores: string; // Ex: '1 a 5', '6 a 10', etc.

  // Contato
  telefone: string;
  email: string;
}

const initialState: ComplementoState = {
  cep: '',
  uf: '',
  cidade: '',
  bairro: '',
  logradouro: '',
  numero: '',
  complemento: '',

  tipoPessoa: null,
  cpfCnpj: '',
  nomeRazaoSocial: '',
  culturaPrincipal: '',
  faturamento: 0,
  tamanhoColaboradores: '',

  telefone: '',
  email: '',
};

const complementoSlice = createSlice({
  name: 'complemento',
  initialState,
  reducers: {
    setEndereco: (state, action: PayloadAction<Partial<ComplementoState>>) => {
      state.cep = action.payload.cep ?? state.cep;
      state.uf = action.payload.uf ?? state.uf;
      state.cidade = action.payload.cidade ?? state.cidade;
      state.bairro = action.payload.bairro ?? state.bairro;
      state.logradouro = action.payload.logradouro ?? state.logradouro;
      state.numero = action.payload.numero ?? state.numero;
      state.complemento = action.payload.complemento ?? state.complemento;
    },
    setNegocio: (state, action: PayloadAction<Partial<ComplementoState>>) => {
      state.tipoPessoa = action.payload.tipoPessoa ?? state.tipoPessoa;
      state.cpfCnpj = action.payload.cpfCnpj ?? state.cpfCnpj;
      state.nomeRazaoSocial = action.payload.nomeRazaoSocial ?? state.nomeRazaoSocial;
      state.culturaPrincipal = action.payload.culturaPrincipal ?? state.culturaPrincipal;
      state.faturamento = action.payload.faturamento ?? state.faturamento;
      state.tamanhoColaboradores = action.payload.tamanhoColaboradores ?? state.tamanhoColaboradores;
    },
    setContato: (state, action: PayloadAction<Partial<ComplementoState>>) => {
      state.telefone = action.payload.telefone ?? state.telefone;
      state.email = action.payload.email ?? state.email;
    },
    resetComplemento: () => initialState,
  },
});

export const { setEndereco, setNegocio, setContato, resetComplemento } = complementoSlice.actions;

export default complementoSlice.reducer;
