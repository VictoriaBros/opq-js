const { Client } = require('@opensearch-project/opensearch');
const startDebug = require('debug');

const debug = startDebug('opensearch');
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
                console.time('opensearch REQ <> RES');
                debug('opensearch REQ BEGIN', { index });
                const { headers, statusCode, body } = await client.search({
                    index: index,
                    body: query
                });

                debug('executed query', { index, query, body });
                console.timeEnd('opensearch REQ <> RES');

                if (body) {
                    const { took, hits } = body;
                    debug('opensearch REQ END', { index, headers, statusCode, took });

                    if (hits && hits.hits) {
                        debug('query hits', { hits, took });
                        return callback(null, hits);
                    }
                }

                debug('opensearch REQ END', { index, headers, statusCode });
                return callback(new ReferenceError('ERR_NO_BODY'));
            } catch (err) {
                debug('opensearch REQ ERROR', err);
                return callback(err);
            }
        },
    };
};

exports.createCredentials = createCredentials;
exports.newClient = newClient;
