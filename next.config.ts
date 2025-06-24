import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // This enables static HTML export
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Required for `output: 'export'`
  },
};

export default nextConfig;