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
    )}/branches`,
    qs: {
      per_page: 100,
    },
  };
  return await page(config);
}

async function getProtectionFor(owner, repo, branch) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${repo}/branches/${branch}/protection`,
    json: true,
  };
  return (await request(config)).body;
}

async function updateProtectionFor(owner, repo, branch, body) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${repo}/branches/${branch}/protection`,
    method: 'PUT',
    json: true,
    body,
  };
  return (await request(config)).body;
}

module.exports = exports = {
  all,
  getProtectionFor,
  updateProtectionFor,
};
