import { useState, useEffect } from 'react';
import { useAuth } from "./auth/AuthContext.jsx";

const App = () => {
  const { token, login, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:3999/tasks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3999/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });
    setForm({ title: '', description: '' });
    fetchTasks();
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const username = e.target.username.value;
              const password = e.target.password.value;
              try {
                await login(username, password);
              } catch (err) {
                alert('Login fallido');
              }
            }}
            className="space-y-4"
          >
            <input
              name="username"
              placeholder="Usuario"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="w-full px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Tareas</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow space-y-4 mb-6"
        >
          <h2 className="text-xl font-semibold">Crear nueva tarea</h2>
          <input
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Crear tarea
          </button>
        </form>

        <ul className="space-y-4">
          {tasks.map((t) => (
            <li key={t._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="text-gray-700">{t.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;