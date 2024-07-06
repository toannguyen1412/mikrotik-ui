const controller = require('./controller');

module.exports = (fastify, opts, next) => {
  fastify.get('/getListAddress', controller.getListAddress);
  fastify.get('/getListInterface', controller.getListInterface);
  fastify.post('/setIpAddress', controller.setIpAddress);
  fastify.post('/resetPppoe', controller.resetPppoe);
  fastify.post('/enablePppoe', controller.enablePppoe);
  fastify.post('/disablePppoe', controller.disablePppoe);

  next();
};
