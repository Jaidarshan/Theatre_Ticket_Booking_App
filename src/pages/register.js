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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title mb-4 text-center">Register</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input name="name" className="form-control" placeholder="Name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" className="form-control" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input name="password" className="form-control" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input name="phone" className="form-control" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" name="isAdmin" checked={form.isAdmin} onChange={handleChange} id="adminCheck" />
                  <label className="form-check-label" htmlFor="adminCheck">
                    Register as Admin
                  </label>
                </div>
                <button type="submit" className="btn btn-primary w-auto px-4">Register</button>
                {message && <div className="alert alert-danger mt-3" role="alert">{message}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
