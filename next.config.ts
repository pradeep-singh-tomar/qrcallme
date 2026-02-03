import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Matches all paths
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'qrcallme.com', // The domain without www
          },
        ],
        destination: 'https://www.qrcallme.com/:path*',
        permanent: true, // This makes it a 301 redirect
      },
    ];
  },
};

export default nextConfig;