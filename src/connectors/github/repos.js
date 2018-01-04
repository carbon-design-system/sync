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

async function all(org) {
  const config = {
    ...baseConfig,
    uri: `/orgs/${encodeURIComponent(org)}/repos`,
    qs: {
      per_page: 100,
    },
  };
  return await page(config);
}

async function find(owner, repo) {
  const config = {
    ...baseConfig,
    uri: `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
  };
  return await request(config);
}

module.exports = exports = {
  all,
  find,
};
