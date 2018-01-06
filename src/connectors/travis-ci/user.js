'use strict';

const request = require('request-promise');
const { TRAVIS_TOKEN } = process.env;
const baseConfig = {
  baseUrl: 'https://api.travis-ci.org',
  headers: {
    Accept: 'application/json',
    Authorization: `token ${TRAVIS_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'carbon-bot',
    'Travis-API-Version': 3,
  },
  timeout: 10000,
};

function get() {
  const config = {
    ...baseConfig,
    uri: `/user`,
    json: true,
  };
  return request(config);
}

function sync(userId) {
  const config = {
    ...baseConfig,
    uri: `/user/${userId}/sync`,
    method: 'POST',
  };
  return request(config);
}

module.exports = exports = {
  get,
  sync,
};
