function PriceRange(elem) {
    this.elem = elem;
    this.minPrice = elem.querySelector('.' + this.id + '__min-price');
    this.maxPrice = elem.querySelector('.' + this.id + '__max-price');
    this.slider = null;

    this._init();
}

Object.defineProperties(PriceRange.prototype, {
    id: {
        value: 'price-range',
        enumerable: true
    },

    _init: {
        value: function() {
            var self = this;
            var sliderElem = this.elem.querySelector('.range-double-slider');

            this.slider = window.BEM.getEntityInstance(sliderElem, 'range-double-slider');

            this.elem.addEventListener('rdsvaluechanged', function(event) {
                self.minPrice.textContent = self._stringifyValue(event.detail[0]);
                self.maxPrice.textContent = self._stringifyValue(event.detail[1]);
                
                self._emitPriceRangeChangedEvent(event.detail);
            });
        }
    },

    _stringifyValue: {
        value: function(value) {
            value = String(value);
            var result = value.slice(-3);

            for (var i = -3; i > -value.length; i -= 3) {
                result = value.slice(i - 3, i) + ' ' + result;
            }

            return result;
        }
    },

    _emitPriceRangeChangedEvent: {
        value: function(values) {
            var event = new Event('pricerangechanged', { bubbles: true, cancelable: true });
            event.detail = values;
            this.elem.dispatchEvent(event);
        }
    }
});


if (module) {
    module.exports = PriceRange;
}