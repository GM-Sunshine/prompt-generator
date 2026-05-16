module.exports = {
  apps: [
    {
      name: "prompt-forge",
      cwd: "/var/www/prompt-generator.gm-sunshine.com",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3100",
      instances: 1,
      exec_mode: "fork",
      env: { NODE_ENV: "production", PORT: "3100" },
      max_memory_restart: "400M",
    },
  ],
};
