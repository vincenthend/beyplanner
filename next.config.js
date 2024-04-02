/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    '@ant-design/icons'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beybladeplanner.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
}

module.exports = config
