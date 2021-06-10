import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CmsContents from './CmsContents';

describe('<CmsContents />', () => {
  test('it should mount', () => {
    render(<CmsContents />);
    
    const cmsContents = screen.getByTestId('CmsContents');

    expect(cmsContents).toBeInTheDocument();
  });
});