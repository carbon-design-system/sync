'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const Repo = require('../connectors/github/repos');
const savedRepos = require('../data/github/repos.json');

const writeFileAsync = util.promisify(fs.writeFile);
const REPOS_PATH = path.resolve(__dirname, '../data/github/repos.json');

const first = array => array[0];
const getRepoByName = (repos, name) => {
  return first(repos.filter(repo => repo.name === name));
};

const getConfig = (repo, savedRepo) => {
  const defaultOptions = {
    travis_ci: {
      enabled: false,
      CLOUD_TOKEN: false,
      NPM_TOKEN: false,
      GH_TOKEN: false,
    },
    github: {
      enabled: false,
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
};

Repo.all('carbon-design-system')
  .then(repos =>
    writeFileAsync(
      REPOS_PATH,
      JSON.stringify(
        repos.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          owner: repo.owner.login,
          html_url: repo.html_url,
          url: repo.url,
          config: getConfig(repo, getRepoByName(savedRepos, repo.name)),
        })),
        null,
        2
      )
    )
  )
  // eslint-disable-next-line no-console
  .catch(error => console.log(error));
