
const { pipeline, query } = require('../');


describe('query', () => {
    test.concurrent('testing matchPrefix', () => {
        const prefixResult = query.matchPrefix('fields', 'field', 'querytext');
        expect(prefixResult('fields', 'field', 'querytext')).toEqual(
            {
                'match_phrase_prefix': {
                    ['field']: {
                        'query': 'querytext',
                        'slop': 3
                    }
                }
            }
        );
    });

    test.concurrent('testing match', () => {
        const matchResult = query.match('field', 'querytext');
        expect(matchResult('field', 'querytext')).toEqual(
            {
                'match': {
                    ['field']: {
                        'query': 'querytext',
                    }
                }
            }
        );
    });

    test.concurrent('testing multimatch', () => {
        const multiResult = query.multimatch('fields', 'querytext', 'type', 'TB');
        expect(multiResult('fields', 'querytext', 'type', 'TB')).toEqual(
            {
                'multi_match': {
                    'query': 'querytext',
                    'fields': 'fields',
                    'type': 'type',
                    'tie_breaker': 'TB',
                }
            }
        );
    });

    test.concurrent('testing term', () => {
        const termResult = query.term('key', 'term');
        expect(termResult('key', 'term')).toEqual(
            {
                'term': {
                    ['key']: 'term'
                }
            }
        );
    });

    test.concurrent('testing terms', () => {
        const termsResult = query.terms('key', 'terms');
        expect(termsResult('key', 'term')).toEqual(
            {
                'terms': {
                    ['key']: 'terms'
                }
            }
        );
    });

    test.concurrent('testing withShould', () => {
        // default
        const withShouldResultA = query.withShould();
        expect(withShouldResultA()).toEqual(
            {
                'should': Array()
            }
        );
    });

    test.concurrent('testing withMust', () => {
        // default
        const withMustResultA = query.withMust();
        expect(withMustResultA()).toEqual(
            {
                'must': Array()
            }
        );
    });

    test.concurrent('testing withMustNot', () => {
        // default
        const withMustNotResultA = query.withMustNot();
        expect(withMustNotResultA()).toEqual(
            {
                'must_not': Array()
            }
        );
    });

    test.concurrent('testing withBool', () => {
        const withBool = query.withBool();
        expect(withBool()).toEqual(
            {
                'bool': undefined
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
    });

    test.concurrent('testing withSiblings', () => {
        // default
        const withSiblingsResultA = query.withSiblings([]);
        expect(withSiblingsResultA()).toEqual({});

        const withSiblingsResultB = query.withSiblings([
            query.match('car', 'mercedes'),
            query.withConstant('minimum_match', 10),
        ]);

        expect(withSiblingsResultB()).toEqual(
            {
                minimum_match: 10,
                match: {
                    car: {
                        query: 'mercedes'
                    }
                }
            }
        );
                    
    });

    test.concurrent('testing withFilter', () => {
        // default
        const withFilter = query.withFilter();
        expect(withFilter()).toEqual(
            {
                'filter': Array()
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
                    from: 0,
                    size: 3,
                },

            }
        );
    });

    test.concurrent('testing withHighlight', () => {
        // default
        const withHighlight = query.withHighlight();

        expect(withHighlight()).toEqual(
            {
                'highlight': {
                    'fields': undefined,
                    'post_tags': ['</strong>'], 'pre_tags': ['<strong>']
                }
            });
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
        const withSource = query.withSource();

        expect(withSource()).toEqual(
            {
                '_source': undefined
            }
        );
    });

    

    test.concurrent('testing withConstant', () => {
        const withConstant = query.withConstant('key', 'value');
        expect(withConstant('key', 'value')).toEqual(
            {
                'key': 'value'
            }
        );
    });

    test.concurrent('testing withArray', () => {
        const withArray = query.withArray([
            query.withConstant('key', 'value'),
            query.term('key', 'term')
        ]);
        expect(withArray(
            [
                query.withConstant('key', 'value'),
                query.term('key', 'term')
            ]
        )).toEqual(
            [
                { 'key': 'value' },
                {'term': { ['key']: 'term'} }
            ]
        );
    });

    test.concurrent('test withPrettyPrint', () => {
        // default
        const withPrettyPrint = query.withPrettyPrint();
        expect(withPrettyPrint()).toEqual(undefined);
    });
});
