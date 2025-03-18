#!/usr/bin/env node

const { pipeline, queryDSL } = require('../');

const pipelineQ = pipeline(
    queryDSL.textQuery.matchBoolPrefix('customer_first_name', 'Sonya'),
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
                    "match_bool_prefix": {
                        "customer_first_name": {
                            "query": "Sonya",
                            "operator": "OR",
                            "max_expansions": 30,
                            "boost": 1
                        }
                    }
                }
            ]
        }
    }
}
*/
