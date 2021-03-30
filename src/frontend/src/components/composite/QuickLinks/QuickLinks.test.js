import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import QuickLinks from './QuickLinks';

describe('<QuickLinks />', () => {
  test('it should mount', () => {
    render(<QuickLinks />);
    
    const quickLinks = screen.getByTestId('QuickLinks');

    expect(quickLinks).toBeInTheDocument();
  });
});