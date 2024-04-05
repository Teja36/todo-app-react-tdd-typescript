import { useState } from 'react';
import { Task } from './types';

type TaskListItemProps = {
  task: Task;
  onUpdateTask: (id: number, updatedTask: Task) => void;
  onDeleteTask: (id: number) => void;
};

export default function TaskListItem({
  task,
  onUpdateTask,
  onDeleteTask,
}: TaskListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.title);

  return (
    <li>
      <input
        type="checkbox"
        id={task.id.toString()}
        checked={task.isCompleted}
        onChange={() =>
          onUpdateTask(task.id, { ...task, isCompleted: !task.isCompleted })
        }
      />
      {isEditing ? (
        <>
          <input
            type="text"
            aria-label="Edit Task:"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={() => {
              onUpdateTask(task.id, { ...task, title: text });
              setText('');
              setIsEditing(false);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setText(task.title);
            }}
          >
            Discard
          </button>
        </>
      ) : (
        <>
          <label htmlFor={task.id.toString()}>
            {task.isCompleted ? <s>{task.title}</s> : task.title}
          </label>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDeleteTask(task.id)}>Delete</button>
        </>
      )}
    </li>
  );
}
