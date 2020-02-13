(function (moduleFactory) {
    const isNode = typeof module !== 'undefined'
        && typeof module.exports !== 'undefined';

    if (isNode) {
        module.exports = moduleFactory();
    } else {
        window.contractify = moduleFactory();
    }
})(function () {

    function getFunctionName(fn) {
        return fn.name !== ''
            ? fn.name
            : 'anonymous function';
    }

    function buildArgCountErrorString(fn, argCount) {
        return `Function '${getFunctionName(fn)}' ` +
            `expected ${fn.length} arguments, but ` +
            `got ${argCount}.`
    }

    function buildTypeOutput(types) {
        return `['${types.join(`', '`)}']`;
    }

    function buildArgTypeErrorString(fn, args, types) {
        const argTypes = args.map(arg => typeof arg);

        return `Function '${getFunctionName(fn)}' ` +
            `expected arguments of type ${buildTypeOutput(types)}, ` +
            `but got ${buildTypeOutput(argTypes)}.`
    }

    function buildReturnTypeErrorString(fn, resultType, returnType) {
        return `Function '${getFunctionName(fn)}' ` +
            `expected a return type of '${returnType}', ` +
            `but got '${resultType}'.`
    }

    function throwOnBadArgumentCount(fn, args) {
        const argCount = args.length;
        const paramCount = fn.length;

        if (paramCount !== argCount) {
            const errorMessage = buildArgCountErrorString(fn, argCount);
            throw new Error(errorMessage);
        }
    }

    function doTypesMatch(args, types) {
        argTypes = types.length > 0 ? args.map(arg => typeof arg) : types;

        return types.toString() === argTypes.toString();
    }

    function throwOnBadInputTypes(fn, args, types) {
        const typesDoNotMatch = !doTypesMatch(args, types);

        if (typesDoNotMatch) {
            const errorMessage = buildArgTypeErrorString(fn, args, types);
            throw new Error(errorMessage);
        }
    }

    function throwOnBadReturnType(fn, result, returnType) {
        const resultType = typeof result;
        const typesDoNotMatch = returnType !== null
            && resultType !== returnType;

        if (typesDoNotMatch) {
            const errorMessage = buildReturnTypeErrorString(fn, resultType, returnType);
            throw new Error(errorMessage);
        }
    }

    function assure(fn, options = {}) {
        const {
            types = [],
            returnType = null
        } = options;
        
        return function (...args) {
            throwOnBadArgumentCount(fn, args);
            throwOnBadInputTypes(fn, args, types);

            const result = fn.apply(this, args);

            throwOnBadReturnType(fn, result, returnType)

            return result;
        }
    }

    return {
        assure
    };
});