const lodash = require('lodash');

const renderDefault = (raw) => {
  try {
    if (raw && raw.get) {
      return raw.get({
        plain: true,
      });
    }
    return raw;
  } catch (error) {
    console.error({
      msg: 'ERROR_RENDER_DATA',
      error,
    });
    return raw;
  }
};

module.exports = (Schema, sortDefault = null, renderHandler = renderDefault) => {
  const pageDefault = 0;
  const limitDefault = 100;

  return {
    name: Schema.name,
    sync: async (opts = {
      alter: true,
    }) => Schema.sync(opts),
    raw: Schema,
    renderData: (raw) => renderHandler(raw),
    Schema: class {
      constructor(data) {
        this.data = data;
      }

      set(key, value) {
        return lodash.set(this.data, key, value);
      }

      get(key, defaultValue = null) {
        return lodash.get(this.data, key, defaultValue);
      }

      has(key) {
        return lodash.has(this.data, key);
      }

      getAll() {
        return this.data;
      }

      async save() {
        const saved = await Schema.create(this.data);
        return renderHandler(saved);
      }
    },
    async count(query = {}, opts = {}) {
      return Schema.count(
        {
          where: query,
          ...opts,
        },
        opts,
      );
    },
    async create(data, opts = {}) {
      const saved = await Schema.create(data, opts);
      return renderHandler(saved);
    },
    async list(query = {}, limit = limitDefault, page = 0, sort = null, attribute = null, opts = {}) {
      const data = await Schema.findAll({
        where: query,
        limit: limit || limitDefault,
        offset: page || pageDefault,
        order: sort || sortDefault || [],
        ...(attribute
          ? {
            attributes: attribute,
          }
          : {}),
        ...opts,
      });

      return data.map((item) => renderHandler(item));
    },
    async listById(query = {}, limit = limitDefault, page = 0, sort = [], opts = {}) {
      const data = await Schema.findAll({
        where: query,
        limit: limit || limitDefault,
        offset: page || pageDefault,
        order: sort || sortDefault || [],
        attributes: ['id'],
        ...opts,
      });

      return data.map(({
        id,
      }) => id);
    },
    async findId(id, opts = {}) {
      const data = await Schema.findOne({
        where: {
          id,
        },
        ...opts,
      });

      return renderHandler(data);
    },
    async updateId(id, update = null, opts = {}) {
      if (id && update) {
        return Schema.update(update, {
          where: {
            id,
          },
          paranoid: false,
          ...opts,
        });
      }
      return false;
    },
    removeId(id) {
      if (id) {
        return Schema.destroy({
          where: {
            id,
          },
        });
      }
      return false;
    },
    async updateQuery(query = null, update = null, opts = {}) {
      if (query && update) {
        return Schema.update(update, {
          where: query,
          paranoid: false,
          ...opts,
        });
      }
      return false;
    },
    async findQuery(query = null, page = 0, sort = null, opts = {}) {
      if (query) {
        const data = await Schema.findOne({
          where: query,
          ...(page
            ? {
              offset: page,
            }
            : {}),
          ...(sort && sort.length
            ? {
              order: sort,
            }
            : {}),
          ...opts,
        });

        return renderHandler(data);
      }
      return false;
    },
    removeQuery(query = null, opts = {}) {
      if (query) {
        return Schema.destroy({
          where: query,
          ...opts,
        });
      }
      return false;
    },
  };
};
