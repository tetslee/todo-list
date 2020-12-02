import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { TodoList } from './TodoList';
import { createTask } from './task';

it('renders a header', () => {
  render(<TodoList />);
  const todoList = screen.getByText(/Todo items/i);
  expect(todoList).toBeInTheDocument();
});

it('renders a task list', () => {
  const task = createTask();
  const tasks = { [task.id]: task };
  render(<TodoList initialTasks={tasks} />);
  const taskRow = screen.getByTestId('task-row');
  expect(taskRow).toBeInTheDocument();
});

it('can add a task', () => {
  render(<TodoList />);
  const addButton = screen.getByRole('button', { name: /add/i });
  expect(addButton).toBeInTheDocument();

  expect(screen.queryAllByTestId('task-row')).toEqual([]);
  fireEvent.click(addButton);
  expect(screen.queryAllByTestId('task-row').length).toBe(1);
});

it('can update a task name', () => {
  const task = createTask();
  task.name = 'Foo';
  const tasks = { [task.id]: task };
  render(<TodoList initialTasks={tasks} />);
  const nameInput = screen.getByTestId('name-input');
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).toHaveValue('Foo');

  fireEvent.change(nameInput, { target: { value: 'bar' } });
  expect(nameInput).toHaveValue('bar');
});

it('can update a task priority', () => {
  const task = createTask();
  task.priority = 4;
  const tasks = { [task.id]: task };
  render(<TodoList initialTasks={tasks} />);
  const priorityInput = screen.getByTestId('priority-input');
  expect(priorityInput).toBeInTheDocument();
  expect(priorityInput).toHaveValue(4);

  fireEvent.change(priorityInput, { target: { value: '3' } });
  expect(priorityInput).toHaveValue(3);
});

it('can delete a task', () => {
  const task = createTask();
  const tasks = { [task.id]: task };
  render(<TodoList initialTasks={tasks} />);

  const deleteButton = screen.getByRole('button', { name: /delete/i });

  expect(screen.queryAllByTestId('task-row').length).toBe(1);
  fireEvent.click(deleteButton);
  expect(screen.queryAllByTestId('task-row').length).toBe(0);
});

it('can complete a task', () => {
  const task = createTask();
  const tasks = { [task.id]: task };
  render(<TodoList initialTasks={tasks} />);

  const completeButton = screen.getByRole('button', { name: /complete/i });

  const taskRow = screen.getByTestId('task-row');
  expect(taskRow.classList.contains('task-completed')).toBe(false);
  fireEvent.click(completeButton);
  expect(taskRow.classList.contains('task-completed')).toBe(true);
});

it('can view tasks sorted by priority', () => {

});

it('can view tasks sorted by priority', () => {

});
