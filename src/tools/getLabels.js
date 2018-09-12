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
const Label = require('../connectors/github/labels');

const writeFileAsync = util.promisify(fs.writeFile);
const LABELS_PATH = path.resolve(__dirname, '../data/github/labels.json');

const args = process.argv.slice(2);
const [owner, repo] = args[0]
  ? args[0].split('/')
  : ['IBM', 'carbon-components-react'];

console.log(`Fetching labels for ${owner}/${repo}...`);

Label.all(owner, repo)
  .then(labels => {
    console.log('Fetched labels, writing to disc...');
    const formattedLabels = labels.map(label => ({
      id: label.id,
      name: label.name,
      color: label.color,
    }));

    return writeFileAsync(
      LABELS_PATH,
      JSON.stringify(formattedLabels, null, 2)
    );
  })
  .then(() => {
    console.log('Done!');
  })
  .catch(error => console.log(error));
