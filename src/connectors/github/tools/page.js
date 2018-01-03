'use strict';

const request = require('request-promise');
const parseLinkHeader = require('parse-link-header');

const retry = fn => (...args) =>
  new Promise((resolve, reject) => {
    fn(...args)
      .then(resolve)
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
        // We should try and do exponential back-off here
        retry(fn)(...args)
          .then(resolve)
          .catch(reject);
      });
  });

const requestWithRetries = retry(request);

const page = async config => {
  const response = await requestWithRetries(config);
  if (response.headers.link === undefined) {
    return JSON.parse(response.body);
  }

  const collection = JSON.parse(response.body);
  let link = parseLinkHeader(response.headers.link);

  while (link.next !== undefined) {
    const pageConfig = {
      uri: link.next.url,
      headers: {
        ...config.headers,
      },
      resolveWithFullResponse: true,
    };
    const pagedResponse = await requestWithRetries(pageConfig);
    collection.push(...JSON.parse(pagedResponse.body));
    link = parseLinkHeader(pagedResponse.headers.link);
  }

  return collection;
};

module.exports = page;
