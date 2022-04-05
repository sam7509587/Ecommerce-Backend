const { logger } = require('../shared');

exports.checkEnvVariable = (vari) => {
  if (process.env.vari === undefined) {
    return false;
  } else {
    return true;
  }
};
