const { pipeline } = require('./lib/pipeline');
const query = require('./lib/query');
const { newClient, createCredentials } = require('./lib/client');

exports = module.exports = pipeline;

exports.pipeline = pipeline;
exports.query = query;
exports.newClient = newClient;
exports.createCredentials = createCredentials;
