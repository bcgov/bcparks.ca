import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CreateAdvisory from './Advisory';

describe('<CreateAdvisory />', () => {
  test('it should mount', () => {
    render(<CreateAdvisory />);
    
    const createAdvisory = screen.getByTestId('CreateAdvisory');

    expect(createAdvisory).toBeInTheDocument();
  });
});