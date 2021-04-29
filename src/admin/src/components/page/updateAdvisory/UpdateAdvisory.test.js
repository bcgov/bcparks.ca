import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UpdateAdvisory from './UpdateAdvisory';

describe('<UpdateAdvisory />', () => {
  test('it should mount', () => {
    render(<UpdateAdvisory />);
    
    const UpdateAdvisory = screen.getByTestId('UpdateAdvisory');

    expect(UpdateAdvisory).toBeInTheDocument();
  });
});