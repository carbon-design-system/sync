'use strict';

const User = require('../../connectors/travis-ci/user');

const CARBON_BOT_ID = '1017740';

async function syncTravis(repo) {
  const { config: { travis } } = repo;

  if (!hasEnabledAService(travis)) {
    return;
  }

  const services = [require('./tokens')];
  await User.sync(CARBON_BOT_ID);
  return Promise.all(services.map(async service => await service(repo)));
}

function hasEnabledAService(travis) {
  return Object.keys(travis).filter(key => travis[key]).length !== 0;
}

module.exports = syncTravis;
