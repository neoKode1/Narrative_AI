const nextConfig = {
  // ... other configurations
  images: {
    loader: "custom",
    loaderFile: './ImageLoader.js',
    domains: ['localhost', 'your-server-domain.com'], // Add your server's domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
