'use strict';

const Label = require('../../connectors/github/labels');
const labels = require('../../data/github/labels.json');

async function syncLabels(repo) {
  const { config: { github } } = repo;
  if (!github.labels) {
    return;
  }
  const remoteLabels = await Label.all(repo.owner, repo.name);

  if (areEqual(labels, remoteLabels)) {
    return;
  }

  await clearLabels(repo, remoteLabels);
  await Promise.all(
    labels.map(label => Label.create(repo.owner, repo.name, label))
  );
}

function clearLabels(repo, labels) {
  return Promise.all(
    labels.map(label => Label.destroy(repo.owner, repo.name, label.name))
  );
}

const areEqual = (localLabels, remoteLabels) => {
  if (remoteLabels.length === 0) {
    return false;
  }

  if (localLabels.length !== remoteLabels.length) {
    return false;
  }

  localLabels.forEach(localLabel => {
    const hasLabel = remoteLabels.find(
      remoteLabel =>
        localLabel.name === remoteLabel.name &&
        localLabel.color === remoteLabel.color
    );
    if (!hasLabel) {
      return false;
    }
  });

  return true;
};

module.exports = syncLabels;
