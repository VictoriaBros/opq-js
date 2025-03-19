// https://opensearch.org/docs/latest/query-dsl/query-filter-context/
const {
    withQuery,
    withFilter
} = require('./context');

// https://opensearch.org/docs/latest/query-dsl/full-text/index/
const {
    match,
    matchBoolPrefix,
    matchPhrase,
    matchPhrasePrefix,
    multiMatch,
    queryString
} = require('./text');

// https://opensearch.org/docs/latest/query-dsl/term/index/
const {
    term,
    terms,
    range,
    exists
} = require('./term');

// https://opensearch.org/docs/latest/query-dsl/compound/bool/
const {
    withMust,
    withMustNot,
    withShould
} = require('./compound');

const {
    withBool,
    withSource,
    withConstant,
    withArray,
    withSiblings,
    withPrettyPrint,
    withScriptScore
} = require('./generic');

// Match all query: https://opensearch.org/docs/latest/query-dsl/match-all/
const matchAll = () => {
    return () => ({
        'match_all': {},
    });
};

// Match all query: https://opensearch.org/docs/latest/query-dsl/match-all/
const matchNone = () => {
    return () => ({
        'match_none': {},
    });
};


module.exports = {
    matchAll,
    matchNone,

    // full-text queries
    textQuery: {
        match,
        multiMatch,
        matchPhrase,
        matchPhrasePrefix,
        matchBoolPrefix,
        queryString
    },

    match,
    multimatch: multiMatch,
    matchPhrasePrefix,
    matchPrefix: matchPhrasePrefix,
    matchBool: matchBoolPrefix,

    // term-level queries
    termQuery: {
        term,
        terms,
        range,
        exists
    },

    term,
    terms,
    range,
    exists,

    // compound queries
    compoundQuery: {
        withMust,
        withMustNot,
        withShould
    },

    withMust,
    withMustNot,
    withShould,

    // query context
    contextQuery: {
        withQuery,
        withFilter
    },
    withQuery,
    withFilter,

    withBool,
    withSource,
    withConstant,
    withArray,
    withSiblings,
    withPrettyPrint,
    withScriptScore
};
