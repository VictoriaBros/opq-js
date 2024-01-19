
const { query } = require('../');


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
        // default
        const withBoolResultA = query.withBool();
        expect(withBoolResultA()).toEqual(
            {
                'bool': undefined
            }
        );
    });

    
});
