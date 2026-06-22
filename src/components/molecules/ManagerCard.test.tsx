import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ManagerCard from './ManagerCard';

describe('ManagerCard', () => {
  it('renders correctly with given props', () => {
    const { getByText } = render(
      <ManagerCard 
        managerName="Ana Paula Santos" 
        onContactPress={() => {}} 
      />
    );

    expect(getByText('Seu gerente: Ana Paula Santos')).toBeTruthy();
    expect(getByText('Ag. Belém Centro — Pronto para atender')).toBeTruthy();
  });

  it('calls onContactPress when the contact button is pressed', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <ManagerCard 
        managerName="Ana Paula Santos" 
        onContactPress={handlePress} 
      />
    );

    const contactButton = getByTestId('manager-contact-button');
    fireEvent.press(contactButton);

    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});
