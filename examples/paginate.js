#!/usr/bin/env node

const { pipeline, query } = require('../');

const paginateQ = pipeline(
    query.match('play_name', 'Hamlet'),
    query.withPaginate(0, 3),
    query.withSort([
        {
            'speech_number': 'asc'
        },
        {
            '_id': 'asc'
        }
    ]),
    query.withQuery(),
    query.withPrettyPrint(),
);

paginateQ();

/*
execute:
paginateQ()


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
