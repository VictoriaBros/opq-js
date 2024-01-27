
const { pipeline, query } = require('../');


describe('query', () => {
    test.concurrent('testing matchPrefix', () => {
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

    test.concurrent('testing matchBool', () => {
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

    test.concurrent('testing match', () => {
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

    test.concurrent('testing multimatch with all/some fields', () => {
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

    test.concurrent('testing match_all', () => {
        const matchAllResult = query.matchAll();
        expect(matchAllResult()).toEqual({'match_all': {}});
    });

    test.concurrent('testing term', () => {
        const termResult = query.term('book_id', '22919');
        expect(termResult()).toEqual(
            {
                'term': {
                    'book_id': '22919'
                }
            }
        );
    });

    test.concurrent('testing terms', () => {
        const termsResult = query.terms('books_id', ['22919', '54321']);
        expect(termsResult()).toEqual(
            {
                'terms': {
                    'books_id': ['22919', '54321']
                }
            }
        );
    });

    test.concurrent('testing withShould, as: empty, object, empty object', () => {
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

    test.concurrent('testing withMust,  as: empty, object, empty object', () => {
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

    test.concurrent('testing withMustNot as: empty, object, empty object', () => {
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

    test.concurrent('testing withBool as: empty, withConstant arg', () => {
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

    test.concurrent('testing withQuery', () => {
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

    test.concurrent('testing withSiblings', () => {
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

    test.concurrent('testing withFilter', () => {
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

    test.concurrent('testing withPaginate', () => {
        const withPaginate = pipeline(
            query.withPaginate(0, 3),
            query.withQuery(),
            query.withPrettyPrint(),
        );

        expect(withPaginate()).toEqual(
            {
                query: {
                    from: -3,
                    size: 3,
                },

            }
        );
    });

    test.concurrent('testing withHighlight', () => {
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

    test.concurrent('testing withSort', () => {
        // default
        const withSort = query.withSort();

        expect(withSort()).toEqual({
            'sort': []
        });
    });

    test.concurrent('testing withSource', () => {
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

    

    test.concurrent('testing withConstant', () => {
        const withConstant = query.withConstant('author', 'shakespear');
        expect(withConstant()).toEqual(
            {
                'author': 'shakespear'
            }
        );
    });

    test.concurrent('testing withArray', () => {
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

    test.concurrent('test withPrettyPrint', () => {
        // default
        const withPrettyPrint = query.withPrettyPrint();
        expect(withPrettyPrint()).toEqual(undefined);
    });
});
