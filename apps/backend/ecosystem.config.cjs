/* eslint-disable no-undef */
module.exports = {
  apps: [
    {
      name: 'ki_backend',
      script: 'dist/src/main.js',
      watch: ['dist', '.env.production'],
      ignore_watch: ['node_modules', 'public'],
      env_file: '.env.production',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
