import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTodo,
        completed: false
      }),
    })
      .then(res => res.json())
      .then(data => setTodos([...todos, data]));
  };

  return (
    <div>
      <h1>Todos</h1>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} - {todo.completed ? '✓' : '◻'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;