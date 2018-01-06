'use strict';

if (!process.env.GH_TOKEN) {
  console.error(
    chalk.red(
      `Expected a token for GitHub as an environment variable named ` +
        `\`GH_TOKEN\`. Instead got: \`${process.env.GH_TOKEN}\``
    )
  );
  process.exit(1);
}

const chalk = require('chalk');
const github = require('./sync/github');
const travis = require('./sync/travis-ci');
const repos = require('./data/github/repos.json');

async function sync(repo) {
  const providers = [github, travis];
  return Promise.all(providers.map(async provider => await provider(repo)));
}

// async function syncMilestones(repo) {
// const { config: { github } } = repo;
// if (!github.milestones) {
// return;
// }
// console.log('Sync github milestones for:', repo.name);
// }

// async function syncLabels(repo) {
// const { config: { github } } = repo;
// if (!github.labels) {
// return;
// }
// console.log('Sync github labels for:', repo.name);
// }

// async function syncBranch(repo) {
// const { config: { github } } = repo;
// if (!github.protected) {
// return;
// }
// console.log('Sync github branch protection for:', repo.name);
// }

// async function syncTravis(repo) {
// const { config: { travis_ci: travis } } = repo;
// if (!travis.enabled) {
// return;
// }
// console.log('Sync travis for:', repo.name);
// const services = [syncEnabled, syncEnvVars];
// return Promise.all(services.map(async service => await service(repo)));
// }

// async function syncEnabled(repo) {
// console.log('Sync travis enabled status for:', repo.name);
// }

// async function syncEnvVars(repo) {
// const { config: { travis_ci: travis } } = repo;
// if (!(travis.NPM_TOKEN && travis.CLOUD_TOKEN && travis.GH_TOKEN)) {
// return;
// }
// const tokensToSync = ['NPM_TOKEN', 'CLOUD_TOKEN', 'GH_TOKEN'].filter(
// name => travis[name]
// );
// console.log('Sync travis ENV vars for:', repo.name, tokensToSync);
// }

Promise.all(repos.map(sync))
  .then(() => {
    console.log('✅  Sync complete!');
  })
  .catch(error => {
    console.log(error);
  });
