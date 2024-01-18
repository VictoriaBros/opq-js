#!/usr/bin/env node

const { pipeline, query } = require('../');

const pipelineQ = pipeline(
    query.match('customer_first_name', 'Sonya', {
        'prefix_length': 2,
    }),
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
        match: {
            customer_first_name: {
                query: 'Sonya'
            }
        }
    }
}
*/
