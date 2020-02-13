const contractify = require('../index');

const { assert } = require('chai');

describe('Contractify', function () {

    it('does not throw an error if argument count is correct', function () {
        function twoArgFn(a, b) { }
        const assuredFunction = contractify.assure(twoArgFn);

        assert.doesNotThrow(() => assuredFunction(1, 2));
    });

    it('calls assured function and returns result', function () {
        function add(a, b) {
            return a + b;
        }

        const assuredAdd = contractify.assure(add);

        assert.equal(assuredAdd(2, 3), 5);
    });

    it('throws an error if the argument count is incorrect', function () {
        function twoArgFn(a, b) { }
        const assuredFunction = contractify.assure(twoArgFn);

        assert.throws(
            () => assuredFunction(1, 2, 3),
            `Function 'twoArgFn' expected 2 arguments, but got 3.`
        );
    });

    it('attaches object context correctly', function () {
        const myObj = {
            name: 'test',
            getName: function () {
                return this.name;
            }
        };

        myObj.getName = contractify.assure(myObj.getName);

        assert.equal(myObj.getName(), 'test');
    });

    it('throws an error if input types are incorrect', function () {
        function twoArgFn(a, b) { }
        const assuredFunction = contractify
            .assure(twoArgFn, {
                types: ['string', 'number']
            });

        assert.throws(
            () => assuredFunction(1, null),
            `Function 'twoArgFn' expected arguments of type ['string', 'number'], but got ['number', 'object'].`
        );

    });

    it('throws an error if return type is incorrect', function () {
        function twoArgFn(a, b) {
            return 99;
        }
        const assuredFunction = contractify
            .assure(twoArgFn, {
                returnType: 'string'
            });

        assert.throws(
            () => assuredFunction(1, null),
            `Function 'twoArgFn' expected a return type of 'string', but got 'number'.`
        );

    });

});