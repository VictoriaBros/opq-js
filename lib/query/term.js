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


// Range query: https://opensearch.org/docs/latest/query-dsl/term/range/
const range = (sourceField, options = {}) => {
    const {
        boost = 1,
        ...additionalOptions
    } = options;

    return () => ({
        'range': {
            [sourceField]: {
                'boost': boost,
                ...additionalOptions
            },
        },
    });
};

// Exists query: https://opensearch.org/docs/latest/query-dsl/term/exists/
const exists = (options = {}) => {
    const {
        name = '',
        ...additionalOptions
    } = options;

    return () => ({
        'exists': {
            'field': name,
            ...additionalOptions
        },
    });
};

module.exports = {
    term,
    terms,
    range,
    exists
};
