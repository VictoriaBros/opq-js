## Client

Connection to OpenSearch can be initiated using `newClient`. It requires at minimum `host`, `username` and `password` but you can provide additional configuration to fine-tune the performance such as circuit breaking.

See example: [client.js](../examples/client.js)

```js
const { newClient } = require('@victoriabros/opq');
const client = newClient({
    // required
    host: 'localhost:9200',
    username: 'admin',
    password: 'admin',

    // optional
    enableLongNumeralSupport: true,
    memoryCircuitBreakerEnabled: true,
    memoryCircuitBreakerMaxPercent: 0.8,
});
```

You can validate configuration credentials using `createCredentials`.

```js
const { createCredentials } = require('@victoriabros/opq');

console.log(createCredentials({
    // required
    host: 'localhost:9200',
    username: 'admin',
    password: 'admin',

    // optional
    protocol: 'http' // defaults to https
}));
```
