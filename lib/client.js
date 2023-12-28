// https://opensearch.org/docs/latest/
// https://opensearch.org/docs/latest/search-plugins/searching-data/autocomplete/

import { Client } from '@opensearch-project/opensearch';
import startDebug from 'debug';

const debug = startDebug('opensearch');
const protocol = 'https';
const createCredentials = (config) => {
    // protocol + "://" + auth + "@" + host + ":" + port,
    const credentials = [
        protocol,
        '://',
        config.username,
        ':',
        config.password,
        '@',
        config.host,
    ];

    return credentials.join('');
};

const newClient = (config = {  memoryCircuitBreakerEnabled = true, memoryCircuitBreakerMaxPercent = 0.5  }) => {
    const client = new Client({
        enableLongNumeralSupport: true,
        memoryCircuitBreaker: {
            enabled: config.memoryCircuitBreakerEnabled,
            maxPercentage: config.memoryCircuitBreakerMaxPercent,
        },
        node: createCredentials(config),
        // ssl: {
        //   ca: fs.readFileSync(ca_certs_path),
        // You can turn off certificate verification (rejectUnauthorized: false) if you're using
        // self-signed certificates with a hostname mismatch.
        // cert: fs.readFileSync(client_cert_path),
        // key: fs.readFileSync(client_key_path)
        // },
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
                return callback('empty body');
            } catch (err) {
                debug('opensearch REQ ERROR', err);
                return callback(err);
            }
        },
    };
};

export {
    createCredentials,
    newClient,
};
