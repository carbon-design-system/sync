/* eslint-disable no-console */

'use strict';

const chalk = require('chalk');

if (!process.env.GH_TOKEN) {
  console.error(
    chalk.red(
      `Expected a token for GitHub as an environment variable named ` +
        `\`GH_TOKEN\`. Instead got: \`${process.env.GH_TOKEN}\``
    )
  );
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const util = require('util');
const Repo = require('../connectors/github/repos');
const savedRepos = require('../data/github/repos.json');

const writeFileAsync = util.promisify(fs.writeFile);
const REPOS_PATH = path.resolve(__dirname, '../data/github/repos.json');

console.log('Fetching repos from sources...');

flatMap(Promise.all([Repo.all('carbon-design-system'), getIBMRepos()]))
  .then(repos => {
    console.log('Collected repos, writing to disc...');

    return writeFileAsync(
      REPOS_PATH,
      JSON.stringify(
        repos.map(repo => ({
          name: repo.name,
          owner: repo.owner.login,
          url: repo.html_url,
          config: getConfig(repo, getRepoByName(savedRepos, repo.name)),
        })),
        null,
        2
      )
    );
  })
  .then(() => {
    console.log('Done!');
  })
  .catch(error => console.log(error));

function getConfig(repo, savedRepo) {
  const defaultOptions = {
    travis: {
      CLOUD_TOKEN: false,
      NPM_TOKEN: false,
      GH_TOKEN: false,
    },
    github: {
      labels: false,
      milestones: false,
      protected: false,
    },
  };

  if (!savedRepo) {
    return defaultOptions;
  }

  return {
    travis_ci: {
      ...defaultOptions.travis_ci,
      ...savedRepo.config.travis_ci,
    },
    github: {
      ...defaultOptions.github,
      ...savedRepo.config.github,
    },
  };
}

async function flatMap(promise) {
  return (await promise).reduce((acc, arr) => acc.concat(arr), []);
}

function first(array) {
  return array[0];
}

function getRepoByName(repos, name) {
  return first(repos.filter(repo => repo.name === name));
}

function getIBMRepos() {
  return Repo.all('IBM').then(repos => {
    return repos.filter(repo => {
      if (repo.name.toLowerCase().includes('carbon')) {
        return true;
      }

      if (repo.name === 'design-system-website') {
        return true;
      }

      return false;
    });
  });
}
