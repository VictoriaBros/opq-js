const { pipeline, query, queryDSL, options } = require('../');


describe('.query', () => {
    test.concurrent('.matchPrefix', () => {
        const prefixResult = query.matchPrefix('fruits', 'Apple');
        expect(prefixResult()).toEqual(
            {
                'match_phrase_prefix': {
                    'fruits': {
                        'query': 'Apple',
                        'slop': 3,
                        'max_expansions': 30
                    }
                }
            }
        );
    });

    test.concurrent('.matchBool', () => {
        const matchBoolResult = query.matchBool('fruits', 'Apple');
        expect(matchBoolResult()).toEqual(
            {
                'match_bool_prefix': {
                    'fruits': {
                        'query': 'Apple',
                        'operator': 'OR',
                        'max_expansions': 30,
                        'boost': 1
                    }
                }
            }
        );
    });

    test.concurrent('.match', () => {
        const matchResult = query.match('first_name', 'Jayjay');
        expect(matchResult()).toEqual(
            {
                'match': {
                    'first_name': {
                        'query': 'Jayjay',
                        'operator': 'OR',
                        'max_expansions': 30,
                        'boost': 1,
                    }
                }
            }
        );
    });

    test.concurrent('.multimatch with all/some fields', () => {
        const multiResult = query.multimatch('Jay');
        expect(multiResult()).toEqual(
            {
                'multi_match': {
                    'query': 'Jay',
                    'operator': 'OR',
                    'fields': '*',
                    'type': 'best_fields',
                    'tie_breaker': 0.0,
                    'max_expansions': 30,
                    'boost': 1
                }
            }
        );

        const multiResultA = query.multimatch('Jay', {
            'queryFields': ['full_name', 'last_name']
        });

        expect(multiResultA()).toEqual(
            {
                'multi_match': {
                    'query': 'Jay',
                    'operator': 'OR',
                    'fields': ['full_name', 'last_name'],
                    'type': 'best_fields',
                    'tie_breaker': 0.0,
                    'max_expansions': 30,
                    'boost': 1
                }
            }
        );
    });

    test.concurrent('.matchAll', () => {
        const matchAllResult = query.matchAll();
        expect(matchAllResult()).toEqual({'match_all': {}});
    });

    test.concurrent('.term', () => {
        const termResult = query.term('book_id', '22919');
        expect(termResult()).toEqual(
            {
                'term': {
                    'book_id': '22919'
                }
            }
        );
    });

    test.concurrent('.terms', () => {
        const termsResult = query.terms('books_id', ['22919', '54321']);
        expect(termsResult()).toEqual(
            {
                'terms': {
                    'books_id': ['22919', '54321']
                }
            }
        );
    });

    test.concurrent('.withShould, as: empty, object, empty object', () => {
        // default
        const withShouldResultA = query.withShould();
        expect(withShouldResultA()).toEqual(
            {
                'should': []
            }
        );

        const withShouldResultB = query.withShould();
        expect(withShouldResultB([query.term('book_id', '22919')()])).toEqual(
            {
                'should': [{
                    'term': {
                        'book_id': '22919'
                    }
                }]
            }
        );

        const withShouldResultC = query.withShould();
        expect(withShouldResultC({})).toEqual(
            {
                'should': [{}]
            }
        );
    });

    test.concurrent('.withMust,  as: empty, object, empty object', () => {
        // default
        const withMustResultA = query.withMust();
        expect(withMustResultA()).toEqual(
            {
                'must': []
            }
        );

        const withMustResultB = query.withMust();
        expect(withMustResultB([query.term('book_id', '54321')()])).toEqual(
            {
                'must': [{
                    'term': {
                        'book_id': '54321'
                    }
                }]
            }
        );

        const withMustResultC = query.withMust();
        expect(withMustResultC({})).toEqual(
            {
                'must': [{}]
            }
        );
    });

    test.concurrent('.withMustNot as: empty, object, empty object', () => {
        // default
        const withMustNotResultA = query.withMustNot();
        expect(withMustNotResultA()).toEqual(
            {
                'must_not': []
            }
        );

        const withMustNotResultB = query.withMustNot();
        expect(withMustNotResultB([query.term('author_id', '2242')()])).toEqual(
            {
                'must_not': [{
                    'term': {
                        'author_id': '2242'
                    }
                }]
            }
        );

        const withMustResultC = query.withMustNot();
        expect(withMustResultC({})).toEqual(
            {
                'must_not': [{}]
            }
        );
    });

    test.concurrent('.withBool as: empty, withConstant arg', () => {
        const withBool = query.withBool();
        expect(withBool()).toEqual(
            {
                'bool': undefined
            }
        );

        const withBoolA = query.withBool();
        expect(withBoolA(query.withConstant('author', 'Dave')())).toEqual(
            {
                'bool': {'author': 'Dave'}
            }
        );
    });

    test.concurrent('.withQuery', () => {
        const withQuery = query.withQuery();
        expect(withQuery()).toEqual(
            {
                'query': undefined
            }
        );

        const withQueryA = query.withQuery();
        expect(withQueryA(query.withConstant('author', 'Dave')())).toEqual(
            {
                'query': {
                    'author': 'Dave'
                }
            }
        );
    });

    test.concurrent('.withSiblings', () => {
        // default
        const withSiblingsResultA = query.withSiblings([]);
        expect(withSiblingsResultA()).toEqual({});

        const withSiblingsResultB = query.withSiblings([
            query.match('car', 'mercedes'),
            query.withConstant('minimum_match', 10),
        ]);

        expect(withSiblingsResultB(query.term('book_id', '22919'))).toEqual(
            {
                'minimum_match': 10,
                'match': {
                    'car': {
                        'query': 'mercedes',
                        'boost': 1,
                        'max_expansions': 30,
                        'operator': 'OR',
                    }
                }
            }
        );

    });

    test.concurrent('.withFilter', () => {
        // default
        expect(query.withFilter()()).toEqual(
            {
                'filter': []
            }
        );

        // basequery as a match
        expect(query.withFilter()(query.match('fruit', 'Apple')())).toEqual(
            {
                'filter': {
                    'match': {
                        'fruit': {
                            'query': 'Apple',
                            'operator': 'OR',
                            'max_expansions': 30,
                            'boost': 1
                        }
                    }
                }
            }
        );

        expect(query.withFilter()([
            query.match('fruit', 'Apple')(), query.withConstant('first_name', 'Jay')()
        ])).toEqual(
            {
                'filter': [
                    {
                        'match': {
                            'fruit': {
                                'query': 'Apple',
                                'operator': 'OR',
                                'max_expansions': 30,
                                'boost': 1
                            }
                        }
                    },
                    {'first_name': 'Jay'}
                ]
            }
        );
    });

    test.concurrent('.withPaginate', () => {
        expect(pipeline(
            query.withPaginate(0, 3),
            query.withQuery(),
        )()).toEqual(
            {
                query: {
                    from: 0,
                    size: 3,
                },

            }
        );

        expect(pipeline(
            query.withPaginate(1, 3),
            query.withQuery(),
        )()).toEqual(
            {
                query: {
                    from: 0,
                    size: 3,
                },

            }
        );

        expect(pipeline(
            query.withPaginate(-1, 3),
            query.withQuery(),
        )()).toEqual(
            {
                query: {
                    from: 0,
                    size: 3,
                },

            }
        );
    });

    test.concurrent('.withHighlight', () => {
        // default
        expect(query.withHighlight()()).toEqual(
            {
                'highlight': {
                    'fields': undefined,
                    'post_tags': ['</strong>'], 'pre_tags': ['<strong>']
                }
            }
        );

        const withHighlightA = query.withHighlight(['first_name', 'last_name']);
        expect(withHighlightA()).toEqual(
            {
                'highlight': {
                    'fields': ['first_name', 'last_name'],
                    'post_tags': ['</strong>'], 'pre_tags': ['<strong>']
                }
            }
        );
    });

    test.concurrent('.withSort', () => {
        const withSort = query.withSort();

        expect(withSort()).toEqual({
            'sort': []
        });
    });

    test.concurrent('.withSource', () => {
        // default
        expect(query.withSource()()).toEqual(
            {
                '_source': undefined
            }
        );

        const withSource = query.withSource(['first_name', 'last_name']);
        expect(withSource()).toEqual(
            {
                '_source': ['first_name', 'last_name']
            }
        );
    });

    test.concurrent('.withConstant', () => {
        const withConstant = query.withConstant('author', 'shakespear');
        expect(withConstant()).toEqual(
            {
                'author': 'shakespear'
            }
        );
    });

    test.concurrent('.withArray', () => {
        const withArrayresult = query.withArray([
            query.withConstant('first_name', 'Dave'),
            query.term('country', 'Nigeria')
        ]);
        expect(withArrayresult()).toEqual(
            [
                { 'first_name': 'Dave' },
                {'term': { 'country': 'Nigeria'} }
            ]
        );
    });

    test.concurrent('.withPrettyPrint', () => {
        const mockFn = jest.fn();
        const withPrettyPrint = query.withPrettyPrint({}, mockFn);

        expect(withPrettyPrint(query.match('author', 'Dave')())).toEqual({
            'match': {
                'author': {
                    'query': 'Dave',
                    'boost': 1,
                    'max_expansions': 30,
                    'operator': 'OR'
                }
            }
        });
        expect(mockFn.mock.calls).toEqual([[JSON.stringify({
            'match': {
                'author': {
                    'query': 'Dave',
                    'operator': 'OR',
                    'max_expansions': 30,
                    'boost': 1,
                }
            }
        })]]);
    });

    test.concurrent('.withScriptScore', () => {
        const withScriptScore = query.withScriptScore(
            query.match('author', 'Dave')(),
            {
                source: `
                    _score * doc[params.field].value
                `,
                params: {
                    'field': 'multiplier'
                }
            }
        );

        expect(withScriptScore()).toEqual(
            {
                'script_score': {
                    'query': {
                        'match': {
                            'author': {
                                'query': 'Dave',
                                'boost': 1,
                                'max_expansions': 30,
                                'operator': 'OR'
                            }
                        }
                    },
                    'script': {
                        lang: 'painless',
                        source: '\n                    _score * doc[params.field].value\n                ',
                        params: { 'field': 'multiplier' }
                    }
                }
            }
        );
    });

    test.concurrent('.exists', () => {
        const withExists = query.exists({
            'name': 'created_at',
        });

        expect(withExists()).toEqual(
            {
                'exists': {
                    'field': 'created_at'
                }
            }
        );
    });

    test.concurrent('.range', () => {
        const withRange = query.range('created_at', {
            'gte': '2023-04-01',
            'lte': '2024-04-08'
        });

        expect(withRange()).toEqual(
            {
                'range': {
                    'created_at': {
                        'boost': 1,
                        'gte': '2023-04-01',
                        'lte': '2024-04-08'
                    }
                }
            }
        );
    });
});

