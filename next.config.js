/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (
    config, // config is the webpack configuration object
    { buildId, dev, isAboveEightyCols, isServer, pagesDir, webpack }, // dev is true in development mode
  ) => {
    // Only disable Turbopack in development
    if (dev) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true, // Keep topLevelAwait if already present or needed
        turbopack: false, // Explicitly disable Turbopack
      };
      // You might need to add other webpack configurations here if you had them before
    }
    return config;
  },
};

module.exports = nextConfig; 