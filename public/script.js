/* eslint-disable no-promise-executor-return */
/* global Vue axios moment ELEMENT */
/* eslint-disable no-new */

const appLoader = () => {
  window.Promise = window.P;

  const delay = async (time) => new Promise((resolve) => setTimeout(resolve, time));

  const storageConfig = {
    app_name: 'app_name',
    tab_active: 'tab_active',
    cloudfare_token: 'cloudfare_token',
    set_source: 'set_source',
    set_wan: 'set_wan',
    access_token: 'access_token',
    ignore_pppoe_name: 'ignore_pppoe_name',
    reset_pppoe_concurrency: 'reset_pppoe_concurrency',
    reset_pppoe_wait_stop: 'reset_pppoe_wait_stop',
    reset_pppoe_wait_connect: 'reset_pppoe_wait_connect',
    auto_reset_pppoe_delay_per: 'auto_reset_pppoe_delay_per',
    auto_reset_pppoe_delay_all: 'auto_reset_pppoe_delay_all',
  };

  const useApi = axios.create({
    baseURL: '/api',
    withCredentials: false,
    params: {
      token: localStorage.getItem(storageConfig.access_token) || '',
    },
  });

  useApi.interceptors.response.use(({
    data,
  }) => data);

  const getFormDns = () => ({
    type: 'A',
    token: localStorage.getItem(storageConfig.cloudfare_token) || '',
    sub: '',
    domain: '',
    is_proxy: true,
  });

  const useAppService = {
    getMetaApp() {
      return useApi.get('/meta');
    },
  };

  const useCloudfareService = {
    getCurentIp() {
      return useApi.get('/cloudfare/ip');
    },
    getListDns() {
      return useApi.get('/cloudfare/list');
    },
    createDns(payload) {
      return useApi.post('/cloudfare/create', payload);
    },
    setDns(id, payload) {
      return useApi.post(`/cloudfare/set/${id}`, payload);
    },
    updateDns(id, payload) {
      return useApi.post(`/cloudfare/update/${id}`, payload);
    },
    removeDns(id) {
      return useApi.post(`/cloudfare/delete/${id}`);
    },
  };

  const useMikrotikService = {
    getListAddress() {
      return useApi.get('/mikrotik/getListAddress');
    },
    getListInterface() {
      return useApi.get('/mikrotik/getListInterface');
    },
    setIpAddress(payload) {
      return useApi.post('/mikrotik/setIpAddress', payload);
    },
    resetPppoe(payload) {
      return useApi.post('/mikrotik/resetPppoe', payload);
    },
    enablePppoe(payload) {
      return useApi.post('/mikrotik/enablePppoe', payload);
    },
    disablePppoe(payload) {
      return useApi.post('/mikrotik/disablePppoe', payload);
    },
  };

  const listTypeDNS = [
    'A',
    'AAAA',
    'AFSDB',
    'APL',
    'CAA',
    'CDNSKEY',
    'CDS',
    'CERT',
    'CNAME',
    'CSYNC',
    'DHCID',
    'DLV',
    'DNAME',
    'DNSKEY',
    'DS',
    'EUI48',
    'EUI64',
    'HINFO',
    'HIP',
    'HTTPS',
    'IPSECKEY',
    'KEY',
    'KX',
    'LOC',
    'MX',
    'NAPTR',
    'NS',
    'NSEC',
    'NSEC3',
    'NSEC3PARAM',
    'OPENPGPKEY',
    'PTR',
    'RRSIG',
    'RP',
    'SIG',
    'SMIMEA',
    'SOA',
    'SRV',
    'SSHFP',
    'SVCB',
    'TA',
    'TKEY',
    'TLSA',
    'TSIG',
    'TXT',
    'URI',
    'ZONEMD',
    '',
  ];

  const momentFormat = 'YYYY-MM-DD HH:mm:ss';

  ELEMENT.locale(ELEMENT.lang.en);

  const getAddressIp = (address) => address.replace('/32', '');

  new Vue({
    el: '#app',
    data() {
      return {
        authed: false,
        title: localStorage.getItem(storageConfig.app_name) || 'App',
        tabActive: localStorage.getItem(storageConfig.tab_active) || '',
        listWanIp: [],
        listAddressIp: [],
        listWanPppoe: [],
        setSource: localStorage.getItem(storageConfig.set_source) || '',
        setIp: '',
        setWan: localStorage.getItem(storageConfig.set_wan) || '',
        token: localStorage.getItem(storageConfig.access_token) || '',
        loading: false,
        formDns: getFormDns(),
        option: {
          type: listTypeDNS,
        },
        listDns: [],
        currentIp: '',
        resetPppoeConfig: {
          waitForStop: Number(localStorage.getItem(storageConfig.reset_pppoe_wait_stop))
                      || 5000,
          waitForConnect: Number(
            localStorage.getItem(storageConfig.reset_pppoe_wait_connect),
          ) || 2000,
          autoDelayAll: Number(
            localStorage.getItem(storageConfig.auto_reset_pppoe_delay_all),
          ) || 120000,
          autoDelayPer: Number(
            localStorage.getItem(storageConfig.auto_reset_pppoe_delay_per),
          ) || 60000,
          concurrency: Number(
            localStorage.getItem(storageConfig.reset_pppoe_concurrency),
          ) || 2,
          ignore: localStorage.getItem(storageConfig.ignore_pppoe_name) || '',
          btnLoading: false,
          log: '',
        },
      };
    },
    methods: {
      async checkPermission() {
        await useApi.get('/auth');
        this.authed = true;
        return this.authed;
      },
      setResetPppoeConcurrency(value) {
        this.resetPppoeConfig.concurrency = Number(value);
        localStorage.setItem(storageConfig.reset_pppoe_concurrency, value);
      },
      setResetPppoeWaitForStop(value) {
        this.resetPppoeConfig.waitForStop = Number(value);
        localStorage.setItem(storageConfig.reset_pppoe_wait_stop, value);
      },
      setResetPppoeWaitForConnect(value) {
        this.resetPppoeConfig.waitForConnect = Number(value);
        localStorage.setItem(storageConfig.reset_pppoe_wait_connect, value);
      },
      setAutoPppoeDelayPer(value) {
        this.resetPppoeConfig.autoDelayPer = Number(value);
        localStorage.setItem(storageConfig.auto_reset_pppoe_delay_per, value);
      },
      setAutoPppoeDelayAll(value) {
        this.resetPppoeConfig.autoDelayAll = Number(value);
        localStorage.setItem(storageConfig.auto_reset_pppoe_delay_all, value);
      },
      setIgnorePppoe(value) {
        localStorage.setItem(storageConfig.ignore_pppoe_name, value);
      },
      async saveConfig() {
        this.loading = true;
        localStorage.setItem(storageConfig.cloudfare_token, this.formDns.token);
        localStorage.setItem(storageConfig.access_token, this.token);

        setTimeout(() => {
          window.location.reload();
          this.loading = false;
        }, 100);
      },
      async setWanIp() {
        if (!(this.setIp && this.setWan)) {
          return false;
        }

        this.loading = true;

        localStorage.setItem(storageConfig.set_wan, this.setWan);

        const payload = {
          address: this.setWan,
          ip: this.setIp,
        };

        await useMikrotikService.setIpAddress(payload);

        await this.fetchListAddress();

        setTimeout(() => {
          this.loading = false;
        }, 500);
      },
      async setDnsIp() {
        if (!this.setIp) {
          return false;
        }

        this.loading = true;

        const listJob = [];

        this.listDns
          .filter((item) => item.is_active)
          .forEach((item) => {
            listJob.push(this.onSet(item.id, this.setIp));
          });

        await Promise.all(listJob)
          .then(async () => {
            await this.fetchListDns();
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      },
      async fetchIp() {
        const {
          data: currentIp,
        } = await useCloudfareService.getCurentIp();
        this.currentIp = currentIp;
        this.setIp = currentIp;
      },
      async fetchListDns() {
        this.listDns = (await useCloudfareService.getListDns()).data.map(
          (item) => ({
            loading: false,
            ...item,
          }),
        );
      },
      async fetchListAddress() {
        this.listWanIp = (await useMikrotikService.getListInterface()).data
          .filter((item) => item.disabled === 'false')
          .filter((item) => item.interface.toLowerCase().includes('pppoe'))
          .map((item) => {
            const ip = getAddressIp(item.address);
            return {
              name: item.interface,
              label: `${item.interface} (${ip})`,
              ip,
            };
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1));

        this.listAddressIp = (await useMikrotikService.getListAddress()).data
          .filter((item) => item.disabled === 'false')
          .filter((item) => item.list.toLowerCase().includes('ddns'))
          .map((item) => ({
            name: item.list,
            label: `${item.list} (${item.address})`,
            address: item.list,
          }));

        this.listWanPppoe = (await useMikrotikService.getListInterface()).data
          .filter((item) => item.interface.toLowerCase().includes('pppoe'))
          .map((item) => {
            const ip = getAddressIp(item.address);

            return {
              isChecked: !this.resetPppoeConfig.ignore.includes(item.interface),
              id: item.interface,
              name: item.interface,
              ip,
              log: '',
              lastestIp: '',
              resetCount: 0,
              lastestReset: '',
              isActive: !!ip,
              isError: false,
              isConnecting: false,
              isLoading: false,
            };
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1));
      },
      async fetchData() {
        if (!this.token) {
          return false;
        }

        document.title = this.title;
        this.loading = true;

        await Promise.all([
          this.fetchIp(),
          this.fetchListDns(),
          this.fetchListAddress(),
        ]).catch(() => {});

        this.loading = false;
      },
      onSource() {
        const source = this.setSource;
        localStorage.setItem(storageConfig.set_source, source);
        const matchWan = this.listWanIp.find((item) => item.name === source);
        this.setIp = matchWan ? matchWan.ip : this.setIp;
      },
      async onSubmit() {
        this.loading = true;
        const {
          data: dnsData,
        } = await useCloudfareService.createDns(
          this.formDns,
        );

        this.listDns.push(dnsData);
        this.formDns = getFormDns();
        this.loading = false;
      },
      async onSet(id) {
        const ip = this.setIp;

        if (!ip) {
          return false;
        }

        const indexDns = this.listDns.findIndex((item) => item.id === id);
        const dataDns = this.listDns[indexDns];

        dataDns.loading = true;

        const {
          data: dnsSet,
        } = await useCloudfareService.setDns(dataDns.id, {
          ip,
        });

        this.listDns[indexDns] = {
          ...this.listDns[indexDns],
          ...dnsSet,
        };

        dataDns.loading = false;
      },
      async onChange(data) {
        await useCloudfareService.updateDns(data.id, {
          is_active: data.is_active,
          is_proxy: data.is_proxy,
          type: data.type,
        });
      },
      async resetAllPppoe(isRunAll = true) {
        this.resetPppoeConfig.btnLoading = true;
        if (isRunAll) {
          await Promise.map(
            this.listWanPppoe,
            async (item) => {
              await this.onRsetPppoe(item);
            },
            {
              concurrency: this.resetPppoeConfig.concurrency,
            },
          );
        } else {
          await Promise.mapSeries(this.listWanPppoe, async (item) => {
            await this.onRsetPppoe(item);
          });
        }
        this.resetPppoeConfig.btnLoading = false;
      },
      async autoResetPpppoe(isRunAll = true) {
        this.resetPppoeConfig.btnLoading = true;

        while (true) {
          if (isRunAll) {
            await Promise.map(
              this.listWanPppoe,
              async (item) => {
                await this.onRsetPppoe(item);
                this.resetPppoeConfig.log = `Delay Per PPPOE ${this.resetPppoeConfig.autoDelayPer}`;
                await delay(this.resetPppoeConfig.autoDelayPer);
              },
              {
                concurrency: this.resetPppoeConfig.concurrency,
              },
            );
          } else {
            await Promise.mapSeries(this.listWanPppoe, async (item) => {
              await this.onRsetPppoe(item);
              this.resetPppoeConfig.log = `Delay Per PPPOE ${this.resetPppoeConfig.autoDelayPer}`;
              await delay(this.resetPppoeConfig.autoDelayPer);
            });
          }

          this.resetPppoeConfig.log = `Delay Reset All ${this.resetPppoeConfig.autoDelayAll}`;
          await delay(this.resetPppoeConfig.autoDelayAll);
        }

        this.resetPppoeConfig.btnLoading = false;
      },
      async onRemove(id) {
        this.$confirm('Remove Domain', 'Confirm', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        })
          .then(async () => {
            await useCloudfareService.removeDns(id);
            this.listDns = this.listDns.filter((item) => item.id !== id);
          })
          .catch(() => {});
      },
      rowTableDnsColor({
        row,
      }) {
        if (row.is_error) {
          return 'danger-row';
        }

        if (!row.is_active) {
          return '';
        }

        if (row.is_success) {
          return 'success-row';
        }

        if (row.is_active) {
          return 'info-row';
        }

        return 'warning-row';
      },
      rowTablePppoeColor({
        row,
      }) {
        if (row.isError) {
          return 'danger-row';
        }

        if (row.isConnecting) {
          return 'info-row';
        }

        if (row.lastestIp && row.lastestIp === row.ip) {
          return 'warning-row';
        }

        if (!row.isChecked) {
          return 'secondary-row';
        }

        if (row.isActive) {
          return 'success-row';
        }

        return '';
      },
      async onRsetPppoe(data) {
        if (!data.isChecked) {
          data.log = 'Skip';
          return false;
        }

        data.isLoading = true;

        data.isConnecting = true;
        data.log = 'Connecting...';

        try {
          const resetData = (
            await useMikrotikService.resetPppoe({
              name: data.id,
              waitForStop: this.resetPppoeConfig.waitForStop,
              waitForConnect: this.resetPppoeConfig.waitForConnect,
            })
          ).data;

          const newIp = getAddressIp(resetData.address);

          if (!newIp) {
            throw 'NEW_IP_ERROR';
          }

          data.lastestIp = data.ip;
          data.ip = newIp;
          data.resetCount++;
          data.lastestReset = new Date().toLocaleTimeString();

          data.log = 'Connected Success';
          data.isError = false;
          data.isActive = true;
        } catch (error) {
          data.isActive = false;
          data.isError = true;
          data.log = 'Connect Error';
        }

        data.isConnecting = false;
        data.isLoading = false;
      },
      async getMetaApp() {
        const { data: metaApp } = await useAppService.getMetaApp();
        const { appName } = metaApp;
        localStorage.setItem(storageConfig.app_name, appName);
        this.title = appName;
      },
    },
    async created() {
      document.title = this.title;
      this.getMetaApp().catch((error) => {
        console.error({
          msg: 'GET_META_APP_ERROR',
          error,
        });
      });

      if (!this.token) {
        return false;
      }

      try {
        await this.checkPermission();

        await this.fetchData();

        this.onSource();
      } catch (error) {
        this.$notify.error({
          title: error.response.data.message,
          message: `Error ${error.message}`,
        });
      }
    },
    computed: {
      listDnsTable() {
        return this.listDns.map((item) => ({
          ...item,
          timeCreate: moment(item.createdAt).format(momentFormat),
          timeUpdate: moment(item.updatedAt).format(momentFormat),
          proxy: item.is_proxy ? 'On' : 'Off',
          url: `https://${item.name}`,
          title: (item.sub || '@').replace('-', ' '),
        }));
      },
      listPPOETable() {
        return this.listWanPppoe;
      },
      getAppTile() {
        return `${this.title} (IP: ${this.setIp})`;
      },
    },
    watch: {
      tabActive(value) {
        localStorage.setItem(storageConfig.tab_active, value);
      },
      getAppTile(value) {
        document.title = value;
      },
    },
  });
};

document.addEventListener('DOMContentLoaded', appLoader);
