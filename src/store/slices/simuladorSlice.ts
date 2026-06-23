import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SimuladorState {
  step: number;
  necessidade: string | null;
  perfil: string | null;
  produtoSelecionadoId: string | null;
  
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
  garantiaSelecionada: string | null;
}

const initialState: SimuladorState = {
  step: 1,
  necessidade: null,
  perfil: null,
  produtoSelecionadoId: null,
  
  valorDesejado: 0,
  
  prazoMeses: 24,
  carenciaMeses: 6,
  sistemaAmortizacao: 'PRICE',
  possuiImovel: false,
  culturaSelecionada: null,
  areaHectares: 0,
  carNumero: null,
  cnpjMei: null,
  
  garantiaSelecionada: null,
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
    setProduto: (state, action: PayloadAction<string>) => {
      state.produtoSelecionadoId = action.payload;
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
    setGarantiaSelecionada: (state, action: PayloadAction<string | null>) => {
      state.garantiaSelecionada = action.payload;
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
  setGarantiaSelecionada,
  nextStep,
  prevStep,
  resetSimulador,
} = simuladorSlice.actions;

export default simuladorSlice.reducer;
