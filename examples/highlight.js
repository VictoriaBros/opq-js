#!/usr/bin/env node

const { pipeline, query } = require('../');

const highlightQ = pipeline(
    query.match('role', 'Software'),
    query.withMust(),
    query.withBool(),
    query.withQuery(),
    query.withHighlight([
        { 'email': {} },
        { 'username': {} }
    ], {
        'pre_tags': ['<em>'],
        'post_tags': ['</em>']
    }),
    query.withPrettyPrint(),
);

highlightQ();

/*
execute:
highlightQ()


output:
{
    "query": {
        "bool": {
            "must": [
                {
                    "match": {
                        "role": {
                            "query": "Software",
                            "operator": "OR",
                            "max_expansions": 30,
                            "boost": 1
                        }
                    }
                }
            ]
        }
    },
    "highlight": {
        "pre_tags": [
            "<em>"
        ],
        "post_tags": [
            "</em>"
        ],
        "fields": [
            {
                "email": {}
            },
            {
                "username": {}
            }
        ]
    }
}
*/
