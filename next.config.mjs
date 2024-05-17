/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 's3-sj3.corp.adobe.com',
            port: '',
            pathname: '/milo/**',
          },
        ],
      },
};

export default nextConfig;
