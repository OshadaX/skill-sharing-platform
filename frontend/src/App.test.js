import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
<<<<<<< HEAD
  const linkElement = screen.getByText(/learn react/i);
=======
  const linkElement = screen.getByRole('heading', { name: /Learning Plan Manager/i });
>>>>>>> 0ff9fcd164778cb2044874d37ef0ec54eaa67da1
  expect(linkElement).toBeInTheDocument();
});
