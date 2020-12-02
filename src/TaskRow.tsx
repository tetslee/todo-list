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
    <input data-testid="name-input" onChange={(e) => { onChangeName(id, e.target.value); }} value={name} />
    <input data-testid="priority-input" type="number" min="1" max="10" step="1" onChange={(e) => { onChangePriority(id, e.target.value); }} value={priority || ''} />
    <span className="task-status">{status}</span>
    <button key="delete" type="button" onClick={() => { onDelete(id); }}>
      Delete
    </button>
    <button key="completed" disabled={status === TaskStatus.completed} type="button" onClick={() => { onComplete(id); }}>
      Complete
    </button>
  </div>
);
