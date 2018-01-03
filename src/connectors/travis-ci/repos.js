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

async function all(owner, qs = {}) {
  const config = {
    ...baseConfig,
    uri: `/owner/${owner}/repos`,
    method: 'GET',
    qs,
  };

  return await page('repositories', config);
}

async function activate(slug) {
  const config = {
    ...baseConfig,
    uri: `/repo/${encodeURIComponent(slug)}/activate`,
    method: 'POST',
  };
  return await request(config);
}

async function deactivate(slug) {
  const config = {
    ...baseConfig,
    uri: `/repo/${encodeURIComponent(slug)}/deactivate`,
    method: 'POST',
  };
  return await request(config);
}

module.exports = exports = {
  all,
  activate,
  deactivate,
};
