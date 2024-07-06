const NodeCache = require('node-cache');
const CloudflareDnsModel = require('./model');
const { getCloudfareApi, getMyIp, getDomainIp } = require('./utils');
const { setStatic } = require('../../config');

const cacheApi = new NodeCache();
const cacheIp = 'get-ip';

const getIp = async () => {
  if (cacheApi.has(cacheIp)) {
    return cacheApi.get(cacheIp);
  }

  let { ip } = setStatic;

  if (!ip && setStatic.domain) {
    ip = await getDomainIp(setStatic.domain);
  }

  if (!ip) {
    ip = await getMyIp();
  }

  cacheApi.set(cacheIp, ip, 30);
  return ip;
};

const deleteDomainId = async (id) => {
  const data = await CloudflareDnsModel.findId(id);

  const Api = getCloudfareApi(data.token);

  return (data.zone_id && data.record_id) ? Api.dnsRecords.del(data.zone_id, data.record_id) : null;
};

const setDomainId = async (id, setIp) => {
  const data = await CloudflareDnsModel.findId(id);
  const ip = setIp || (await getIp());

  console.log({
    msg: 'SET_DOMAIN',
    name: data.name,
    domain: data.domain,
    sub: data.sub,
    ip,
    id,
  });

  const Api = getCloudfareApi(data.token);

  try {
    const { result: listZone } = await Api.zones.browse();

    const zoneData = listZone.find((item) => item.name === data.domain);

    if (!zoneData) {
      throw 'ZONE_ID_NOT_FOUND';
    }

    data.zone_id = zoneData.id;

    await CloudflareDnsModel.updateId(id, {
      zone_data: zoneData,
      zone_id: data.zone_id,
    });

    const { result: listRecord } = await Api.dnsRecords.browse(data.zone_id);

    const recordExits = listRecord.find((item) => item.name === data.name);

    const recordUpdate = {
      type: data.type || 'A',
      name: data.name || data.domain,
      content: ip,
      proxied: data.is_proxy,
    };

    if (recordExits) {
      data.record_id = recordExits.id;

      await Api.dnsRecords.edit(data.zone_id, data.record_id, recordUpdate);

      await CloudflareDnsModel.updateId(id, {
        record_data: recordExits,
        record_id: data.record_id,
      });
    } else {
      const { result: recordData } = await Api.dnsRecords.add(data.zone_id, recordUpdate);

      data.record_id = recordData.id;

      await CloudflareDnsModel.updateId(id, {
        record_data: recordData,
        record_id: data.record_id,
      });
    }

    if (!data.record_id) {
      throw 'RECORD_ID_NOT_FOUND';
    }

    await CloudflareDnsModel.updateId(id, {
      ip,
      is_success: true,
      is_error: false,
    });
  } catch (error) {
    console.error({
      msg: 'SET_IP_ERROR',
      name: data.name,
      domain: data.domain,
      sub: data.sub,
      ip,
      id,
      error,
    });

    await CloudflareDnsModel.updateId(id, {
      ip,
      is_success: false,
      is_error: true,
      error: JSON.stringify(error),
    });
  }

  return CloudflareDnsModel.findId(id);
};

module.exports = {
  deleteDomainId,
  setDomainId,
  getIp,
};
