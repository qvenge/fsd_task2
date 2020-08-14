function QuantitativeItem(elem) {
    this.elem = elem;
}

var proto = QuantitativeItem.prototype;


proto.id = 'quantitative-item';


proto.init = function() {
    var self = this;

    this._quantityElem = this.elem.querySelector('.' + this.id + '__quantity');
    this._labelElem = this.elem.querySelector('.' + this.id + '__label');

    this.elem.addEventListener('click', function(event) {
        if (event.target.classList.contains(self.id + '__btn_plus')) {
            ++self.quantity;
            self._emitQuantityChangedEvent();
        } else if (event.target.classList.contains(self.id + '__btn_minus')) {
            --self.quantity;
            self._emitQuantityChangedEvent();
        }
    });
};


proto.reset = function(doEmit) {
    this.quantity = 0;
    if (doEmit !== false) this._emitQuantityChangedEvent();
};


proto._emitQuantityChangedEvent = function() {
    var event = new Event('quantitychanged', { bubbles: true, cancelable: true });
    event.detail = this.quantity;
    this.elem.dispatchEvent(event);
};


Object.defineProperties(QuantitativeItem.prototype, {
    quantity: {
        get: function() {
            return +this._quantityElem.value;
        },
        set: function(value) {
            if (value < 0) return;
            var minusBtn = this.elem.querySelector('.' + this.id + '__btn_minus');

            minusBtn.classList.toggle(this.id + '__btn_disabled', !value);
            this._quantityElem.value = value;
        }
    },

    label: {
        get: function() {
            return this._labelElem.textContent;
        },
        set: function(label) {
            this._labelElem.textContent = label;
        }
    },

    outputName: {
        get: function() {
            return this._quantityElem.name;
        },
        set: function(name) {
            this._quantityElem.name = name;
        }
    }
});


if (module) {
    module.exports = QuantitativeItem;
}