import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VisibilityToggle from './VisibilityToggle';

describe('<VisibilityToggle />', () => {
  test('it should mount', () => {
    render(<VisibilityToggle />);
    
    const visibilityToggle = screen.getByTestId('VisibilityToggle');

    expect(visibilityToggle).toBeInTheDocument();
  });
});