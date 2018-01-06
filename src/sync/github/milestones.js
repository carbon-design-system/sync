'use strict';

const Milestone = require('../../connectors/github/milestones');
const milestones = require('../../data/github/milestones.json');

async function syncMilestones(repo) {
  const { config: { github } } = repo;
  if (!github.milestones) {
    return;
  }
  const remoteMilestones = await Milestone.all(repo.owner, repo.name);

  if (areEqual(milestones, remoteMilestones)) {
    return;
  }

  await clearMilestones(repo, remoteMilestones);
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

const areEqual = (localMilestones, remoteMilestones) => {
  if (remoteMilestones.length === 0) {
    return false;
  }

  if (remoteMilestones.length !== milestones.length) {
    return false;
  }

  localMilestones.forEach(localMilestone => {
    const hasMilestone = remoteMilestones.find(remoteMilestone => {
      return (
        localMilestone.title === remoteMilestone.title &&
        localMilestone.description === remoteMilestone.description &&
        localMilestone.due_on === remoteMilestone.due_on
      );
    });
    if (!hasMilestone) {
      return false;
    }
  });

  return true;
};

module.exports = syncMilestones;
