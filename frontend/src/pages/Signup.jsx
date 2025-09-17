import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: ''});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed');
      // Require login after signup
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <input className="w-full border p-2 rounded" name="username" placeholder="Username" value={form.username} onChange={onChange} />
        <input className="w-full border p-2 rounded" name="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input className="w-full border p-2 rounded" name="first_name" placeholder="First name" value={form.first_name} onChange={onChange} />
        <input className="w-full border p-2 rounded" name="last_name" placeholder="Last name" value={form.last_name} onChange={onChange} />
        <input className="w-full border p-2 rounded" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="w-full bg-black text-white p-2 rounded">Sign up</button>
        <button type="button" className="w-full border p-2 rounded" onClick={() => navigate('/login')}>Back to login</button>
      </form>
    </div>
  );
}