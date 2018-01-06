'use strict';

const User = require('../../connectors/travis-ci/user');

const CARBON_BOT_ID = '1017740';

async function syncTravis(repo) {
  const { config: { travis_ci: travis } } = repo;
  if (!travis.enabled) {
    return;
  }
  await User.sync(CARBON_BOT_ID);
  const services = [require('./tokens')];
  return Promise.all(services.map(async service => await service(repo)));
}

module.exports = syncTravis;
