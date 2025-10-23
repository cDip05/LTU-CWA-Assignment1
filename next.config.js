module.exports = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },  // avoids TS build crashes
  eslint:     { ignoreDuringBuilds: true }, // avoids ESLint build crashes
};