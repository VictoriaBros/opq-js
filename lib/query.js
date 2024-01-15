const matchPrefix = (fields, sourceField, text) => {
    return () => ({
        'match_phrase_prefix': {
            [sourceField]: {
                'query': text,
                'slop': 3
            }
        }
    });
};

const match = (sourceField, text) => {
    return () => ({
        'match': {
            [sourceField]: {
                'query': text,
            }
        },
    });
};

const multimatch = (queryFields, text, type, tieBreaker) => {
    return () => ({
        'multi_match': {
            'query': text,
            'fields': queryFields,
            'type': type,
            'tie_breaker': tieBreaker,
        },
    });
};

const term = (key, term) => {
    return () => ({
        'term': {
            [key]: term
        }
    });
};

const terms = (key, terms) => {
    return () => ({
        'terms': {
            [key]: terms
        },
    });
};

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

const withBool = () => {
    return (baseQuery) => ({
        'bool': baseQuery,
    });
};

const withQuery = () => {
    return (baseQuery) => ({
        'query': baseQuery,
    });
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

const withPaginate = (offset, limit) => {
    return (baseQuery) => ({
        ...baseQuery,
        'from': offset,
        'size': limit,
    });
};

const withHighlight = (highlightFields, tags = []) => {
    return (baseQuery) => ({
        ...baseQuery,
        'highlight': {
            'pre_tags': ['<strong>'],
            'post_tags': ['</strong>'],
            'fields': highlightFields,
        },
    });
};

const withSort = (sortAttributes = []) => {
    return (baseQuery) => ({
        ...baseQuery,
        'sort': sortAttributes,
    });
};

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

const withPrettyPrint = (replacer = null, space = 4) => {
    return (baseQuery) => {
        console.log(JSON.stringify(
            baseQuery,
            replacer,
            space
        ));

        return baseQuery;
    };
};

module.exports = {
    matchPrefix,
    match,
    multimatch,
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
};
