#!/usr/bin/env node

const { pipeline, queryDSL } = require('../');

const pipelineQ = pipeline(
    queryDSL.textQuery.queryString('customer_first_name: "Sonya"'),
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
                    "query_string": {
                        'query': 'customer_first_name: "Sonya"',
                        'fields': ['*'],
                        'default_operator': 'OR',
                        'boost': 1,
                    }
                }
            ]
        }
    }
}
*/
