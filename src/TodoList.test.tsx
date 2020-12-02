import React from 'react';
import {
  render, screen, fireEvent, getNodeText,
} from '@testing-library/react';
import { TodoList } from './TodoList';
import { createTask, TaskStatus } from './task';

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

it('can view tasks sorted by name', () => {
  const task1 = createTask({ name: 'b' });
  const task2 = createTask({ name: 'a' });
  const tasks = { [task1.id]: task1, [task2.id]: task2 };
  render(<TodoList initialTasks={tasks} />);

  let nameInputs = screen.getAllByTestId('name-input');
  expect(nameInputs.length).toBe(2);

  // initially in order they were added to the object
  expect(nameInputs[0]).toHaveValue('b');
  expect(nameInputs[1]).toHaveValue('a');

  const nameHeader = screen.getByText(/Name/i);
  expect(nameHeader).toBeInTheDocument();
  expect(nameHeader.getAttribute('aria-sort')).toBe('none');

  // first click should sort asc
  fireEvent.click(nameHeader);
  expect(nameHeader.getAttribute('aria-sort')).toBe('ascending');
  nameInputs = screen.getAllByTestId('name-input');
  expect(nameInputs[0]).toHaveValue('a');
  expect(nameInputs[1]).toHaveValue('b');

  // then sorted desc
  fireEvent.click(nameHeader);
  expect(nameHeader.getAttribute('aria-sort')).toBe('descending');
  nameInputs = screen.getAllByTestId('name-input');
  expect(nameInputs[0]).toHaveValue('b');
  expect(nameInputs[1]).toHaveValue('a');
});

it('can view tasks sorted by priority', () => {
  const task1 = createTask({ priority: 1 });
  const task2 = createTask({ priority: 2 });
  const tasks = { [task1.id]: task1, [task2.id]: task2 };
  render(<TodoList initialTasks={tasks} />);

  let priorityInputs = screen.getAllByTestId('priority-input');
  expect(priorityInputs.length).toBe(2);

  // initially sorted descending by default (higher priority at the top)
  const priorityHeader = screen.getByText(/Priority/i);
  expect(priorityHeader).toBeInTheDocument();
  expect(priorityHeader.getAttribute('aria-sort')).toBe('descending');
  expect(priorityInputs[0]).toHaveValue(2);
  expect(priorityInputs[1]).toHaveValue(1);

  // change sort back to name so we can test the first click on priority
  fireEvent.click(screen.getByText(/Name/i));
  expect(priorityHeader.getAttribute('aria-sort')).toBe('none');

  // first click should sort desc
  fireEvent.click(priorityHeader);
  expect(priorityHeader.getAttribute('aria-sort')).toBe('descending');
  priorityInputs = screen.getAllByTestId('priority-input');
  expect(priorityInputs[0]).toHaveValue(2);
  expect(priorityInputs[1]).toHaveValue(1);

  // then sorted asc
  fireEvent.click(priorityHeader);
  expect(priorityHeader.getAttribute('aria-sort')).toBe('ascending');
  priorityInputs = screen.getAllByTestId('priority-input');
  expect(priorityInputs[0]).toHaveValue(1);
  expect(priorityInputs[1]).toHaveValue(2);
});

it('shows the number of completed tasks', () => {
  const task1 = createTask({ status: TaskStatus.completed });
  const task2 = createTask();
  const tasks = { [task1.id]: task1, [task2.id]: task2 };
  render(<TodoList initialTasks={tasks} />);

  const completedCountLabel = screen.getByText(/Completed tasks/i);
  expect(completedCountLabel).toBeInTheDocument();
  const countText = getNodeText(completedCountLabel);
  expect(countText).toBe('Completed tasks: 1 / 2');
});
