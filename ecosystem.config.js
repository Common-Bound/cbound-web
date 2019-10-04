module.exports = {
  apps: [
    {
      name: "server",
      script: "./server.js",
      watch: true,
      env_development: {
        PORT: 3000,
        NODE_ENV: "development"
      },
      env_production: {
        PORT: 4000,
        NODE_ENV: "production"
      }
    }
  ]
};
