'use strict';

module.exports = (func) => {
  return (...args) => {
    // eslint-disable-next-line promise/avoid-new
    return new Promise(function (resolve, reject) {
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      func(...args, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  };
};
