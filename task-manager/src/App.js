import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/tasks', {
        params: filter !== 'all' ? { filter } : {}
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await axios.post('http://localhost:5000/tasks', { title });
    setTasks([...tasks, res.data]);
    setTitle('');
  };

 const markAsCompleted = async (id) => {
  try {
    const res = await axios.patch(`http://localhost:5000/tasks/${id}/complete`);
    setTasks(tasks.map(t => (t._id === id ? res.data : t)));
  } catch (err) {
    console.error('❌ Error marking complete:', err.message);
  }
};


  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Add Task */}
      <div className="mb-4 flex">
        <input
          type="text"
          value={title}
          placeholder="New Task"
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border p-2"
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 ml-2">
          Add
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 space-x-2">
        {['all', 'completed', 'pending'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 border ${filter === f ? 'bg-gray-800 text-white' : ''}`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <ul>
        {tasks.map(task => (
          <li key={task._id} className="flex justify-between items-center mb-2 border p-2 rounded">
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.title}
            </span>
            <div className="space-x-2">
              {!task.completed && (
                <button
                  onClick={() => markAsCompleted(task._id)}
                  className="text-green-600"
                >
                  ✅ Complete
                </button>
              )}
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-600"
              >
                🗑 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
