const { pipeline } = require('../');

describe('pipeline', () => {
    test.concurrent('with one function', () => {
        function sum(x) {
            return function (y) {
                return x + y;
            };
        }

        const result = pipeline(sum(5));
        expect(result(4)).toEqual(9);
        expect(result(2)).toEqual(7);
    });

    test.concurrent('with many function', () => {
        function sum(x) {
            return function (y) {
                return x + y;
            };
        }

        function mul(x) {
            return x * 2;
        }

        function pow(x) {
            return x * x;
        }

        const resultA = pipeline(sum(5), mul);
        expect(resultA(4)).toEqual(18);
        expect(resultA(2)).toEqual(14);


        const resultB = pipeline(sum(5), pow);
        expect(resultB(4)).toEqual(81);
        expect(resultB(2)).toEqual(49);
    });
});
