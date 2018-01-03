'use strict';

const request = require('request-promise');
const page = require('./tools/page');

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
  json: true,
  timeout: 10000,
};

async function all(slug) {
  const config = {
    ...baseConfig,
    uri: `/repo/${encodeURIComponent(slug)}/env_vars`,
    method: 'GET',
  };
  return await page('env_vars', config);
}

async function find(slug, id) {
  const config = {
    ...baseConfig,
    uri: `/repo/${encodeURIComponent(slug)}/env_var/${id}`,
    method: 'GET',
  };
  return await request(config);
}

async function create(slug, params) {
  const config = {
    ...baseConfig,
    uri: `/repo/${encodeURIComponent(slug)}/env_vars`,
    method: 'POST',
    body: {
      env_var: params,
    },
  };
  return await request(config);
}

async function update(slug, id, params) {
  const config = {
    ...baseConfig,
    uri: `/repo/${encodeURIComponent(slug)}/env_var/${id}`,
    method: 'POST',
    body: {
      env_var: params,
    },
  };
  return await request(config);
}

module.exports = exports = {
  all,
  find,
  create,
  update,
};

exports.all = all;
exports.find = find;
exports.create = create;
exports.update = update;
