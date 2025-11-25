module.exports = {
  apps: [
    {
      name: "frontend-app",
      script: "npm",
      args: "start",
      cwd: "/var/www/jelajah-warisan-nusantara", // Root project folder
      env: {
        VITE_PREVIEW_PORT: 4173,
      },
    },
    {
      name: "mcb-project",
      script: "npm",
      args: "start",
      cwd: "/var/www/jelajah-warisan-nusantara/backend", // Path to your backend folder
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
