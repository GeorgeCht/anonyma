/** @type {import('next').NextConfig} */
const { version } = require('./package.json')

const nextConfig = {
  reactStrictMode: false,
  env: {
    version,
  },
}

module.exports = nextConfig
