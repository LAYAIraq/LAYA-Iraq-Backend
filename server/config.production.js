'use strict';
module.exports = {
  restApiRoot: process.env.API_ROOT || '/api',
  host: process.env.API_HOST || '0.0.0.0',
  port: process.env.API_PORT || 3001,
};
