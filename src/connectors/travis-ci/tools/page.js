'use strict';

const request = require('request-promise');

const page = async (key, config) => {
  const collection = [];
  let response = await request(config);
  collection.push(...response.repositories);

  while (response['@pagination'].is_last === false) {
    const nextConfig = {
      ...config,
      qs: {
        ...config.qs,
        limit: response['@pagination'].next.limit,
        offset: response['@pagination'].next.offset,
      },
    };
    response = await request(nextConfig);
    collection.push(...response.repositories);
  }

  return collection;
};

module.exports = page;
