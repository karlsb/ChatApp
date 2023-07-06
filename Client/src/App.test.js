import { render, screen } from '@testing-library/react';
import App from './App';

test('Create User', () => {
  render(<App />);
  const linkElement = screen.getByText(/Create User/i);
  expect(linkElement).toBeInTheDocument();
});

