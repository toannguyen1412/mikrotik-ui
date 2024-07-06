const CloudflareDnsModel = require('./model');
const { getIp, setDomainId, deleteDomainId } = require('./service');

module.exports = {
  async index() {
    const data = await CloudflareDnsModel.count();

    return {
      success: true,
      data,
    };
  },
  async count() {
    const data = await CloudflareDnsModel.count();

    return {
      success: true,
      data,
    };
  },
  async list() {
    const data = await CloudflareDnsModel.list();

    return {
      success: true,
      data,
    };
  },
  async myIp() {
    const data = await getIp();

    return {
      success: true,
      data,
    };
  },
  async get({ params }) {
    const data = await CloudflareDnsModel.findId(params.id);

    return {
      success: true,
      data,
    };
  },
  async create({ body }) {
    const created = await CloudflareDnsModel.create(body);

    await setDomainId(created.id);

    const data = await CloudflareDnsModel.findId(created.id);

    return {
      success: true,
      data,
    };
  },
  async update({ params, body }) {
    const data = await CloudflareDnsModel.updateId(params.id, body);

    return {
      success: true,
      data,
    };
  },
  async delete({ params }) {
    await deleteDomainId(params.id).catch(() => {});

    const data = await CloudflareDnsModel.removeId(params.id);

    return {
      success: true,
      data,
    };
  },
  async set({ params, body }) {
    const ip = (body && body.ip) ? body.ip : '';

    const data = await setDomainId(params.id, ip);

    return {
      success: true,
      data,
    };
  },
};
