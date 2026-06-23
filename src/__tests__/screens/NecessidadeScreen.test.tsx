import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '@/src/store';
import NecessidadeScreen from '@/app/(credito)/simulador/necessidade';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('NecessidadeScreen', () => {
  it('renders correctly and handles selection', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <NecessidadeScreen />
      </Provider>
    );

    expect(getByText('O que voce precisa?')).toBeTruthy();
    expect(getByText('Quero plantar')).toBeTruthy();

    const btnContinuar = getByTestId('btn-continuar');
    expect(btnContinuar.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(getByText('Quero plantar'));

    expect(btnContinuar.props.accessibilityState.disabled).toBe(false);
  });
});
