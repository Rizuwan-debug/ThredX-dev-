import type {NextConfig} from 'next';
const webpack = require('webpack'); // Import webpack

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add webpack config for polyfills
  webpack: (config, { isServer }) => {
    // Provide fallbacks for Node.js core modules used by crypto libraries
    // These are often needed when using crypto libraries in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Spread existing fallbacks
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      };

       // Provide Buffer globally
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }


    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
