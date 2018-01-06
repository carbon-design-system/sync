'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const Label = require('../connectors/github/labels');

const writeFileAsync = util.promisify(fs.writeFile);
const LABELS_PATH = path.resolve(__dirname, '../data/github/labels.json');

Label.all('carbon-design-system', 'carbon-components-react')
  .then(labels => writeFileAsync(LABELS_PATH, JSON.stringify(labels, null, 2)))
  // eslint-disable-next-line no-console
  .catch(error => console.log(error));
