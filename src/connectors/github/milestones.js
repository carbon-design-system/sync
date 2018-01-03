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
  json: true,
};

async function all(owner, repo) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${repo}/milestones`,
    qs: {
      per_page: 100,
    },
    json: true,
  };
  return page(config);
}

async function find(owner, repo, number) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${repo}/milestones/${number}`,
    qs: {
      per_page: 100,
    },
    json: true,
  };
  return (await request(config)).body;
}

async function create(owner, repo, body) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${repo}/milestones`,
    method: 'POST',
    json: true,
    body,
  };
  return request(config);
}

async function update(owner, repo, number, body) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${repo}/milestones/${number}`,
    method: 'PATCH',
    json: true,
    body,
  };
  return (await request(config)).body;
}

async function destroy(owner, repo, number) {
  const config = {
    ...baseConfig,
    uri: `/repos/${owner}/${repo}/milestones/${number}`,
    method: 'DELETE',
    json: true,
  };
  return (await request(config)).body;
}

module.exports = exports = {
  all,
  find,
  create,
  update,
  destroy,
};
