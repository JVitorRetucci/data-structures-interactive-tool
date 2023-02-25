const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const config = {
  trailingSlash: true,
  
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [path.resolve(__dirname, './source')],
      use: [defaultLoaders.babel],
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(config);
