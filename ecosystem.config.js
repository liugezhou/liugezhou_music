module.exports = {
  apps : [{
    name: 'VueMusic',
    script: 'prod.server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      "user" : 'root',
      "host" : ['47.104.85.127'],
      "ref"  : 'origin/master',
      "repo" : 'git@github.com:liugezhou/liugezhou_music.git',
      "path" : '/www/vuemusic/production',
      'post-deploy' : 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
