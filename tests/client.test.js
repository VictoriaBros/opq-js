const { createCredentials, newClient, query, pipeline } = require('../');

const mockSearchFn = jest.fn()
    .mockResolvedValueOnce({
        headers: {
            'date': 'Mon, 22 Jan 2024 10:28:53 GMT',
            'content-type': 'application/json; charset=UTF-8',
            'content-length': 85,
            'connection': 'keep-alive',
            'access-control-allow-origin': '*'
        },
        statusCode: 200,
        body: {
            took: 39,
            timed_out: false,
            _shards: { total: 50, successful: 50, skipped: 0, failed: 0 },
            hits: {
                total: { value: 1, relation: 'eq' },
                max_score: 13.516391,
                hits: [
                    {
                        '_index' : 'fruits_index',
                        '_id' : '32437',
                        '_score' : 18.781435,
                        '_source' : {
                            'family' : 'Rutaceae',
                            'fruit_name' : 'Orange',
                            'summary' : '...',
                            'color' : '#FFA500',
                        }
                    },
                ],
            },
        },
    })
    .mockResolvedValueOnce({
        headers: {
            'date': 'Mon, 22 Jan 2024 10:28:53 GMT',
            'content-type': 'application/json; charset=UTF-8',
            'content-length': 0,
            'connection': 'keep-alive',
            'access-control-allow-origin': '*'
        },
        statusCode: 200,
        body: {},
    })
    .mockRejectedValueOnce(new Error('error message'));

jest.mock('@opensearch-project/opensearch', () => {
    const originalModule = jest.requireActual('@opensearch-project/opensearch');

    // Mock the default export and named export
    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(),
        Client: jest.fn(() => ({
            search: mockSearchFn,
        })),
    };
});

describe('client', () => {
    test('create credentials with default protocol', () => {
        expect(createCredentials({
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        })).toEqual('https://admin:admin@localhost:9200');
    });

    test('create credentials with http protocol', () => {
        expect(createCredentials({
            protocol: 'http',
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        })).toEqual('http://admin:admin@localhost:9200');
    });

    test('search without error', () => {
        const client = newClient({
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        });

        const pipelineQ = pipeline(
            query.match('fruit_name', 'Orange'),
            query.withQuery(),
        );

        expect(client.client).toBeDefined();
        expect(client.createCredentials({
            protocol: 'http',
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        })).toEqual('http://admin:admin@localhost:9200');

        client.search('fruits_index', pipelineQ(), async (err, record) => {
            const { value } = mockSearchFn.mock.results[0];
            const { body: { hits } } = await value;

            expect(err).toBeNull();
            expect(record).toEqual(hits);
            expect(mockSearchFn.mock.calls).toEqual([[
                {
                    index: 'fruits_index',
                    body: {
                        query: {
                            match: {
                                fruit_name: {
                                    query: 'Orange',
                                    operator: 'OR',
                                    max_expansions: 30,
                                    boost: 1
                                },
                            },
                        },
                    },
                },
            ]]);
        });
    });

    test('search with error empty body', () => {
        const client = newClient({
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        });

        const pipelineQ = pipeline(
            query.match('fruit_name', 'Apple'),
            query.withQuery(),
        );

        expect(client.client).toBeDefined();
        expect(client.createCredentials({
            protocol: 'http',
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        })).toEqual('http://admin:admin@localhost:9200');

        client.search('fruits_index', pipelineQ(), async (err, record) => {
            expect(err).not.toBeNull();
            expect(err.message).toEqual('ERR_NO_BODY');
            expect(record).not.toBeDefined();

            const { value } = mockSearchFn.mock.results[1];
            const { body } = await value;

            expect(body).toEqual({});
            expect(mockSearchFn.mock.lastCall).toEqual([
                {
                    index: 'fruits_index',
                    body: {
                        query: {
                            match: {
                                fruit_name: {
                                    query: 'Apple',
                                    operator: 'OR',
                                    max_expansions: 30,
                                    boost: 1
                                },
                            },
                        },
                    },
                },
            ]);
        });
    });

    test('search with error', () => {
        const client = newClient({
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        });

        const pipelineQ = pipeline(
            query.match('fruit_name', 'Apple'),
            query.withQuery(),
        );

        expect(client.client).toBeDefined();
        expect(client.createCredentials({
            protocol: 'http',
            host: 'localhost:9200',
            username: 'admin',
            password: 'admin',
        })).toEqual('http://admin:admin@localhost:9200');

        client.search('fruits_index', pipelineQ(), async (err, record) => {
            expect(err).not.toBeNull();
            expect(err.message).toEqual('error message');
            expect(record).not.toBeDefined();
            expect(mockSearchFn.mock.lastCall).toEqual([
                {
                    index: 'fruits_index',
                    body: {
                        query: {
                            match: {
                                fruit_name: {
                                    query: 'Apple',
                                    operator: 'OR',
                                    max_expansions: 30,
                                    boost: 1
                                },
                            },
                        },
                    },
                },
            ]);
        });
    });
});
