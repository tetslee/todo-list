import { Task, TaskStatus } from './task';

export type TaskRowProps = Task & {
  onChangePriority: (id: string, priority: string) => void
  onChangeName: (id: string, name: string) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void
};
export const TaskRow = ({
  onChangePriority,
  onChangeName,
  onDelete,
  onComplete,
  id,
  name,
  priority,
  status,
}: TaskRowProps) => (
  <div key={id} data-testid="task-row" className={`task task-${status}`}>
    <label key="name" htmlFor={`name-${id}`}>
      Name:
      <input id={`name-${id}`} onChange={(e) => { onChangeName(id, e.target.value); }} className="task-name-input" value={name} />
    </label>
    <label key="priority" htmlFor={`priority-${id}`}>
      Priority:
      <input id={`priority-${id}`} type="number" min="1" max="10" step="1" onChange={(e) => { onChangePriority(id, e.target.value); }} className="task-name-input" value={priority || ''} />
    </label>
    <button key="delete" type="button" onClick={() => { onDelete(id); }}>
      Delete
    </button>
    <button key="completed" disabled={status === TaskStatus.completed} type="button" onClick={() => { onComplete(id); }}>
      Complete
    </button>
  </div>
);
