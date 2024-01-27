# opq

Node.js client library for constructing OpenSearch query.

- [opq](#opq)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Query](#query)
    - [matchPrefix](#match-prefix)
    - [matchBool](#match-bool)
    - [match](#match)
    - [multimatch](#multimatch)
    - [matchAll](#match-all)
    - [term](#term)
    - [terms](#terms)
    - [withShould](#with-should)
    - [withMust](#with-must)
    - [withMustNot](#with-must-not)
    - [withBool](#with-bool)
    - [withQuery](#with-query)
    - [withFilter](#with-filter)
    - [withPaginate](#with-paginate)
    - [withHighlight](#with-highlight)
    - [withSort](#with-sort)
    - [withSource](#with-source)
    - [withConstant](#with-constant)
    - [withArray](#with-array)
    - [withSiblings](#with-siblings)
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

Opq exports `query.*` which has several functions that can be used within `pipeline`.

```js
const { query } = require('@victoriabros/opq');
```

### matchPrefix

### matchBool

### match

See example: [match.js](./examples/match.js)

### multimatch

### matchAll

### term

See example: [array.js#L9](./examples/array.js#L9)

### terms

See example: [array.js#L10](./examples/array.js#L10)

### withShould

See example: [match.js#L9](./examples/match.js#L9)

### withMust

See example: [siblings.js#L10](./examples/siblings.js#L10)

### withMustNot

See example: [array.js#L19](./examples/array.js#L19)

### withBool

See example: [siblings.js#L11](./examples/siblings.js#L11)

### withQuery

See example: [array.js#L23](./examples/array.js#L23)

### withFilter

See example: [filter.js](./examples/filter.js)

### withPaginate

See example: [paginate.js](./examples/paginate.js)

### withHighlight

See example: [highlight.js](./examples/highlight.js)

### withSort

See example: [paginate.js#L8](./examples/paginate.js#L8)

### withSource

See example: [array.js#L24](./examples/array.js#L24)

### withConstant

See example: [siblings.js#L8](./examples/siblings.js#L8)

### withArray

See example: [array.js](./examples/array.js)

### withSiblings

See example: [siblings.js](./examples/siblings.js)

### withPrettyPrint

See example: [paginate.js#L13](./examples/paginate.js#L13)

## Pipeline
## Client
