const Cloudfare = require('cloudflare');
const publicIp = require('public-ip');
const domainPing = require('domain-ping');

module.exports = {
  getCloudfareApi(token) {
    return new Cloudfare({
      token,
    });
  },
  async getMyIp() {
    return publicIp.v4();
  },
  async getDomainIp(domain) {
    try {
      const ping = await domainPing(domain);
      return ping.ip || '';
    } catch (ping) {
      return ping.ip || '';
    }
  },
};
