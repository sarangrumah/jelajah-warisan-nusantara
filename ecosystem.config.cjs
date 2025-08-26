module.exports = {
  apps: [
    {
      name: "frontend-app",
      script: "npm",
      args: "start",
      cwd: "/var/www/jelajah-warisan-nusantara", // Root project folder
    },
    {
      name: "backend-app",
      script: "npm",
      args: "start",
      cwd: "/var/www/jelajah-warisan-nusantara/backend", // Path to your backend folder
    },
  ],
};
