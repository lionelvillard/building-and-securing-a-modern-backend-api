const app = require('./server');
const redirect = require('openwhisk-expressjs')(app);

function main(args) {
  return redirect(args);
}

exports.main = main;
