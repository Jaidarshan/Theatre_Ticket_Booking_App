import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
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
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#f0f4ff' }}
    >
      {/* Login Card */}
      <div className="card shadow-sm p-4" style={{ width: '25rem', borderRadius: '10px' }}>
        <h2 className="text-center fw-bold mb-3">Login</h2>
        <p className="text-center text-muted mb-4">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              id="email"
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
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-dark btn-lg w-100">
            Login
          </button>

          {/* Error Message */}
          {message && (
            <div className="alert alert-danger text-center p-2 mt-2">
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Register Link Below Card */}
      <p className="mt-3 text-muted">
        Don't have an account?{' '}
        <Link href="/register" className="text-primary fw-semibold text-decoration-none">
          Register here
        </Link>
      </p>
    </div>
  );
}
