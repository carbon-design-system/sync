'use strict';

async function syncTravis(repo) {
  const { config: { travis_ci: travis } } = repo;
  if (!travis.enabled) {
    return;
  }
}

module.exports = syncTravis;