describe('.queryDSL', () => {
    test.concurrent('.textQuery.matchPhrasePrefix', () => {
        const prefixResult = queryDSL.textQuery.matchPhrasePrefix('fruits', 'Apple');
        const pipelineQ = pipeline(
            queryDSL.textQuery.multiMatch('Sonya', {
                'queryFields': ['customer_first_name']
            }),
            queryDSL.compoundQuery.withShould(),
            queryDSL.withBool(),
            queryDSL.contextQuery.withQuery(),
            queryDSL.withPrettyPrint(),
        );

        pipelineQ();

        expect(prefixResult()).toEqual(
            {
                'match_phrase_prefix': {
                    'fruits': {
                        'query': 'Apple',
                        'slop': 3,
                        'max_expansions': 30
                    }
                }
            }
        );
    });

    test.concurrent('.textQuery.matchPhrase', () => {
        const prefixResult = queryDSL.textQuery.matchPhrase('fruits', 'Apple');
        expect(prefixResult()).toEqual(
            {
                'match_phrase': {
                    'fruits': {
                        'query': 'Apple',
                        'slop': 3
                    }
                }
            }
        );
    });

    test.concurrent('.textQuery.matchBoolPrefix', () => {
        const matchBoolResult = queryDSL.textQuery.matchBoolPrefix('fruits', 'Apple');
        expect(matchBoolResult()).toEqual(
            {
                'match_bool_prefix': {
                    'fruits': {
                        'query': 'Apple',
                        'operator': 'OR',
                        'max_expansions': 30,
                        'boost': 1
                    }
                }
            }
        );
    });

    test.concurrent('.textQuery.match', () => {
        const matchResult = queryDSL.textQuery.match('first_name', 'Jayjay');
        expect(matchResult()).toEqual(
            {
                'match': {
                    'first_name': {
                        'query': 'Jayjay',
                        'operator': 'OR',
                        'max_expansions': 30,
                        'boost': 1,
                    }
                }
            }
        );
    });

    test.concurrent('.textQuery.multiMatch with all/some fields', () => {
        const multiResult = queryDSL.textQuery.multiMatch('Jay');
        expect(multiResult()).toEqual(
            {
                'multi_match': {
                    'query': 'Jay',
                    'operator': 'OR',
                    'fields': '*',
                    'type': 'best_fields',
                    'tie_breaker': 0.0,
                    'max_expansions': 30,
                    'boost': 1
                }
            }
        );

        const multiResultA = queryDSL.textQuery.multiMatch('Jay', {
            'queryFields': ['full_name', 'last_name']
        });
        expect(multiResultA()).toEqual(
            {
                'multi_match': {
                    'query': 'Jay',
                    'operator': 'OR',
                    'fields': ['full_name', 'last_name'],
                    'type': 'best_fields',
                    'tie_breaker': 0.0,
                    'max_expansions': 30,
                    'boost': 1
                }
            }
        );
    });

    test.concurrent('.textQuery.queryString', () => {
        const matchResult = queryDSL.textQuery.queryString('first_name: "Jayjay"');
        expect(matchResult()).toEqual(
            {
                'query_string': {
                    'query': 'first_name: "Jayjay"',
                    'fields': ['*'],
                    'default_operator': 'OR',
                    'boost': 1,
                }
            }
        );
    });

    test.concurrent('.matchAll', () => {
        const matchAllResult = queryDSL.matchAll();
        expect(matchAllResult()).toEqual({'match_all': {}});
    });

    test.concurrent('.termQuery.term', () => {
        const termResult = queryDSL.termQuery.term('book_id', '22919');
        expect(termResult()).toEqual(
            {
                'term': {
                    'book_id': '22919'
                }
            }
        );
    });

    test.concurrent('.termQuery.terms', () => {
        const termsResult = queryDSL.termQuery.terms('books_id', ['22919', '54321']);
        expect(termsResult()).toEqual(
            {
                'terms': {
                    'books_id': ['22919', '54321']
                }
            }
        );
    });

    test.concurrent('.compoundQuery.withShould, as: empty, object, empty object', () => {
        // default
        const withShouldResultA = queryDSL.compoundQuery.withShould();
        expect(withShouldResultA()).toEqual(
            {
                'should': []
            }
        );

        const withShouldResultB = queryDSL.compoundQuery.withShould();
        expect(withShouldResultB([query.term('book_id', '22919')()])).toEqual(
            {
                'should': [{
                    'term': {
                        'book_id': '22919'
                    }
                }]
            }
        );

        const withShouldResultC = queryDSL.compoundQuery.withShould();
        expect(withShouldResultC({})).toEqual(
            {
                'should': [{}]
            }
        );
    });

    test.concurrent('.compoundQuery.withMust,  as: empty, object, empty object', () => {
        // default
        const withMustResultA = queryDSL.compoundQuery.withMust();
        expect(withMustResultA()).toEqual(
            {
                'must': []
            }
        );

        const withMustResultB = queryDSL.compoundQuery.withMust();
        expect(withMustResultB([queryDSL.termQuery.term('book_id', '54321')()])).toEqual(
            {
                'must': [{
                    'term': {
                        'book_id': '54321'
                    }
                }]
            }
        );

        const withMustResultC = queryDSL.compoundQuery.withMust();
        expect(withMustResultC({})).toEqual(
            {
                'must': [{}]
            }
        );
    });

    test.concurrent('.compoundQuery.withMustNot as: empty, object, empty object', () => {
        // default
        const withMustNotResultA = queryDSL.compoundQuery.withMustNot();
        expect(withMustNotResultA()).toEqual(
            {
                'must_not': []
            }
        );

        const withMustNotResultB = queryDSL.compoundQuery.withMustNot();
        expect(withMustNotResultB([queryDSL.termQuery.term('author_id', '2242')()])).toEqual(
            {
                'must_not': [{
                    'term': {
                        'author_id': '2242'
                    }
                }]
            }
        );

        const withMustResultC = queryDSL.compoundQuery.withMustNot();
        expect(withMustResultC({})).toEqual(
            {
                'must_not': [{}]
            }
        );
    });

    test.concurrent('.withBool as: empty, withConstant arg', () => {
        const withBool = queryDSL.withBool();
        expect(withBool()).toEqual(
            {
                'bool': undefined
            }
        );

        const withBoolA = queryDSL.withBool();
        expect(withBoolA(queryDSL.withConstant('author', 'Dave')())).toEqual(
            {
                'bool': {'author': 'Dave'}
            }
        );
    });

    test.concurrent('.contextQuery.withQuery', () => {
        const withQuery = queryDSL.contextQuery.withQuery();
        expect(withQuery()).toEqual(
            {
                'query': undefined
            }
        );

        const withQueryA = queryDSL.contextQuery.withQuery();
        expect(withQueryA(queryDSL.withConstant('author', 'Dave')())).toEqual(
            {
                'query': {
                    'author': 'Dave'
                }
            }
        );
    });

    test.concurrent('.withSiblings', () => {
        // default
        const withSiblingsResultA = queryDSL.withSiblings([]);
        expect(withSiblingsResultA()).toEqual({});

        const withSiblingsResultB = queryDSL.withSiblings([
            queryDSL.textQuery.match('car', 'mercedes'),
            queryDSL.withConstant('minimum_match', 10),
        ]);

        expect(withSiblingsResultB(queryDSL.termQuery.term('book_id', '22919'))).toEqual(
            {
                'minimum_match': 10,
                'match': {
                    'car': {
                        'query': 'mercedes',
                        'boost': 1,
                        'max_expansions': 30,
                        'operator': 'OR',
                    }
                }
            }
        );
    });

    test.concurrent('.contextQuery.withFilter', () => {
        // default
        expect(queryDSL.contextQuery.withFilter()()).toEqual(
            {
                'filter': []
            }
        );

        // basequery as a match
        expect(queryDSL.contextQuery.withFilter()(queryDSL.textQuery.match('fruit', 'Apple')())).toEqual(
            {
                'filter': {
                    'match': {
                        'fruit': {
                            'query': 'Apple',
                            'operator': 'OR',
                            'max_expansions': 30,
                            'boost': 1
                        }
                    }
                }
            }
        );

        expect(queryDSL.contextQuery.withFilter()([
            queryDSL.textQuery.match('fruit', 'Apple')(), queryDSL.withConstant('first_name', 'Jay')()
        ])).toEqual(
            {
                'filter': [
                    {
                        'match': {
                            'fruit': {
                                'query': 'Apple',
                                'operator': 'OR',
                                'max_expansions': 30,
                                'boost': 1
                            }
                        }
                    },
                    {'first_name': 'Jay'}
                ]
            }
        );
    });

    test.concurrent('.withSource', () => {
        // default
        expect(queryDSL.withSource()()).toEqual(
            {
                '_source': undefined
            }
        );

        const withSource = queryDSL.withSource(['first_name', 'last_name']);
        expect(withSource()).toEqual(
            {
                '_source': ['first_name', 'last_name']
            }
        );
    });

    test.concurrent('.withConstant', () => {
        const withConstant = queryDSL.withConstant('author', 'shakespear');
        expect(withConstant()).toEqual(
            {
                'author': 'shakespear'
            }
        );
    });

    test.concurrent('.withArray', () => {
        const withArrayresult = queryDSL.withArray([
            queryDSL.withConstant('first_name', 'Dave'),
            queryDSL.termQuery.term('country', 'Nigeria')
        ]);
        expect(withArrayresult()).toEqual(
            [
                { 'first_name': 'Dave' },
                {'term': { 'country': 'Nigeria'} }
            ]
        );
    });

    test.concurrent('.withPrettyPrint', () => {
        const mockFn = jest.fn();
        const withPrettyPrint = queryDSL.withPrettyPrint({}, mockFn);

        expect(withPrettyPrint(queryDSL.textQuery.match('author', 'Dave')())).toEqual({
            'match': {
                'author': {
                    'query': 'Dave',
                    'boost': 1,
                    'max_expansions': 30,
                    'operator': 'OR'
                }
            }
        });
        expect(mockFn.mock.calls).toEqual([[JSON.stringify({
            'match': {
                'author': {
                    'query': 'Dave',
                    'operator': 'OR',
                    'max_expansions': 30,
                    'boost': 1,
                }
            }
        })]]);
    });

    test.concurrent('.withScriptScore', () => {
        const withScriptScore = queryDSL.withScriptScore(
            query.match('author', 'Dave')(),
            {
                source: `
                    _score * doc[params.field].value
                `,
                params: {
                    'field': 'multiplier'
                }
            }
        );

        expect(withScriptScore()).toEqual(
            {
                'script_score': {
                    'query': {
                        'match': {
                            'author': {
                                'query': 'Dave',
                                'boost': 1,
                                'max_expansions': 30,
                                'operator': 'OR'
                            }
                        }
                    },
                    'script': {
                        lang: 'painless',
                        source: '\n                    _score * doc[params.field].value\n                ',
                        params: { 'field': 'multiplier' }
                    }
                }
            }
        );
    });

    test.concurrent('.termQuery.exists', () => {
        const withExists = queryDSL.termQuery.exists({
            'name': 'created_at',
        });

        expect(withExists()).toEqual(
            {
                'exists': {
                    'field': 'created_at'
                }
            }
        );
    });

    test.concurrent('.termQuery.range', () => {
        const withRange = queryDSL.termQuery.range('created_at', {
            'gte': '2023-04-01',
            'lte': '2024-04-08'
        });

        expect(withRange()).toEqual(
            {
                'range': {
                    'created_at': {
                        'boost': 1,
                        'gte': '2023-04-01',
                        'lte': '2024-04-08'
                    }
                }
            }
        );
    });
});

