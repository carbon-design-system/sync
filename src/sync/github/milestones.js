'use strict';

const Milestone = require('../../connectors/github/milestones');
const milestones = require('../../data/github/milestones.json');

async function syncMilestones(repo) {
  const { config: { github } } = repo;
  if (!github.milestones) {
    return;
  }
  const remoteMilestones = await Milestone.all(repo.owner, repo.name);

  if (
    remoteMilestones.length > 0 &&
    remoteMilestones.length !== milestones.length
  ) {
    await clearMilestones(repo, remoteMilestones);
  }

  await Promise.all(
    milestones.map(async milestone =>
      Milestone.create(repo.owner, repo.name, milestone)
    )
  );
}

function clearMilestones(repo, milestones) {
  return Promise.all(
    milestones.map(async milestone =>
      Milestone.destroy(repo.owner, repo.name, milestone.number)
    )
  );
}

module.exports = syncMilestones;
