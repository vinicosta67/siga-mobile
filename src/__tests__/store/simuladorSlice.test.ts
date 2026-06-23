import simuladorReducer, {
  setNecessidade,
  setPerfil,
  setProduto,
  nextStep,
  prevStep,
  resetSimulador,
} from '@/src/store/slices/simuladorSlice';

describe('simuladorSlice', () => {
  const initialState = {
    step: 1,
    necessidade: null,
    perfil: null,
    produtoSelecionadoId: null,
  };

  it('should return the initial state', () => {
    expect(simuladorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setNecessidade', () => {
    const actual = simuladorReducer(initialState, setNecessidade('plantar'));
    expect(actual.necessidade).toEqual('plantar');
  });

  it('should handle setPerfil', () => {
    const actual = simuladorReducer(initialState, setPerfil('pf'));
    expect(actual.perfil).toEqual('pf');
  });

  it('should handle setProduto', () => {
    const actual = simuladorReducer(initialState, setProduto('fno-car'));
    expect(actual.produtoSelecionadoId).toEqual('fno-car');
  });

  it('should handle nextStep', () => {
    const actual = simuladorReducer(initialState, nextStep());
    expect(actual.step).toEqual(2);
  });

  it('should handle prevStep', () => {
    const state = { ...initialState, step: 2 };
    const actual = simuladorReducer(state, prevStep());
    expect(actual.step).toEqual(1);
  });

  it('should handle resetSimulador', () => {
    const state = {
      step: 3,
      necessidade: 'plantar',
      perfil: 'pf',
      produtoSelecionadoId: 'fno-car',
    };
    const actual = simuladorReducer(state, resetSimulador());
    expect(actual).toEqual(initialState);
  });
});
