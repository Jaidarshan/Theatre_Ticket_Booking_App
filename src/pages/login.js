import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(data.user.isAdmin ? '/admin/dashboard' : '/');
    } else {
      setMessage(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required type="password" />
      <button type="submit">Login</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  );
}
