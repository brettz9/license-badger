'use strict';

const licensee = require('licensee');

module.exports = (...args) => {
  // eslint-disable-next-line promise/avoid-new
  return new Promise(function (resolve, reject) {
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    licensee(...args, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
};
