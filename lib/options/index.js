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

module.exports = {
    options: {
        withPaginate,
        withHighlight,
        withSort
    }
};
