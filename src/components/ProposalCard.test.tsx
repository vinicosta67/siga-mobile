import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProposalCard from './ProposalCard';

describe('ProposalCard Component', () => {
  const mockProps = {
    title: 'FNO-CAR',
    id: '#SIGA-2026-001847',
    progress: 58,
    onPress: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText } = render(<ProposalCard {...mockProps} />);
    
    expect(getByText('FNO-CAR')).toBeTruthy();
    expect(getByText('#SIGA-2026-001847')).toBeTruthy();
    expect(getByText('58%')).toBeTruthy();
  });

  it('triggers onPress', () => {
    const { getByTestId } = render(<ProposalCard {...mockProps} />);
    
    fireEvent.press(getByTestId('proposal-card'));
    expect(mockProps.onPress).toHaveBeenCalled();
  });
});
