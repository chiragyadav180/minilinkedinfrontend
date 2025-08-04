import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use context login method
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      // ✅ Use context login to set user globally
      login({ ...data.user, token: data.token });

      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">Login</button>
        <p className="text-sm mt-4 text-center">
          Don’t have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/register')}>Register</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
