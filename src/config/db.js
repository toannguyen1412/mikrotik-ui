const { Sequelize, DataTypes, Op } = require('sequelize');

const path = require('path');

let db = {};

if (process.env.DB_TYPE === 'sqlite') {
  db = {
    dialect: process.env.DB_TYPE,
    storage: path.join(__dirname, '../../database', process.env.DB_FILE),
  };
} else if (process.env.DB_TYPE === 'mysql') {
  db = {
    dialect: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  };
} else {
  throw new Error('DB_INIT_ERROR');
}

module.exports = {
  sequelize: new Sequelize({
    active: false,
    logging: false,
    logQueryParameters: false,
    operatorsAliases: {
      $between: Op.between,
      $notLike: Op.notLike,
      $like: Op.like,
      $notIn: Op.notIn,
      $in: Op.in,
      $ne: Op.ne,
      $or: Op.or,
      $and: Op.and,
      $any: Op.any,
      $gt: Op.gt,
      $gte: Op.gte,
      $lt: Op.lt,
      $lte: Op.lte,
    },
    sync: true,
    ...db,
  }),
  DataTypes,
};
