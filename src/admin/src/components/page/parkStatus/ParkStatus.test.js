import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ParkStatus from './ParkStatus';

describe('<ParkStatus />', () => {
  test('it should mount', () => {
    render(<ParkStatus />);
    
    const parkStatus = screen.getByTestId('ParkStatus');

    expect(parkStatus).toBeInTheDocument();
  });
});