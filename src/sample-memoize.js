function memoize(d) {
    if (d.kind !== 'method') throw 'd.kind in log isn\'t a method';
    const { descriptor: { value: fn }} = d;
    const cache = {};

    d.descriptor.value = function (...args) {
        const key = JSON.stringify(args);

        if (cache[key]) {
            return cache[key];
        }

        return cache[key] = fn.apply(this, args);
    }

    return d;
}

function benchmark(d) {
    if (d.kind !== 'method') throw 'd.kind in log isn\'t a method';
    const { descriptor: { value: fn }} = d;

    d.descriptor.value = function (...args) {
        const start = Date.now();
        const result = fn.apply(this, args);

        if (result.then) {
            result.then(() => {
                console.log(`Benchmark result of ${d.key}: `, Date.now() - start, 'ms');
            });

            return result;
        }

        console.log(`Benchmark result of ${d.key}: `, Date.now() - start, 'ms');

        return result;
    }

    return d;
}

class Example {
    @benchmark
    @memoize
    expensive({ key }) {
        const start = Date.now();
        while (Date.now() - start < 500) key++;
        return key;
    }

    @benchmark
    @memoize
    expensiveAsync() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(5);
            }, 3000);
        });
    }
}

const example = new Example();

example.expensive({
    key: 8
});
//Benchmark result of expensive:  501 ms
example.expensive({
    key: 8
});
//Benchmark result of expensive:  0 ms
example.expensive({
    key: 8
});
//Benchmark result of expensive:  0 ms
example.expensive({
    key: 8
});
//Benchmark result of expensive:  0 ms

example.expensiveAsync().then(() => {
    //Benchmark result of expensiveAsync:  3005 ms
    example.expensiveAsync();
    //Benchmark result of expensiveAsync:  0 ms
});