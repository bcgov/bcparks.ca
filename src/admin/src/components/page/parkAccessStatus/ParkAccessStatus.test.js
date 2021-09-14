import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ParkAccessStatus from './ParkAccessStatus';

describe('<ParkAccessStatus />', () => {
  tesAccesst('it should mount', () => {
    render(<ParkAccessStatus />);
    
    const parkAccessStatus = screen.getByTestId('ParkAccessStatus');

   Access expect(parkAccessStatus).toBeInTheDocument();
  });Access
});