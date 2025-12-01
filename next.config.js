/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
<<<<<<< Updated upstream
    domains: ["static.wikia.nocookie.net"],
=======
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2xzrz4ksgmdkm.cloudfront.net",
      },
    ],
>>>>>>> Stashed changes
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
};

export default nextConfig;
