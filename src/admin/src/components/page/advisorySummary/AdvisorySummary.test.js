import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdvisorySummary from './AdvisorySummary';

describe('<AdvisorySummary />', () => {
  test('it should mount', () => {
    render(<AdvisorySummary />);
    
    const advisorySummary = screen.getByTestId('AdvisorySummary');

    expect(advisorySummary).toBeInTheDocument();
  });
});