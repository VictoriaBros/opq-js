#!/usr/bin/env node

const { pipeline, queryDSL } = require('../');

const pipelineQ = pipeline(
    queryDSL.textQuery.multiMatch('Sonya', {
        'queryFields': ['customer_first_name']
    }),
    queryDSL.compoundQuery.withShould(),
    queryDSL.withBool(),
    queryDSL.contextQuery.withQuery(),
    queryDSL.withPrettyPrint(),
);

pipelineQ();

/*
execute:
pipelineQ()

output:
{
    "query": {
        "bool": {
            "should": [
                {
                    "multi_match": {
                        "query": "Sonya",
                        "operator": "OR",
                        "fields": [
                            "customer_first_name"
                        ],
                        "type": "best_fields",
                        "tie_breaker": 0,
                        "max_expansions": 30,
                        "boost": 1
                    }
                }
            ]
        }
    }
}
*/
