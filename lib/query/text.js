// Match query: https://opensearch.org/docs/latest/query-dsl/full-text/match/
const match = (sourceField, text, options = {}) => {
    const {
        operator = 'OR',
        maxExpansions = 30,
        boost = 1,
        ...additionalOptions
    } = options;

    return () => ({
        'match': {
            [sourceField]: {
                'query': text,
                'operator': operator,
                'max_expansions': maxExpansions,
                'boost': boost,
                ...additionalOptions,
            }
        },
    });
};

// Match Boolean prefix query: https://opensearch.org/docs/latest/query-dsl/full-text/match-bool-prefix/
const matchBoolPrefix = (sourceField, text, options = {}) => {
    const {
        operator = 'OR',
        maxExpansions = 30,
        boost = 1,
        ...additionalOptions
    } = options;

    return () => ({
        'match_bool_prefix': {
            [sourceField]: {
                'query': text,
                'operator': operator,
                'max_expansions': maxExpansions,
                'boost': boost,
                ...additionalOptions,
            }
        },
    });
};


// Match phrase prefix query: https://opensearch.org/docs/latest/query-dsl/full-text/match-phrase-prefix/
const matchPhrasePrefix = (sourceField, text, options = {}) => {
    const {
        slop = 3,
        maxExpansions = 30,
        ...additionalOptions
    } = options;

    return () => ({
        'match_phrase_prefix': {
            [sourceField]: {
                'query': text,
                'slop': slop,
                'max_expansions': maxExpansions,
                ...additionalOptions,
            }
        }
    });
};

// Multi-match queries: https://opensearch.org/docs/latest/query-dsl/full-text/multi-match/
const multiMatch = (text, options = {}) => {
    const {
        queryFields = '*',
        type = 'best_fields',
        tieBreaker = 0.0,
        operator = 'OR',
        maxExpansions = 30,
        boost = 1,
        ...additionalOptions
    } = options;

    return () => ({
        'multi_match': {
            'query': text,
            'operator': operator,
            'fields': queryFields,
            'type': type,
            'tie_breaker': tieBreaker,
            'max_expansions': maxExpansions,
            'boost': boost,
            ...additionalOptions,
        },
    });
};

// Query string query: https://opensearch.org/docs/latest/query-dsl/full-text/query-string/
const queryString = (query, options = {}) => {
    const {
        queryFields = ['*'],
        operator = 'OR',
        boost = 1,
        ...additionalOptions
    } = options;

    return () => ({
        'query_string': {
            'query': query,
            'fields': queryFields,
            'default_operator': operator,
            'boost': boost,
            ...additionalOptions,
        },
    });
};

// Match phrase query: https://opensearch.org/docs/latest/query-dsl/full-text/match-phrase/
const matchPhrase = (sourceField, text, options = {}) => {
    const {
        slop = 3,
        ...additionalOptions
    } = options;

    return () => ({
        'match_phrase': {
            [sourceField]: {
                'query': text,
                'slop': slop,
                ...additionalOptions,
            }
        }
    });
};

module.exports = {
    match,
    matchBoolPrefix,
    matchPhrasePrefix,
    multiMatch,
    queryString,
    matchPhrase
};
