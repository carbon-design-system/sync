'use strict';

async function syncBranches(repo) {
  const { config: { github } } = repo;
  if (!github.protected) {
    return;
  }
}

module.exports = syncBranches;
