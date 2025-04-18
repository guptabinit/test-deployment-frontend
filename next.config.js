/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',   // Allow HTTP
        hostname: '**', // Allow localhost images
      },
      {
        protocol: 'https',
        hostname: '**',  // This will allow all domains - use with caution
      }
    ],
    domains: [
      'localhost',
      'plus.unsplash.com',
      'images.unsplash.com',
      'canoaranchgolfresort.com',
      'res.klook.com',
      'cdn.vox-cdn.com',
      'i.ibb.co',
      'cdn.loveandlemons.com',
      'untoldrecipesbynosheen.com',
      'lifestyleuganda.com',
      'thumbs.dreamstime.com',
      'encrypted-tbn0.gstatic.com',
      'www.awesomecuisine.com',
      'cdn2.foodviva.com',
      'www.indianhealthyrecipes.com',
      'static.toiimg.com',
      'www.vegrecipesofindia.com',
      'www.cookwithmanali.com',
      'www.whiskaffair.com',
      'www.spiceupthecurry.com'
    ]
  }
}

module.exports = nextConfig
