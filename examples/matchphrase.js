#!/usr/bin/env node

const { pipeline, queryDSL } = require('../');

const pipelineQ = pipeline(
    queryDSL.textQuery.matchPhrase('customer_first_name', 'Sonya'),
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
                    "match_phrase": {
                        "customer_first_name": {
                            "query": "Sonya",
                            "slop": 3
                        }
                    }
                }
            ]
        }
    }
}
*/
