## Query

Opq exports `query.*` which has several functions that can be used within `pipeline`.

```js
const { query } = require('@victoriabros/opq');
```

### matchAll

This allows including the `match_all` field that queries the entire index.

### matchNone

This allows including the `match_none` field that returns no record from the index.


### Text Query

#### match

This allows including the `match` field to perform full-text search.

See example: [match.js](../examples/match.js)

#### multiMatch

This allows including the `multimatch` field to search multiple fields in the index. By default, `fields` will be `*` which searches the fields specified in the index query.

See example: [multimatch.js](../examples/multimatch.js)

#### matchPhrase

This allows including the `match_phrase` field which searches for documents matching the exact phrase in a specified order.

See example: [matchprefix.js](../examples/matchphrase.js)

#### matchPhrasePrefix

This allows including the `match_phrase_prefix` field which searches for documents matching the provided phrase.

See example: [matchprefix.js](../examples/matchphraseprefix.js)

#### matchBoolPrefix

This allows including the `match_bool_prefix` field which analyzes the provided search string and creates a Boolean query.

See example: [matchbool.js](../examples/matchboolprefix.js)

#### queryString

This allows including the `query_string` field which searches for documents based on the query string syntax. It provides for creating powerful yet concise queries that can incorporate wildcards and search multiple fields.

See example: [matchbool.js](../examples/querystring.js)


### Term Query

### term

This allows including the `term` field.

See example: [array.js#L9](../examples/array.js#L9)

### terms

This allows including the `terms` field.

See example: [array.js#L10](../examples/array.js#L10)

### range

This allows to search for a range of given values in a field.

```js
const { query } = require('@victoriabros/opq');

const withRange = query.range('created_at', {
    'gte': '2023-04-01',
    'lte': '2024-04-08'
});
```

### exists

checks if a field with a name exists.

```js
const { query } = require('@victoriabros/opq');

const withExists = query.exists({
    'name': 'created_at',
});
```


### Compound Query

### withMust

This allows include the `must` field which is equivalent to logical `and` operator.

See example: [siblings.js#L10](../examples/siblings.js#L10)

### withMustNot

This allows include the `must_not` field which is equivalent to logical `not` operator.

See example: [array.js#L19](../examples/array.js#L19)

### withShould

This allows include the `should` field which is equivalent to logical `or` operator.

See example: [match.js#L9](../examples/match.js#L9)


### Context Query

### withQuery

This allows including the `query` field.

See example: [array.js#L23](../examples/array.js#L23)

### withFilter

This allows including the `filter` field.

See example: [filter.js](../examples/filter.js)


### withBool

This allows including the `bool` field that can be combined with `withMustNot`, `withMust`, `withShould` and `withFilter`.

See example: [siblings.js#L11](../examples/siblings.js#L11)

### withSource

This allows including the `_source` field.

See example: [array.js#L24](../examples/array.js#L24)

### withConstant

This allows providing constant value with custom key.

See example: [siblings.js#L8](../examples/siblings.js#L8)

### withArray

This allows placing sub-queries within an array.

See example: [array.js](../examples/array.js)

### withSiblings

This allows placing adjacent queries or sub-queries.

See example: [siblings.js](../examples/siblings.js)

### withPrettyPrint

By default, prettyprint outputs composed query to console. You may change the default logger.

See example: [paginate.js#L17](../examples/paginate.js#L17)

```js
const { query } = require('@victoriabros/opq');
const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'warn' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

query.withPrettyPrint({}, logger.info);
```

### withScriptScore

This allows including the `script_score` to change the scoring function of queried documents.

```js
const { query } = require('@victoriabros/opq');

query.withScriptScore(
    query.match('author', 'Dave')(),
    {
        source: `
            _score * doc[params.field].value
        `,
        params: {
            'field': 'multiplier'
        }
    }
);

```

```sh
{
    'script_score': {
        'query': {
            'match': {
                'author': {
                    'query': 'Dave',
                    . . .
                }
            }
        },
        'script': {
            lang: 'painless',
            source: '\n         _score * doc[params.field].value\n         ',
            params: { 'field': 'multiplier' }
        }
    }
}
```


## Options

### withPaginate

This allows including the `from` and `size` fields. The `from` field is computed based on `offset` and `limit` provided.

See example: [paginate.js](../examples/paginate.js)

### withHighlight

This allows including the `highlight` field with option to replace the `preTags`, `postTags` and [additional highlighting options](https://opensearch.org/docs/latest/search-plugins/searching-data/highlight/#highlighting-options).

See example: [highlight.js](../examples/highlight.js)

```js
const { query } = require('@victoriabros/opq');

query.withHighlight([
    { 'email': {} },
    { 'username': {} }
], {
    'pre_tags': ['<em>'],
    'post_tags': ['</em>'],
    'order': 'score',
    'number_of_fragments': 0,
});
```

### withSort

This allows including the `sort` field with option to add [flexible attributes](https://opensearch.org/docs/latest/search-plugins/searching-data/sort/).

See example: [paginate.js#L8](../examples/paginate.js#L8)
