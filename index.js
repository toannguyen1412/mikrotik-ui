const Fastify = require('fastify');
const path = require('path');
const getenv = require('getenv');

const config = require('./src/config');

const appName = getenv.string('APP_NAME');

const server = Fastify({ logger: true });

server.register(require('@fastify/static'), {
  root: path.join(__dirname, './public'),
});

server.get('/api/meta', () => ({
  success: true,
  data: {
    appName,
  },
}));

server.register(require('./src/routers'), { prefix: '/api' });

server.listen(config.server).then(() => {
  console.log({
    msg: 'API_STARTED',
    ...config.server,
  });
}).catch((error) => {
  console.error({
    msg: 'API_ERROR',
    error,
    ...config.server,
  });
});
