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

module.exports = {
    withQuery,
    withFilter
};
