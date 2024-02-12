#!/usr/bin/env node

const { pipeline, query, newClient } = require('../');

const queryString = (text) => {
    return () => ({
        'query_string': {
            'query': text
        }
    });
};

const pipelineQ = pipeline(
    queryString('the wind AND (rises OR rising)'),
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
        "query_string": {
            "query": "the wind AND (rises OR rising)"
        }
    }
}

*/
