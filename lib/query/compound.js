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

module.exports = {
    withMust,
    withMustNot,
    withShould
};
