const controller = require('./controller');

module.exports = (fastify, opts, next) => {
  fastify.get('/', controller.index);
  fastify.get('/count', controller.count);
  fastify.get('/list', controller.list);
  fastify.get('/get/:id', controller.get);
  fastify.get('/ip', controller.myIp);

  fastify.post('/create', controller.create);
  fastify.post('/delete/:id', controller.delete);
  fastify.post('/update/:id', controller.update);
  fastify.post('/set/:id', controller.set);

  next();
};
