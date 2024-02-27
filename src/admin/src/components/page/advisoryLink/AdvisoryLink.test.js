import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdvisoryLink from './AdvisoryLink';

describe('<AdvisoryLink />', () => {
  test('it should mount', () => {
    render(<AdvisoryLink />);
    
    const advisoryLink = screen.getByTestId('AdvisoryLink');

    expect(advisoryLink).toBeInTheDocument();
  });
});