const request = require('request-promise-native');

class MikrotikApi {
  constructor(url, username, passport) {
    const auth = {
      user: username,
      pass: passport,
    };

    const payload = {
      baseUrl: `${url}/rest`,
      auth,
      json: true,
    };

    this.api = request.defaults(payload);
  }

  async getResource() {
    return this.api.get({
      uri: '/system/resource',
    });
  }

  async getListInterface() {
    return this.api.get({
      uri: '/ip/address',
    });
  }

  async getListAddress() {
    return this.api.get({
      uri: '/ip/firewall/address-list',
    });
  }

  async getInterfaceName(name) {
    const listAddress = await this.getListInterface();

    return listAddress.find((item) => item.interface === name);
  }

  async excuteScript(script) {
    return this.api.post({
      uri: '/execute',
      body: { script },
    });
  }
}

module.exports = MikrotikApi;
