/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // tesseract.js ships a node worker path that next's bundler
      // doesn't need to resolve on the server build
    };
    return config;
  },
};

module.exports = nextConfig;
