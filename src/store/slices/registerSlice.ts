import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PfType = 'FISICA' | 'JURIDICA';

export interface RegisterState {
  pfType: PfType | null;
  cpfCnpj: string;
  name: string;
  birthDate?: string;
  email: string;
  phone: string;
  zipCode: string;
  city: string;
  state: string;
  address: string;
  neighborhood: string;
  addressNumber: string;
  companySize?: string;
  mainPartnerName?: string;
  mainPartnerCpf?: string;
  mainPartnerBirthDate?: string;
}

const initialState: RegisterState = {
  pfType: null,
  cpfCnpj: '',
  name: '',
  birthDate: '',
  email: '',
  phone: '',
  zipCode: '',
  city: '',
  state: '',
  address: '',
  neighborhood: '',
  addressNumber: '',
  companySize: '',
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setPfType: (state, action: PayloadAction<PfType>) => {
      state.pfType = action.payload;
    },
    updateRegisterData: (state, action: PayloadAction<Partial<RegisterState>>) => {
      return { ...state, ...action.payload };
    },
    resetRegisterData: () => initialState,
  },
});

export const { setPfType, updateRegisterData, resetRegisterData } = registerSlice.actions;

export default registerSlice.reducer;
