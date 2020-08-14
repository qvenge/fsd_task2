class Hoarder {
    constructor() {
        this.funcs = [];
    }

    push(fn) {
        if (typeof fn === 'function') {
            this.funcs.push(fn);
        }
    }

    _parallel(callback, premature) {
        const fns = this.funcs.slice();
        let counter = fns.length;
        const output = new Array(counter);

        if (!counter) return callback(null, output);

        let interrupted = false;

        fns.forEach((fn, index) => {
            fn((err, result) => {
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
    }

    _series(callback, premature) {
        const fns = this.funcs.slice();
        const len = fns.length;
        const output = [];

        if (!len) return callback(null, output);

        let index = 0;

        fns[index](function cb(err, result) {
            if (premature) {
                if (err) {
                    return callback(err);
                }
                output.push(result);
            } else {
                output[index] = err
                    ? { status: 'rejected', reason: err }
                    : { status: 'fulfilled', value: result };
            }
            ++index;

            if (index === len) {
                callback(null, output);
            } else {
                fns[index](cb);
            }
        });

    }

    execute(callback, options = {}) {
        const premature = options.settled !== true;
        const parallel = options.parallel !== false;

        if (parallel) {
            this._parallel(callback, premature);
        } else {
            this._series(callback, premature);
        }
    }
}

module.exports = Hoarder;