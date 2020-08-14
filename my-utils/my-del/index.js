const { asynchronist } = require('../asynchronist');




    /* 
        Node : Directory {
            type: [String] :'directory',
            name: [String],
            entities: [Array[Node]],
            deleted: [Boolean],
            error: [Error] | undefined
        }

        Node : File {
            type: [String] :'file',
            name: [String],
            dir: [String],
            deleted: [Boolean],
            error: [Error] | undefined
        }

        Node : Unknown {
            type: [String] :'unknown',
            name: [String],
            deleted: [Boolean] : false,
        }
     */







class MyDel {
    constructor(options) {
        this.exclude = Array.isArray(options.exclude) ? options.exclude : [];
    }

    clearDirectory(dir, exclude, callback) {

        const _exclude = this.exclude.map(name => path.resolve(dir, name));

        if (typeof exclude === 'function') {
            callback = exclude;
        } else {
            _exclude.push(...exclude.map(name => path.resolve(dir, name)));
        }

        function _clearDirectory(dir, doRemoveDir, callback) {
            fs.readdir(
                dir,
                { withFileTypes: true },
                (err, dirents) => {
                    if (err) {
                        return callback(err);
                    }
                    asynchronist.eachParallel(
                        dirents,
                        (dirent, callback) => {
                            const name = path.resolve(dir, dirent.name);
                            const index = _exclude.indexOf(name);
                            if (index !== -1) {
                                _exclude.splice(index, 1);
                                doRemoveDir = false;
                                return callback();
                            }
                            if (dirent.isDirectory()) {
                                return _clearDirectory(name, true, callback);
                            }

                            const result = {
                                type: 'unknown',
                                name,
                                dir,
                                deleted: false
                            };

                            if (dirent.isFile()) {
                                result.type = 'file';
                                return fs.unlink(name, err => {
                                    if (err) {
                                        result.error = err;
                                    } else {
                                        result.deleted = true;
                                    }
                                    callback(null, result);
                                });
                            }
                            doRemoveDir = false;
                            callback(null, result);
                        },
                        (err, entities) => {
                            if (err) {
                                return callback(err);
                            }
                            const result = {
                                type: 'directory',
                                name: dir,
                                deleted: false,
                                entities: entities.filter(entity => entity)
                            };
                            if (doRemoveDir) {
                                return fs.rmdir(dir, err => {
                                    if (err) {
                                        result.error = err;
                                    } else {
                                        result.deleted = true;
                                    }
                                    callback(null, result);
                                });
                            }
                            callback(null, result);
                        }
                    );
                }
            );
        }

        _clearDirectory(dir, false, callback);
    }
}