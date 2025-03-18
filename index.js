// Query Types: https://opensearch.org/docs/latest/query-dsl/full-text/index/
// Filter Options: https://opensearch.org/docs/latest/query-dsl/full-text/index/#advanced-filter-options

// https://opensearch.org/docs/latest/
// https://opensearch.org/docs/latest/search-plugins/searching-data/autocomplete/
const { pipeline } = require('./lib/pipeline');
const query = require('./lib/query');
const { options } = require('./lib/options');
const { newClient, createCredentials } = require('./lib/client');

exports = module.exports = pipeline;

exports.pipeline = pipeline;
exports.query = { ...query, ...options };
exports.queryDSL = query;
exports.options = options;
exports.newClient = newClient;
exports.createCredentials = createCredentials;
