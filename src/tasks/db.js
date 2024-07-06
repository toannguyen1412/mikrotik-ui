const Cloudflare = require('../modules/cloudfare/model');
const Mikrotik = require('../modules/mikrotik/model');

const listModel = [
  Cloudflare,
  Mikrotik,
];

listModel.forEach((model) => {
  model.sync().then(() => {
    console.log({
      msg: 'DNS_SYNC_SUCESS',
      name: model.name,
    });
  }).catch((error) => {
    console.error({
      msg: 'DNS_SYNC_ERROR',
      name: model.name,
      error,
    });
  });
});
