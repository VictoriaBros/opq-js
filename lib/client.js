const { Client } = require('@opensearch-project/opensearch');
const startDebug = require('debug');

const debug = startDebug('opensearch:opq');
const createCredentials = (config) => {
    const {
        protocol = 'https',
        username,
        password,
        host,
    } = config;

    // protocol + "://" + auth + "@" + host + ":" + port
    return [protocol, '://', username, ':', password, '@', host].join('');
};

const newClient = (config) => {
    const {
        enableLongNumeralSupport = true,
        memoryCircuitBreakerEnabled = true,
        memoryCircuitBreakerMaxPercent = 0.5,
    } = config;

    const client = new Client({
        enableLongNumeralSupport: enableLongNumeralSupport,
        memoryCircuitBreaker: {
            enabled: memoryCircuitBreakerEnabled,
            maxPercentage: memoryCircuitBreakerMaxPercent,
        },
        node: createCredentials(config),
    });

    return {
        client: client,
        createCredentials: createCredentials,
        search: async (index, query, callback) => {
            try {
                const start = Date.now();
                debug('REQ BEGIN %O', { index });
                const { headers, statusCode, body } = await client.search({
                    index: index,
                    body: query
                });

                const end = Date.now();
                debug('executed query %O', { index, query, body });
                debug('REQ <> RES %O', { durationMs: end - start });

                if (body) {
                    const { took, hits } = body;
                    debug('REQ END %O', { index, headers, statusCode, took });

                    if (hits && hits.hits) {
                        debug('query hits %O', { hits, took });
                        return callback(null, hits);
                    }
                }

                debug('REQ END %O', { index, headers, statusCode });
                return callback(new ReferenceError('ERR_NO_BODY'));
            } catch (err) {
                debug('REQ ERROR', err);
                return callback(err);
            }
        },
    };
};

exports.createCredentials = createCredentials;
exports.newClient = newClient;
