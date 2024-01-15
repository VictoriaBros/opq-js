#!/usr/bin/env node

const { pipeline, query } = require('../');

const pipelineQ = pipeline(
    query.match('fruit', 'orange'),
    query.withMust(),
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
    query: {
        bool: {
            must: [
                {
                    match: {
                        fruit: {
                            query: 'orange'
                        }
                    }
                }
            ]
        }
    }
}
*/