describe('.options', () => {
    test.concurrent('.withPaginate', () => {
        expect(pipeline(
            options.withPaginate(0, 3),
            queryDSL.contextQuery.withQuery(),
        )()).toEqual(
            {
                query: {
                    from: 0,
                    size: 3,
                },

            }
        );

        expect(pipeline(
            options.withPaginate(1, 3),
            queryDSL.contextQuery.withQuery(),
        )()).toEqual(
            {
                query: {
                    from: 0,
                    size: 3,
                },

            }
        );

        expect(pipeline(
            options.withPaginate(-1, 3),
            queryDSL.contextQuery.withQuery(),
        )()).toEqual(
            {
                query: {
                    from: 0,
                    size: 3,
                },

            }
        );
    });

    test.concurrent('.withHighlight', () => {
        // default
        expect(options.withHighlight()()).toEqual(
            {
                'highlight': {
                    'fields': undefined,
                    'post_tags': ['</strong>'], 'pre_tags': ['<strong>']
                }
            }
        );

        const withHighlightA = options.withHighlight(['first_name', 'last_name']);
        expect(withHighlightA()).toEqual(
            {
                'highlight': {
                    'fields': ['first_name', 'last_name'],
                    'post_tags': ['</strong>'], 'pre_tags': ['<strong>']
                }
            }
        );
    });

    test.concurrent('.withSort', () => {
        const withSort = options.withSort();

        expect(withSort()).toEqual({
            'sort': []
        });
    });
});
