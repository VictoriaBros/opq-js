#!/usr/bin/env node

const { pipeline, query, newClient } = require('../');

const opqClient = newClient({
    host: 'localhost:9200',
    username: 'admin',
    password: 'admin',

    // optional
    enableLongNumeralSupport: true,
    memoryCircuitBreakerEnabled: true,
    memoryCircuitBreakerMaxPercent: 0.8,
});

const pipelineQ = pipeline(
    query.match('fruit_name', 'Orange'),
    query.withQuery(),
    query.withPrettyPrint(),
);

opqClient.search('fruits_index', pipelineQ(), (err, record) => {
    if (err) {
        // handle OpenSearch or ERR_NO_BODY err
    }

    const { hits } = record;
    console.log(hits);

    /*
        "hits" : [
            {
                "_index" : "fruits_index",
                "_id" : "32437",
                "_score" : 18.781435,
                "_source" : {
                  "family" : "Rutaceae",
                  "fruit_name" : "Orange",
                  "summary" : "...",
                  "color" : "#FFA500",
                }
            },
        ...
    */
});
