## Pipeline

You can execute custom queries in addition to the built-in queries using `pipeline`.

See example: [custom.js](../examples/custom.js)

```js
const { pipeline } = require('@victoriabros/opq');

const customFunction = (text) => {
    return (baseQuery) => ({
        ...baseQuery,
        'custom_attribute': text
    });
};

const pipelineQ = pipeline(
    query.match('fruit_name', 'Orange'),
    query.withQuery(),
    customFunction('custom_value'),
    query.withPrettyPrint(),
);

pipelineQ();
```

```sh
$ node sample-custom.js

{
    "query": {
        "match": {
            "fruit_name": {
                "query": "Orange",
                "operator": "OR",
                "max_expansions": 30,
                "boost": 1
            }
        }
    },
    "custom_attribute": "custom_value"
}
```
