/* eslint-disable no-console */
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
const path = require('path');
const github = require('./sync/github');
const travis = require('./sync/travis-ci');
const repos = require('./data/github/repos.json');

console.log(
  `Running sync on the repos found in: ${path.resolve(
    __dirname,
    './data/github/repos.json'
  )}`
);

Promise.all(repos.map(sync))
  .then(() => {
    console.log('Sync complete!');
  })
  .catch(error => {
    console.log(error);
  });

async function sync(repo) {
  const providers = [github, travis];
  return Promise.all(providers.map(async provider => await provider(repo)));
}
