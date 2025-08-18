/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Configure page extensions (only what you actually use)
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/',
        destination: '/welcome',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'user',
            value: undefined,
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
