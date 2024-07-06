require('dotenv').config();
require('./src/tasks/db');

const listApp = [];

listApp.push({
  name: 'Api',
  script: './index.js',
});

if (process.env.RUN_JOB && process.env.RUN_JOB === 'on') {
  listApp.push({
    name: 'Job',
    script: './src/tasks/job.js',
    cron_restart: process.env.CRON_TIME || '*/5 * * * *',
  });
}

module.exports = {
  apps: listApp,
};
