module.exports = {
  apps: [
    {
      name: "backend-app",
      script: "dist/server.js",
      cwd: "/var/www/jelajah-warisan-nusantara/backend",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
