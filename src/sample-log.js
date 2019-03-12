function log(d) {
    if (d.kind !== 'method') throw 'd.kind in log isn\'t a method';
    const { descriptor: { value: fn }} = d;

    d.descriptor.value = function (...args) {
        console.log(`Arguments: ${JSON.stringify(args)}`);
        try {
            const result = fn.apply(this, args);
            console.log(`Result: ${JSON.stringify(result)}`);
        } catch (e) {
            console.error(`Error: ${e}`);
            throw e;
        }
    }

    return d;
}

class Calculator {
    @log
    sum(a, b) {
      return a + b;
    }
}

const example = new Calculator();
example.sum(1, 2);

// Arguments: 1,2
// Result: 3