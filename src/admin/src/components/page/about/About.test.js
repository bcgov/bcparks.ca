import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import About from './About';

describe('<About />', () => {
  test('it should mount', () => {
    render(<About />);
    
    const about = screen.getByTestId('About');

    expect(about).toBeInTheDocument();
  });
});