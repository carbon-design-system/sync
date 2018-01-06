'use strict';

async function syncGitHub(repo) {
  const { config: { github } } = repo;
  if (!github.enabled) {
    return;
  }
  const services = [require('./labels'), require('./milestones')];
  return Promise.all(services.map(async service => await service(repo)));
}

module.exports = syncGitHub;
