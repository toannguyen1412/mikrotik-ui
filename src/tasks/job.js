/* eslint-disable camelcase */
const PromiseMap = require('p-map');
const cloudfare = require('../modules/cloudfare/controller');

const setDnsIp = async () => {
  const { data: list } = await cloudfare.list();

  PromiseMap(list, async ({
    id, ip, type, name, is_active,
  }) => {
    if (is_active) {
      console.log({
        msg: 'SET_DNS_IP',
        id,
        type,
        ip,
        name,
      });

      const payload = {
        params: { id },
      };

      await cloudfare.set(payload).catch((error) => {
        console.error({
          msg: 'SET_DNS_IP_ERROR',
          name,
          error,
        });
      });
    }
  }, {
    concurrency: 1,
  });
};

(async () => {
  setDnsIp();
})();
