import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SimuladorState {
  step: number;
  necessidade: string | null;
  perfil: string | null;
  uf: string | null;
  produtoSelecionadoId: string | null;
  produtoSelecionadoNome: string | null;

  // Etapa 3
  valorDesejado: number;

  // Etapa 4
  prazoMeses: number;
  carenciaMeses: number;
  sistemaAmortizacao: string;
  possuiImovel: boolean;
  culturaSelecionada: string | null;
  areaHectares: number;
  carNumero: string | null;
  cnpjMei: string | null;

  // Etapa 5
  garantiasSelecionadas: {
    id: string;
    tipo: string;
    descricao: string;
    valor: number;
  }[];
}

const initialState: SimuladorState = {
  step: 1,
  necessidade: null,
  perfil: null,
  uf: null,
  produtoSelecionadoId: null,
  produtoSelecionadoNome: null,

  valorDesejado: 0,

  prazoMeses: 24,
  carenciaMeses: 6,
  sistemaAmortizacao: 'PRICE',
  possuiImovel: false,
  culturaSelecionada: null,
  areaHectares: 0,
  carNumero: null,
  cnpjMei: null,

  garantiasSelecionadas: [],
};

const simuladorSlice = createSlice({
  name: 'simulador',
  initialState,
  reducers: {
    setNecessidade: (state, action: PayloadAction<string>) => {
      state.necessidade = action.payload;
    },
    setPerfil: (state, action: PayloadAction<string | null>) => {
      state.perfil = action.payload;
    },
    setUf: (state, action: PayloadAction<string | null>) => {
      state.uf = action.payload;
    },
    setProduto: (state, action: PayloadAction<{ id: string; nome: string }>) => {
      state.produtoSelecionadoId = action.payload.id;
      state.produtoSelecionadoNome = action.payload.nome;
      state.garantiasSelecionadas = [];
    },
    setValorDesejado: (state, action: PayloadAction<number>) => {
      state.valorDesejado = action.payload;
    },
    setPrazoMeses: (state, action: PayloadAction<number>) => {
      state.prazoMeses = action.payload;
    },
    setCarenciaMeses: (state, action: PayloadAction<number>) => {
      state.carenciaMeses = action.payload;
    },
    setSistemaAmortizacao: (state, action: PayloadAction<string>) => {
      state.sistemaAmortizacao = action.payload;
    },
    setPossuiImovel: (state, action: PayloadAction<boolean>) => {
      state.possuiImovel = action.payload;
    },
    setCulturaSelecionada: (state, action: PayloadAction<string | null>) => {
      state.culturaSelecionada = action.payload;
    },
    setAreaHectares: (state, action: PayloadAction<number>) => {
      state.areaHectares = action.payload;
    },
    setCarNumero: (state, action: PayloadAction<string | null>) => {
      state.carNumero = action.payload;
    },
    setCnpjMei: (state, action: PayloadAction<string | null>) => {
      state.cnpjMei = action.payload;
    },
    addGarantia: (state, action: PayloadAction<{ tipo: string; descricao: string; valor: number }>) => {
      state.garantiasSelecionadas.push({
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload
      });
    },
    removeGarantia: (state, action: PayloadAction<string>) => {
      state.garantiasSelecionadas = state.garantiasSelecionadas.filter(g => g.id !== action.payload);
    },
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) {
        state.step -= 1;
      }
    },
    resetSimulador: () => initialState,
  },
});

export const {
  setNecessidade,
  setPerfil,
  setUf,
  setProduto,
  setValorDesejado,
  setPrazoMeses,
  setCarenciaMeses,
  setSistemaAmortizacao,
  setPossuiImovel,
  setCulturaSelecionada,
  setAreaHectares,
  setCarNumero,
  setCnpjMei,
  addGarantia,
  removeGarantia,
  nextStep,
  prevStep,
  resetSimulador,
} = simuladorSlice.actions;

export default simuladorSlice.reducer;
