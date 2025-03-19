## Quick Start

Constructing queries for OpenSearch index has never been this simplified. opq provides queries that can be used to construct simple, complex and custom JSON queries for OpenSearch.

See example: [match.js](../examples/match.js)

```js
const { pipeline, query } = require('@victoriabros/opq');
const pipelineQ = pipeline(
    query.match('customer_first_name', 'Sonya'),
    query.withQuery(),
);

console.log(pipelineQ());
```

```sh
$ node match.js
{ query: { match: { customer_first_name: [Object] } } }
```

Here's a more complete query based on [Paginate results documentation](https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/#the-search_after-parameter) from OpenSeach using several query from opq and pretty printing the output.

See example: [paginate.js](../examples/paginate.js)

```js
const { pipeline, query } = require('@victoriabros/opq');
const paginateQ = pipeline(
    query.match('play_name', 'Hamlet'),
    query.withPaginate(0, 3),
    query.withSort([
        {
            'speech_number': 'asc'
        },
        {
            '_id': 'asc'
        }
    ]),
    query.withQuery(),
    query.withPrettyPrint(),
);

paginateQ();

```

```sh
$ node paginate.js

{
    "query": {
        "match": {
            "play_name": {
                "query": "Hamlet"
            }
        },
        "from": 0,
        "size": 3,
        "sort": [
            {
                "speech_number": "asc"
            },
            {
                "_id": "asc"
            }
        ]
    }
}
```

More snippets can be found in the [examples directory](../examples)
