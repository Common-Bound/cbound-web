module.exports = {
  apps: [
    {
      name: "server",
      script: "./server.js",
      watch: ["./*"],
      env_development: {
        PORT: 4000,
        NODE_ENV: "development"
      },
      env_production: {
        PORT: 443,
        NODE_ENV: "production"
      }
    }
  ]
};
