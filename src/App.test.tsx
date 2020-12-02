import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TodoList', () => {
  render(<App />);
  const todoList = screen.getByTestId('todo-list');
  expect(todoList).toBeInTheDocument();
});
