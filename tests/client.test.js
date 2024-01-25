const { createCredentials } = require('../');

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
});
