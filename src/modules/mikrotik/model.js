const { sequelize, DataTypes } = require('../../config').db;
const model = require('../../config/sequelize');

const Schema = sequelize.define('mikrotik', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
});

module.exports = model(Schema);
