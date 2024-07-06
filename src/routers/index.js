const getenv = require('getenv');

const accesssToken = getenv.string('ACCESS_TOKEN');

module.exports = (fastify, opts, next) => {
  if (accesssToken) {
    fastify.addHook('preHandler', async (req, reply) => {
      if (!(req.query.token && req.query.token === accesssToken)) {
        reply.code(403).send({
          success: false,
          message: 'Permission denied',
          code: 403,
        });
      }
    });
  }

  fastify.get('/auth', () => ({
    success: true,
    message: 'Authed',
  }));

  fastify.register(require('../modules/cloudfare/router'), { prefix: '/cloudfare' });
  fastify.register(require('../modules/mikrotik/router'), { prefix: '/mikrotik' });

  next();
};
