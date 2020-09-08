function BemEntity() {
    this._postInitCallbacks = [];
    this._wasInitialized = false;
}

BemEntity.prototype = {
    addPostInitCallback: function(callback) {
        if (typeof callback === 'function') {
            if (this._wasInitialized) {
                callback();
            } else {
                this._postInitCallbacks.push(callback);
            }
        }
    },

    addInitializedCallback: function(callback) {
        this.addPostInitCallback(callback);
    },

    setPostInit: function(fn) {
        this.addPostInitCallback(fn);
    },

    postInit: function() {
        this._postInitCallbacks.forEach(function(callback) {
            callback.call(this);
        }, this);

        this._postInitCallbacks = [];
        this._wasInitialized = true;
    }
}

BemEntity.prototype.constructor = BemEntity;

if (module) {
    module.exports = BemEntity;
}