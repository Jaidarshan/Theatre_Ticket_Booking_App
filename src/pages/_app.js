import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/') {
      const user = localStorage.getItem('user');
      if (!user) router.push('/welcome');
    }
  }, []);

  return <Component {...pageProps} />;
}
