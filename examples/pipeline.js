#!/usr/bin/env node

const { pipeline, query } = require('../');

const pipelineQ = pipeline(
    query.match('fruit', 'orange'),
    query.withMust(),
    query.withBool(),
);

/*
execute:
pipelineQ()


output:
{
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
*/

console.log(pipelineQ());
