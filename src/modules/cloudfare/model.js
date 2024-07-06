const { sequelize, DataTypes } = require('../../config').db;
const model = require('../../config/sequelize');

const Schema = sequelize.define('dns', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'A',
    allowNull: false,
  },
  zone_id: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
  },
  record_id: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
  },
  record_data: {
    allowNull: false,
    defaultValue: {},
    type: DataTypes.JSON,
  },
  zone_data: {
    allowNull: false,
    defaultValue: {},
    type: DataTypes.JSON,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sub: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.VIRTUAL,
    get() {
      return (this.sub) ? `${this.sub}.${this.domain}` : this.domain;
    },
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  },
  is_proxy: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_success: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_error: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  log: {
    allowNull: false,
    defaultValue: {},
    type: DataTypes.JSON,
  },
  error: {
    allowNull: false,
    defaultValue: {},
    type: DataTypes.JSON,
  },
});

module.exports = model(Schema);
