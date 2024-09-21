// @ts-check
const path = require('path');

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  //output: "export",
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // 必要に応じて画像ドメインを追加
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};

module.exports = nextConfig;
