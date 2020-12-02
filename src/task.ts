import { uniqueId } from 'lodash';
import { ValueOf } from './types';

export const TaskStatus = {
  active: 'active',
  completed: 'completed',
} as const;

export type Task = {
  id: string
  priority?: number
  name: string
  status: ValueOf<typeof TaskStatus>
};

export const createTask = (params: Omit<Task, 'id'> = { name: '', status: TaskStatus.active }) => ({
  ...params,

  // Note: if this is required to last longer than a browser session uniqueId would also
  // have to check it's unique to other tasks
  id: uniqueId(),
});
