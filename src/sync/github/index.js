'use strict';

async function syncGitHub(repo) {
  const services = [
    require('./branches'),
    require('./labels'),
    require('./milestones'),
  ];
  return Promise.all(services.map(async service => await service(repo)));
}

module.exports = syncGitHub;
