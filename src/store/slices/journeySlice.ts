import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JourneyState {
  currentStep: number;
  clientData: {
    personalInfo: Record<string, any>;
    addressInfo: Record<string, any>;
    financialInfo: Record<string, any>;
  };
  draftId: string | null;
  isSubmitting: boolean;
}

const initialState: JourneyState = {
  currentStep: 1,
  clientData: {
    personalInfo: {},
    addressInfo: {},
    financialInfo: {},
  },
  draftId: null,
  isSubmitting: false,
};

export const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setPersonalInfo: (state, action: PayloadAction<Record<string, any>>) => {
      state.clientData.personalInfo = { ...state.clientData.personalInfo, ...action.payload };
    },
    setAddressInfo: (state, action: PayloadAction<Record<string, any>>) => {
      state.clientData.addressInfo = { ...state.clientData.addressInfo, ...action.payload };
    },
    setFinancialInfo: (state, action: PayloadAction<Record<string, any>>) => {
      state.clientData.financialInfo = { ...state.clientData.financialInfo, ...action.payload };
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    previousStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    setDraftId: (state, action: PayloadAction<string>) => {
      state.draftId = action.payload;
    },
    resetJourney: () => initialState,
  },
});

export const {
  setPersonalInfo,
  setAddressInfo,
  setFinancialInfo,
  nextStep,
  previousStep,
  setDraftId,
  resetJourney,
} = journeySlice.actions;

export default journeySlice.reducer;
