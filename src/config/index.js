require('dotenv').config();
const getenv = require('getenv');
const db = require('./db');

module.exports = {
  server: {
    host: getenv.string('HOST'),
    port: getenv.int('PORT'),
  },
  setStatic: {
    ip: getenv.string('STATIC_IP', ''),
    domain: getenv.string('STATIC_DOMAIN', ''),
  },
  db,
};
