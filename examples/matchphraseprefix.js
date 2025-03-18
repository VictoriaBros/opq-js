#!/usr/bin/env node

const { pipeline, queryDSL } = require('../');

const pipelineQ = pipeline(
    queryDSL.textQuery.matchPhrasePrefix('customer_first_name', 'Sonya'),
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
                    "match_phrase_prefix": {
                        "customer_first_name": {
                            "query": "Sonya",
                            "slop": 3,
                            "max_expansions": 30
                        }
                    }
                }
            ]
        }
    }
}
*/
