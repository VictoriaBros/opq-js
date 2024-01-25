# opq

Node.js client library for constructing OpenSearch query.

- [opq](#opq)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Query](#query)
    - [matchPrefix](#match-prefix)
    - [match](#match)
    - [multimatch](#multimatch)
    - [term](#term)
    - [terms](#terms)
    - [withShould](#with-should)
    - [withMust](#with-must)
    - [withMustNot](#with-must-not)
    - [withBool](#with-bool)
    - [withQuery](#with-query)
    - [withSiblings](#with-siblings)
    - [withFilter](#with-filter)
    - [withPaginate](#with-paginate)
    - [withHighlight](#with-highlight)
    - [withSort](#with-sort)
    - [withSource](#with-source)
    - [withConstant](#with-constant)
    - [withArray](#with-array)
    - [withPrettyPrint](#with-prettyprint)
  - [Pipeline](#pipeline)
  - [Client](#client)


## Installation

```sh
npm insall @victoriabros/opq
```

## Quick Start

Constructing queries for OpenSearch index has never been this easy. opq provides queries that can be used to construct simple and complex JSON query for OpenSearch.

See example: [match.js](./examples/match.js)

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

See example: [paginate.js](./examples/paginate.js)

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

More snippets can be found in the [examples directory](./examples)
## Query

### matchPrefix
### match
### multimatch

## Pipeline
## Client
