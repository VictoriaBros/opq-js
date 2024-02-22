#!/usr/bin/env node

const { pipeline, query } = require('../');

const pipelineQ = pipeline(
    query.match('customer_first_name', 'Sonya', {
        'prefix_length': 2,
    }),
    query.withShould(),
    query.withBool(),
    query.withQuery(),
    query.withPrettyPrint(),
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
                    "match": {
                        "customer_first_name": {
                            "query": "Sonya",
                            "operator": "OR",
                            "max_expansions": 30,
                            "boost": 1,
                            "prefix_length": 2
                        }
                    }
                }
            ]
        }
    }
}
*/
