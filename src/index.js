'use strict';

if (!process.env.GH_TOKEN) {
  // eslint-disable-next-line no-console
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

Promise.all(repos.map(sync))
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('✅  Sync complete!');
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
