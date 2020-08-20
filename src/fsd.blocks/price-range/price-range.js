function PriceRange(elem) {
    this.elem = elem;
    this.minPrice = elem.querySelector('.' + this.id + '__min-price');
    this.maxPrice = elem.querySelector('.' + this.id + '__max-price');
    this.slider = null;
}

PriceRange.prototype = {
    id: 'price-range',

    postInit: function() {
        var self = this;

        this.slider = this.elem.querySelector('.range-double-slider').bemInstances['range-double-slider'];

        this.elem.addEventListener('rdsvaluechanged', function(event) {
            self.minPrice.textContent = self._stringifyValue(event.detail[0]);
            self.maxPrice.textContent = self._stringifyValue(event.detail[1]);
            
            self._emitPriceRangeChangedEvent(event.detail);
        });
    },

    _stringifyValue: function(value) {
        value = String(value);
        var result = value.slice(-3);

        for (var i = -3; i > -value.length; i -= 3) {
            result = value.slice(i - 3, i) + ' ' + result;
        }

        return result;
    },

    _emitPriceRangeChangedEvent: function(values) {
        var event = new Event('pricerangechanged', { bubbles: true, cancelable: true });
        event.detail = values;
        this.elem.dispatchEvent(event);
    }
}


PriceRange.constructor = PriceRange;


if (module) {
    module.exports = PriceRange;
}