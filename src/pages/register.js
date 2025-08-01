import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    isAdmin: false,
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
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
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 w-100"
      style={{ backgroundColor: '#f0f4ff' }}
    >
      {/* Register Card */}
      <div className="card shadow-sm p-4" style={{ width: '25rem', borderRadius: '10px' }}>
        <h2 className="text-center fw-bold mb-3">Register</h2>
        <p className="text-center text-muted mb-4">
          Create an account to continue
        </p>

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          {/* Name Field */}
          <div>
            <label className="form-label fw-semibold">Name</label>
            <input
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="form-label fw-semibold">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="form-label fw-semibold">Phone</label>
            <input
              name="phone"
              className="form-control"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Admin Toggle */}
          <div className="form-check form-switch d-flex align-items-center mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              name="isAdmin"
              checked={form.isAdmin}
              onChange={handleChange}
              id="adminToggle"
              style={{ cursor: 'pointer' }}
            />
            <label className="form-check-label ms-2" htmlFor="adminToggle">
              Register as Admin
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-dark btn-lg w-100">
            Register
          </button>

          {/* Error Message */}
          {message && (
            <div className="alert alert-danger text-center p-2 mt-2">
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Login Link Below Card */}
      <p className="mt-3 text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-primary fw-semibold text-decoration-none">
          Login here
        </Link>
      </p>
    </div>
  );
}
