const getenv = require('getenv');
const MikrotikApi = require('./api');

const getApiMikrotik = () => {
  const payload = {
    url: getenv.string('MIKROTIK_URL', ''),
    username: getenv.string('MIKROTIK_USERNAME', ''),
    password: getenv.string('MIKROTIK_PASSWORD', ''),
  };

  if (!(payload.url && payload.username && payload.password)) {
    throw {
      message: 'MIKROTIK_MISSING_API',
    };
  }

  return (new MikrotikApi(payload.url, payload.username, payload.password));
};

module.exports = {
  getApiMikrotik,
};
