function QuantitativeList(elem) {
    this.elem = elem;
}

var proto = QuantitativeList.prototype;


proto.id = 'quantitative-list';


proto.init = function() {
    var self = this;
    this.elem.addEventListener('quantitychanged', function(event) {
        event.stopPropagation();
        self._emitQLStateChangedEvent();
    });
};


proto.reset = function() {
    var items = this.elem.getElementsByClassName(this.id + '__item');

    for (var i = 0; i < items.length; ++i) {
        var qiBlock = items[i].bemEntities['quantitative-item'];
        if (qiBlock) qiBlock.reset(false);
    }

    this._emitQLStateChangedEvent();
};


proto.getState = function() {
    var items = this.elem.getElementsByClassName(this.id + '__item');
    var result = [];

    for (var i = 0; i < items.length; ++i) {
        var qiBlock = items[i].bemEntities['quantitative-item'];

        qiBlock && result.push({
            label: qiBlock.label,
            name: qiBlock.outputName,
            value: qiBlock.quantity
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