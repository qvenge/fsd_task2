function QuantitativeList(elem) {
    this.elem = elem;
    this._items = this.elem.getElementsByClassName('quantitative-item');

    this.init();
}

var proto = QuantitativeList.prototype;


proto.id = 'quantitative-list';


proto.init = function() {
    var self = this;

    this.elem.addEventListener('quantitychanged', function(event) {
        // event.stopPropagation();
        self._emitQLStateChangedEvent();
    });
};


proto.reset = function() {
    var items = this._items;

    for (var i = 0; i < items.length; ++i) {
        var qiBlock = items[i].bemInstances['quantitative-item'];
        if (qiBlock) qiBlock.reset(false);
    }

    this._emitQLStateChangedEvent();
};


proto.getState = function() {
    var items = this._items;
    var result = [];

    for (var i = 0; i < items.length; ++i) {
        var qiBlock = items[i].bemInstances['quantitative-item'];

        qiBlock && result.push({
            label: qiBlock.label,
            name: qiBlock.outputName,
            value: qiBlock.value
        });
    }

    return result;
};


proto._emitQLStateChangedEvent = function() {
    var event = new Event('qlstatechanged', { bubbles: true, cancelable: true });
    event.detail = this.getState();
    this.elem.dispatchEvent(event);
};



if (module) {
    module.exports = QuantitativeList;
}