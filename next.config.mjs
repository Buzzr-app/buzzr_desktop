import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: __dirname
  },
  async headers() {
    // iOS requires apple-app-site-association to be served as application/json
    // (no extension). Without an explicit Content-Type header, Vercel serves it
    // as octet-stream and iOS silently rejects it.
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
      {
        source: '/.well-known/assetlinks.json',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        pathname: '/i/teamlogos/**'
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        pathname: '/i/leaguelogos/**'
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        pathname: '/combiner/**'
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'ph-files.imgix.net',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
