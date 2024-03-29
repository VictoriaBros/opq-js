#!/usr/bin/env node

const { pipeline, query } = require('../');

const siblingsQ = pipeline(
    query.withSiblings([
        query.match('fruit_name', 'Orange'),
        query.withConstant('minimum_should_match', 1),
    ]),
    query.withMust(),
    query.withBool(),
    query.withFilter(),
    query.withPrettyPrint(),
);

siblingsQ();

/*
execute:
siblingsQ()


output:
{
    filter: {
        bool: {
            must: [
                {
                    minimum_should_match: 1,
                    match: {
                        fruit_name: {
                            query: 'Orange'
                        }
                    }
                }
            ]
        }
    }
}
*/

