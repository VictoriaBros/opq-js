#!/usr/bin/env node

const { pipeline, query } = require('../');

const arrayQ = pipeline(
    query.withSiblings([
        pipeline(
            query.withArray([
                query.term('country', 'Nigeria'),
                query.terms('state', [
                    'Lagos',
                    'Abuja',
                ]),
            ]),
            query.withFilter(),
        ),
        pipeline(
            query.match('role', 'Software'),
            query.withMustNot(),
        ),
    ]),
    query.withBool(),
    query.withQuery(),
    query.withSource(['username', 'email', 'role']),
    query.withPrettyPrint(),
);

arrayQ();

/*
execute:
arrayQ()


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
            ],
            "filter": [
                {
                    "term": {
                        "country": "Nigeria"
                    }
                },
                {
                    "terms": {
                        "state": [
                            "Lagos",
                            "Abuja"
                        ]
                    }
                }
            ]
        }
    },
    "_source": [
        "username",
        "email",
        "role",
    ]
}
*/

