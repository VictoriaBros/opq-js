#!/usr/bin/env node

const { pipeline, query } = require('../');

const filterQ = pipeline(
    query.match('fruit', 'orange'),
    query.withMust(),
    query.withBool(),
    query.withFilter(),
    query.withPrettyPrint(),
);

filterQ();

/*
execute:
filterQ()


output:
{
    filter: {
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

