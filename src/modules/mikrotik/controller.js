const delay = require('delay').default;

const { getApiMikrotik } = require('./service');

const apiService = getApiMikrotik();

module.exports = {
  async getListInterface() {
    const data = await apiService.getListInterface();

    return {
      success: true,
      data,
    };
  },
  async getListAddress() {
    const data = await apiService.getListAddress();

    return {
      success: true,
      data,
    };
  },
  async setIpAddress(req) {
    const { address, ip } = req.body;

    await apiService.excuteScript(`ip firewall address-list set address="${ip}" [find list="${address}"]`);

    return {
      success: true,
    };
  },
  async resetPppoe(req) {
    const { name, waitForStop, waitForConnect } = req.body;

    await apiService.excuteScript(`interface pppoe-client disable ${name}`);

    await delay(waitForStop);

    await apiService.excuteScript(`interface pppoe-client enable ${name}`);

    await delay(waitForConnect);

    const interfaceAddress = await apiService.getInterfaceName(name);

    return {
      success: true,
      data: interfaceAddress,
    };
  },
  async enablePppoe(req) {
    const { name } = req.body;

    await apiService.excuteScript(`interface pppoe-client enable ${name}`);

    const interfaceAddress = await apiService.getInterfaceName(name);

    return {
      success: true,
      data: interfaceAddress,
    };
  },
  async disablePppoe(req) {
    const { name } = req.body;

    await apiService.excuteScript(`interface pppoe-client disable ${name}`);

    const interfaceAddress = await apiService.getInterfaceName(name);

    return {
      success: true,
      data: interfaceAddress,
    };
  },
};
