import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TodoList', () => {
  render(<App />);
  const todoHeader = screen.getByTestId('todo-list');
  expect(todoHeader).toBeInTheDocument();
});
