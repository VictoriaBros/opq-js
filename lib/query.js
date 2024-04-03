// Match phrase prefix query: https://opensearch.org/docs/latest/query-dsl/full-text/match-phrase-prefix/
const matchPrefix = (sourceField, text, options = {}) => {
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

// Match Boolean prefix query: https://opensearch.org/docs/latest/query-dsl/full-text/match-bool-prefix/
const matchBool = (sourceField, text, options = {}) => {
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

// Multi-match queries: https://opensearch.org/docs/latest/query-dsl/full-text/multi-match/
const multimatch = (text, options = {}) => {
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

// Match all query: https://opensearch.org/docs/latest/query-dsl/match-all/
const matchAll = () => {
    return () => ({
        'match_all': {},
    });
};

// Term query: https://opensearch.org/docs/latest/query-dsl/term/term/
const term = (key, term) => {
    return () => ({
        'term': {
            [key]: term
        }
    });
};

// Terms query: https://opensearch.org/docs/latest/query-dsl/term/terms/
const terms = (key, terms) => {
    return () => ({
        'terms': {
            [key]: terms
        },
    });
};

// Boolean query: https://opensearch.org/docs/latest/query-dsl/compound/bool/
const withShould = () => {
    return (baseQuery) => {
        if (typeof baseQuery == 'object' && baseQuery.length >= 0) {
            return {
                'should': baseQuery,
            };
        }

        if (baseQuery) {
            return {
                'should': [baseQuery],
            };
        }

        return {
            'should': [],
        };
    };
};

// Boolean query: https://opensearch.org/docs/latest/query-dsl/compound/bool/
const withMust = () => {
    return (baseQuery) => {
        if (baseQuery) {
            if (typeof baseQuery == 'object' && baseQuery.length >= 0) {
                return {
                    'must': baseQuery,
                };
            }

            return {
                'must': [baseQuery],
            };
        }

        return {
            'must': [],
        };
    };
};

// Boolean query: https://opensearch.org/docs/latest/query-dsl/compound/bool/
const withMustNot = () => {
    return (baseQuery) => {
        if (baseQuery) {
            if (typeof baseQuery == 'object' && baseQuery.length >= 0) {
                return {
                    'must_not': baseQuery,
                };
            }

            return {
                'must_not': [baseQuery],
            };
        }

        return {
            'must_not': [],
        };
    };
};

// Boolean query: https://opensearch.org/docs/latest/query-dsl/compound/bool/
const withBool = () => {
    return (baseQuery) => ({
        'bool': baseQuery,
    });
};

// Query context: https://opensearch.org/docs/latest/query-dsl/query-filter-context/#query-context
const withQuery = () => {
    return (baseQuery) => ({
        'query': baseQuery,
    });
};

// Filter context: https://opensearch.org/docs/latest/query-dsl/query-filter-context/#filter-context
const withFilter = () => {
    return (baseQuery) => {
        if (baseQuery) {
            if (typeof baseQuery == 'object') {
                return {
                    'filter': baseQuery,
                };
            }

            return {
                'filter': [baseQuery]
            };
        }

        return {
            'filter': []
        };
    };
};

// Paginate results: https://opensearch.org/docs/latest/search-plugins/searching-data/paginate/
// offset starts from 0 in OpenSearch subtract 1
const withPaginate = (offset, limit) => {
    const from = offset <= 0
        ? 0
        : ((offset - 1) * limit);

    return (baseQuery) => ({
        ...baseQuery,
        'from': from,
        'size': limit,
    });
};

// Highlight query matches: https://opensearch.org/docs/latest/search-plugins/searching-data/highlight/#highlighting-options
const withHighlight = (highlightFields, options = {}) => {
    const {
        preTags = ['<strong>'],
        postTags = ['</strong>'],
        ...additionalOptions
    } = options;

    return (baseQuery) => ({
        ...baseQuery,
        'highlight': {
            'pre_tags': preTags,
            'post_tags': postTags,
            'fields': highlightFields,
            ...additionalOptions,
        },
    });
};

// Sort results: https://opensearch.org/docs/latest/search-plugins/searching-data/sort/
const withSort = (sortAttributes = []) => {
    return (baseQuery) => ({
        ...baseQuery,
        'sort': sortAttributes,
    });
};

// _source include field in the response body
const withSource = (fields) => {
    return (baseQuery) => ({
        ...baseQuery,
        '_source': fields,
    });
};

const withConstant = (key, value) => {
    return () => ({
        [key]: value,
    });
};

const withArray = (arrayQuery) => {
    return () => {
        let query = [];

        for (const q of arrayQuery) {
            query.push(q());
        }

        return query;
    };
};

const withSiblings = (siblingsQuery) => {
    return (baseQuery) => {
        let query = {};

        for (const q of siblingsQuery) {
            if (baseQuery) {
                query = {
                    ...q(baseQuery),
                    ...query,
                };
                continue;
            }

            query = { ...q(), ...query };
        }

        return query;
    };
};

const withPrettyPrint = (
    options = {
        replacer: null,
        space: 4
    },
    logger = console.log,
) => {
    return (baseQuery) => {
        logger(JSON.stringify(
            baseQuery,
            options.replacer,
            options.space
        ));

        return baseQuery;
    };
};

const withScriptScore = (query = {}, options = {}) => {
    const {
        lang = 'painless',
        source = '',
        params = {},
        ...additionalOptions
    } = options;

    return (baseQuery) => ({
        ...baseQuery,
        'script_score': {
            'query': query,
            'script': {
                'lang': lang,
                'source': source,
                'params': params,
            },
            ...additionalOptions,
        },
    });
};

module.exports = {
    matchPrefix,
    matchBool,
    match,
    multimatch,
    matchAll,
    term,
    terms,
    withSiblings,
    withShould,
    withMust,
    withMustNot,
    withBool,
    withQuery,
    withFilter,
    withPaginate,
    withHighlight,
    withSort,
    withSource,
    withConstant,
    withArray,
    withPrettyPrint,
    withScriptScore,
};
