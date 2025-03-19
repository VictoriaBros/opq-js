// Boolean query: https://opensearch.org/docs/latest/query-dsl/compound/bool/
const withBool = () => {
    return (baseQuery) => ({
        'bool': baseQuery,
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
            const qq = q();

            if (qq) {
                query.push(q());
            }
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

// Script score query: https://opensearch.org/docs/latest/query-dsl/specialized/script-score/
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
    withBool,
    withSource,
    withConstant,
    withArray,
    withSiblings,
    withPrettyPrint,
    withScriptScore
};
