const Hoarder = require('./hoarder');

module.exports = {

    createHoarder(options) {
        return new Hoarder(options);
    },

    eachParallel(input, options, iteratee, callback) {

        if (typeof options === 'function') {
            callback = iteratee;
            iteratee = options;
            options = {};
        }

        if (!Array.isArray(input)) {
            return callback(new Error('The first argument is not an array.'));
        }

        const premature = options.settled !== true;

        let counter = input.length;
        if (!counter) return callback(null, []);

        const output = new Array(counter);

        let interrupted = false;

        input.forEach((item, index) => {
            iteratee(item, (err, result) => {
                if (interrupted) return;
    
                if (premature) {
                    if (err) {
                        interrupted = true;
                        return callback(err);
                    }
                    output[index] = result;
                } else {
                    output[index] = err
                        ? { status: 'rejected', reason: err }
                        : { status: 'fulfilled', value: result };
                }
    
                if (--counter === 0) {
                    callback(null, output);
                }
            });
        });
    },

};