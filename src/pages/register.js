import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', isAdmin: false });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(form.isAdmin ? '/admin/dashboard' : '/');
    } else {
      setMessage(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required type="email" />
      <input name="password" placeholder="Password" value={form.password} onChange={handleChange} required type="password" />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <label>
        <input type="checkbox" name="isAdmin" checked={form.isAdmin} onChange={handleChange} /> Register as Admin
      </label>
      <button type="submit">Register</button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  );
}
