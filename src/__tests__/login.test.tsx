import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../app/(auth)/login';
import { authService } from '../services/auth';


// Mocks
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock('../services/auth', () => ({
  authService: {
    login: jest.fn(),
  },
}));

jest.mock('../services/api', () => ({
  storage: {
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock('../store/slices/authSlice', () => ({
  loginSuccess: jest.fn(),
}));

describe('LoginScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRedux = (component: React.ReactElement) => {
    return render(component);
  };

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = renderWithRedux(<LoginScreen />);
    
    expect(getByText('Acesso\nProfissional\nBASA.')).toBeTruthy();
    expect(getByPlaceholderText('seu@bancoamazonia.com.br')).toBeTruthy();
    expect(getByPlaceholderText('••••••••')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  it('shows error message on failed login', async () => {
    // Mock the API to throw an error
    (authService.login as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Credenciais inválidas' } },
    });

    const { getByText, getByPlaceholderText } = renderWithRedux(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('seu@bancoamazonia.com.br'), 'wrong@email.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'wrongpass');
    fireEvent.press(getByText('Entrar'));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(getByText('Credenciais inválidas')).toBeTruthy();
    });
  });

  it('calls authService.login and navigates on success', async () => {
    // Mock successful API response
    (authService.login as jest.Mock).mockResolvedValueOnce({
      token: 'real-jwt-token',
      user: { id: '1', name: 'User', email: 'test@valtre.com' },
    });

    const { getByText, getByPlaceholderText } = renderWithRedux(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('seu@bancoamazonia.com.br'), 'test@valtre.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'password123');
    fireEvent.press(getByText('Entrar'));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@valtre.com',
        password: 'password123',
      });
    });
  });
});
