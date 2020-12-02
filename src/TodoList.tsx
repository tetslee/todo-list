/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import {
  Task, TaskStatus, createTask,
} from './task';
import { TaskRow } from './TaskRow';
import './TodoList.scss';
import { never, ValueOf } from './types';

const upArrow = '\u2303';
const downArrow = '\u2304';

const compare = <T extends string | number>(a: T, b: T) => {
  if (a === b) {
    return 0;
  }
  if (a < b) {
    return 1;
  }
  return -1;
};

const OrderBy = {
  nameAsc: 'nameAsc',
  priorityAsc: 'priorityAsc',
  nameDesc: 'nameDesc',
  priorityDesc: 'priorityDesc',
} as const;

const compareTasks = (orderBy: ValueOf<typeof OrderBy>) => (a: Task, b: Task) => {
  if (a.status !== b.status) {
    return a.status === TaskStatus.completed ? 1 : -1;
  }
  switch (orderBy) {
    case OrderBy.nameAsc:
      return compare(a.name, b.name);
    case OrderBy.nameDesc:
      return compare(b.name, a.name);
    case OrderBy.priorityAsc:
      return compare(a.priority || 0, b.priority || 0);
    case OrderBy.priorityDesc:
      return compare(b.priority || 0, a.priority || 0);
    default:
      return never(orderBy);
  }
};

type Props = {
  initialTasks?: { [index: string]: Task }
};

export const TodoList = ({ initialTasks = {} }: Props = {}) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [orderBy, setOrderBy] = useState<ValueOf<typeof OrderBy>>(OrderBy.priorityDesc);

  const onAddTask = () => {
    const task = createTask();
    setTasks({
      [task.id]: task,
      ...tasks,
    });
  };

  const onDelete = (id: string) => {
    const { [id]: deletedTask, ...nextTasks } = tasks;
    setTasks(nextTasks);
  };

  const onComplete = (id: string) => {
    setTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        status: TaskStatus.completed,
      },
    });
  };

  const onChangeName = (id: string, name: string) => {
    setTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        name,
      },
    });
  };

  const onChangePriority = (id: string, value: string) => {
    const priority = parseInt(value, 10);
    setTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        priority,
      },
    });
  };

  return (
    <div data-testid="todo-list">
      <header>Todo items</header>
      <button type="button" onClick={onAddTask}>
        Add a task
      </button>
      <div className="task-table">
        <div className="task-table-header">
          <h2 onClick={() => {
            setOrderBy(orderBy === OrderBy.nameAsc
              ? OrderBy.nameDesc
              : OrderBy.nameAsc);
          }}
          >
            {orderBy === OrderBy.nameAsc && upArrow}
            {orderBy === OrderBy.nameDesc && downArrow}
            Name
          </h2>
          <h2 onClick={() => {
            setOrderBy(orderBy === OrderBy.priorityDesc
              ? OrderBy.priorityAsc
              : OrderBy.priorityDesc);
          }}
          >
            {orderBy === OrderBy.priorityAsc && upArrow}
            {orderBy === OrderBy.priorityDesc && downArrow}
            Priority
          </h2>
        </div>
        {Object.values(tasks).sort(compareTasks(orderBy)).map(({
          id, priority, name, status,
        }) => (
          <TaskRow
            key={id}
            id={id}
            priority={priority}
            name={name}
            status={status}
            onChangePriority={onChangePriority}
            onChangeName={onChangeName}
            onDelete={onDelete}
            onComplete={onComplete}
          />
        ))}
      </div>
    </div>
  );
};
