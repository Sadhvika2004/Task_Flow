import React, { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title} - {task.completed ? 'Done' : 'Pending'}</li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
