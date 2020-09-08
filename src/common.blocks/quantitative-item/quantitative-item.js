function QuantitativeItem(elem) {
    this.elem = elem;
    this._quantityElem = elem.querySelector('.' + this.id + '__quantity');
    this._labelElem = elem.querySelector('.' + this.id + '__label');
    this._minusBtn = elem.querySelector('.' + this.id + '__btn_minus');
    this._input = elem.querySelector('.' + this.id + '__input');

    this.init();
}

var proto = QuantitativeItem.prototype;


proto.id = 'quantitative-item';


proto.init = function() {
    var self = this;

    this.value = this._input.value;

    this.elem.addEventListener('click', function(event) {
        if (event.target.classList.contains(self.id + '__btn_plus')) {
            ++self.value;
            self._emitQuantityChangedEvent();
        } else if (event.target.classList.contains(self.id + '__btn_minus')) {
            --self.value;
            self._emitQuantityChangedEvent();
        }
    });
};


proto.reset = function(doEmit) {
    this.value = this._input.getAttribute('value');
    if (doEmit !== false) this._emitQuantityChangedEvent();
};


proto._emitQuantityChangedEvent = function() {
    var event = new Event('quantitychanged', { bubbles: true, cancelable: true });
    event.detail = this.value;
    this.elem.dispatchEvent(event);
};


Object.defineProperties(QuantitativeItem.prototype, {
    value: {
        get: function() {
            return +this._input.value;
        },
        set: function(value) {
            value = Number(value);

            if (value < 0) return;

            this._minusBtn.classList.toggle(this.id + '__btn_disabled', !value);
            this._quantityElem.textContent = value;
            this._input.value = value;
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
            return this._input.name;
        },

        set: function(name) {
            this.input.name = name;
        }
    }
});


if (module) {
    module.exports = QuantitativeItem;
}