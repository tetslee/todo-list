/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import {
  Task, TaskStatus, createTask,
} from './task';
import { TaskRow } from './TaskRow';
import './TodoList.scss';
import { never } from './types';

const compare = <T extends string | number>(a: T, b: T) => {
  if (a === b) {
    return 0;
  }
  if (a < b) {
    return 1;
  }
  return -1;
};

type OrderBy = ['name' | 'priority', boolean]; // [field, isAscending]

const compareTasks = ([field, isAscending]: OrderBy) => (a: Task, b: Task) => {
  if (a.status !== b.status) {
    // not in the spec but seems nicer to never mix completed and active tasks?
    // dunno, can get rid of this later
    return a.status === TaskStatus.completed ? 1 : -1;
  }
  const [x, y] = isAscending ? [b, a] : [a, b];
  if (field === 'name') {
    return compare(x.name, y.name);
  }
  if (field === 'priority') {
    return compare(x.priority || 0, y.priority || 0);
  }
  return never(field);
};

type Props = {
  initialTasks?: { [index: string]: Task }
};

export const TodoList = ({ initialTasks = {} }: Props = {}) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [[orderBy, isAscending], setOrderBy] = useState<OrderBy>(['priority', false]);

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

  const ariaSortName = isAscending ? 'ascending' : 'descending';

  const tasksValues = Object.values(tasks);
  return (
    <div data-testid="todo-list">
      <header>Todo items</header>
      <div>
        {`Completed tasks: ${tasksValues.filter((t) => t.status === TaskStatus.completed).length} / ${tasksValues.length}`}
      </div>

      <button type="button" onClick={onAddTask}>
        Add a task
      </button>
      <div className="task-table">
        <div className="task-table-header">
          <div
            role="columnheader"
            aria-sort={orderBy === 'name' ? ariaSortName : 'none'}
            tabIndex={0}
            onClick={() => {
              setOrderBy(['name', orderBy === 'name' ? !isAscending : true]);
            }}
          >
            Name
          </div>
          <div
            role="columnheader"
            aria-sort={orderBy === 'priority' ? ariaSortName : 'none'}
            tabIndex={0}
            onClick={() => {
              setOrderBy(['priority', orderBy === 'priority' ? !isAscending : false]);
            }}
          >
            Priority
          </div>
          <div
            role="columnheader"
          >
            Status
          </div>
        </div>
        {tasksValues.sort(compareTasks([orderBy, isAscending])).map(({
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
