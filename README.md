# contractify #

Function contract assurance for Javascript testing

Extended documentation coming soon.

## Setup ##

Install: `npm install contractify --save-dev`

## Usage ##

Works in the browser and in Node.

Call assure to verify function was called correctly. Base case example:

```
const contractify = require('contractify');

it('behaves correctly when the user does stuff', function () {
    function myCallback(data1, data2) {
        assert.equal(data1, goodData);
        assert.equal(data2, otherGoodData);
    }

    const assuredCallback = contractify.assure(myCallback);

    return someAsyncThing()
        .then(myCallback);
});
```

If someone changes the number of data arguments passed through the test will fail. This means people can't accidentally add unacceptable arguments. 