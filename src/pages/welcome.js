import Link from 'next/link';

export default function Welcome() {
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h1>Welcome to Theatre Booking App</h1>
      <Link href="/login"><button>Login</button></Link>{' '}
      <Link href="/register"><button>Register</button></Link>
    </div>
  );
}
