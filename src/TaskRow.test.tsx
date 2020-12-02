/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, screen } from '@testing-library/react';
import noop from 'lodash/noop';
import { TaskRow, TaskRowProps } from './TaskRow';
import { TaskStatus } from './task';

const commonProps: TaskRowProps = {
  id: 'id',
  priority: 3,
  name: 'name',
  status: TaskStatus.active,
  onChangePriority: noop,
  onChangeName: noop,
  onDelete: noop,
  onComplete: noop,
};

it('renders a name', () => {
  render(<TaskRow {...commonProps} name="foo" />);
  const nameInput = screen.getByTestId('name-input');
  expect(nameInput).toBeInTheDocument();
  expect(nameInput).toHaveValue('foo');
});

it('renders a priority', () => {
  render(<TaskRow {...commonProps} priority={6} />);
  const priorityInput = screen.getByTestId('priority-input');
  expect(priorityInput).toBeInTheDocument();
  expect(priorityInput).toHaveValue(6);
});
