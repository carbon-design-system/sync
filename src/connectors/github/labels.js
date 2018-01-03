'use strict';

const request = require('request-promise');
const page = require('./tools/page');

const { GH_TOKEN } = process.env;
const baseConfig = {
  method: 'GET',
  baseUrl: 'https://api.github.com',
  headers: {
    Accept: 'application/json',
    Authorization: `token ${GH_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'carbon-bot',
  },
  resolveWithFullResponse: true,
  timeout: 10000,
};

async function all(owner, repo) {
  const config = {
    ...baseConfig,
    uri: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/labels`,
    qs: {
      per_page: 100,
    },
  };
  return page(config);
}

async function create(owner, repo, options) {
  const config = {
    ...baseConfig,
    uri: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/labels`,
    method: 'POST',
    body: options,
    json: true,
  };
  return request(config).body;
}

async function update(owner, repo, options) {
  const config = {
    ...baseConfig,
    uri: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo
    )}/labels`,
    method: 'POST',
    body: options,
    json: true,
  };
  return request(config).body;
}

async function destroy(owner, repo, name) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${encodeURIComponent(
      repo
    )}/labels/${encodeURIComponent(name)}`,
    method: 'DELETE',
    json: true,
  };
  return request(config);
}

module.exports = exports = {
  all,
  create,
  update,
  destroy,
};
