/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'ki_frontend',
      script: 'pnpm',
      args: 'start',
      watch: ['./next/BUILD_ID', '.env.production'],
      ignore_watch: ['node_modules', 'public'],
      env_file: '.env.production',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
