import React from 'react';
import { render } from '@testing-library/react-native';
import SectionTitle from './SectionTitle';

describe('SectionTitle Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SectionTitle title="Soluções de crédito" />);
    expect(getByText('Soluções de crédito')).toBeTruthy();
  });
});
