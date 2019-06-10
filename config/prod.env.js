var envUtil = require('./envUtil')
var url = envUtil.getServiceUrl();
module.exports = {
  NODE_ENV: '"production"',
  ServiceUrl: '"'+ url +'"'//url
};
