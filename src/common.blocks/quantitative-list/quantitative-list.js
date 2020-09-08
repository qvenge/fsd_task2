function QuantitativeList(elem) {
    this.elem = elem;
    this._items = [];

    this._init();
}

var proto = QuantitativeList.prototype;


proto.reset = function() {
    this._items.forEach(function(item) {
        item.reset(false);
    });

    this._emitQLStateChangedEvent();
};


proto.getState = function() {
    return this._items.map(function(item) {
        return {
            label: item.label,
            name: item.outputName,
            value: item.value
        };
    });
};


proto._init = function() {
    var self = this;
    var items = this.elem.getElementsByClassName('quantitative-item');

    for (var i = 0; i < items.length; ++i) {
        this._items.push(window.BEM.getEntityInstance(items[i], 'quantitative-item'));
    }

    this.elem.addEventListener('quantitychanged', function(event) {
        self._emitQLStateChangedEvent();
    });
};


proto._emitQLStateChangedEvent = function() {
    var event = new Event('qlstatechanged', { bubbles: true, cancelable: true });
    event.detail = this.getState();
    this.elem.dispatchEvent(event);
};

Object.defineProperties(QuantitativeList.prototype, {
    id: {
        value: 'quantitative-list',
        enumerable: true,
    }
})

if (module) {
    module.exports = QuantitativeList;
}