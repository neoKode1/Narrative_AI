import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import ImageGenerator from './components/ImageGenerator';

// Mock the ImageGenerator component
jest.mock('./components/ImageGenerator', () => ({
  __esModule: true,
  default: ({ onImageGenerated }) => (
    <div>
      <button onClick={() => onImageGenerated('http://localhost:5000/public/generated-image.png')}>
        Mock Generate Image
      </button>
    </div>
  ),
}));

test('renders the Narrative AI heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Narrative AI/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders the Image Generator component', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Mock Generate Image/i);
  expect(buttonElement).toBeInTheDocument();
});

test('generates an image and displays it', () => {
  render(<App />);

  // Simulate image generation
  const generateButton = screen.getByText(/Mock Generate Image/i);
  fireEvent.click(generateButton);

  // Check if the generated image is displayed
  const generatedImage = screen.getByAltText('Generated');
  expect(generatedImage).toBeInTheDocument();
  expect(generatedImage).toHaveAttribute('src', 'http://localhost:5000/public/generated-image.png');
});
