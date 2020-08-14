function RangeDoubleSlider(elem) {
    this.elem = elem;
}


RangeDoubleSlider.prototype = {
    id: 'range-double-slider',

    init: function() {
        var bemData = this.elem.dataset.bem && JSON.parse(this.elem.dataset.bem);
        var options = bemData[this.id];

        this.step = options.step;
        this.max = options.max;
        this.min = options.min;

        this.container = this.elem.querySelector('.' + this.id + '__container');

        this.leftSlider = {
            elem: this.elem.querySelector('.' + this.id + '__slider_left'),
            min: this.min,
            max: options.values[1],
            value: options.values[0]
        };

        this.rightSlider = {
            elem: this.elem.querySelector('.' + this.id + '__slider_right'),
            min: options.values[0],
            max: this.max,
            value: options.values[1]
        };

        this.leftSlider.valueElem = this.leftSlider.elem.querySelector('.' + this.id + '__value');
        this.rightSlider.valueElem = this.rightSlider.elem.querySelector('.' + this.id + '__value');


        this.elem.addEventListener('mousedown', this._mousedownHandler.bind(this));
    },


    _mousedownHandler: function(event) {
        if (event.which !== 1) return;

        var slider = this.leftSlider.elem.contains(event.target) ? this.leftSlider
            : this.rightSlider.elem.contains(event.target) ? this.rightSlider
                : null;

        if (!slider) return;

        var x0, shift;
        var circle = slider.elem.querySelector('.' + this.id + '__circle');

        if (!circle.contains(event.target)) {
            if (slider === this.leftSlider) {
                x0 = slider.elem.getBoundingClientRect().right;
                shift = x0 - event.clientX + (circle.offsetWidth / 2);
                this.leftValue = slider.value - this._calculateValueDiff(shift);
            } else {
                x0 = slider.elem.getBoundingClientRect().left;
                shift = x0 - event.clientX - (circle.offsetWidth / 2);
                this.rightValue = slider.value - this._calculateValueDiff(shift);
            }
        }

        var circlePosition = circle.getBoundingClientRect().left + (circle.offsetWidth / 2);
        this._dragAndDropSlider(slider, circlePosition);
    },


    _calculateValueDiff: function(shift) {
        var wStep = this.container.clientWidth / (this.max - this.min) * this.step;
        var diff = Math.round(shift / wStep) * this.step;

        return diff;
    },


    _dragAndDropSlider: function(slider, startPosition) {
        var self = this;
        var startValue = slider.value;
        var side = slider === self.leftSlider ? 'left' : 'right';

        slider.elem.classList.add(this.id + '__slider_grabbed');

        function onMouseMove(event) {
            var value = startValue - self._calculateValueDiff(startPosition - event.clientX);
            self[side + 'Value'] = value;
        }

        function onMouseUp(event) {
            slider.elem.classList.remove(self.id + '__slider_grabbed');
            document.removeEventListener('mousemove', onMouseMove);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp, {once: true});
    },


    _trimValue: function(value, slider) {
        if (slider.max < value) {
            value = slider.value + Math.floor((slider.max - slider.value) / this.step) * this.step;
        } else if (value < slider.min) {
            value = slider.value - Math.floor((slider.value - slider.min) / this.step) * this.step;
        }

        return value;
    },


    _emitValueChangedEvent: function() {
        var event = new Event('rdsvaluechanged', { bubbles: true, cancelable: true });
        event.detail = [ this.leftValue, this.rightValue ];

        this.elem.dispatchEvent(event);
    }
};


Object.defineProperties(RangeDoubleSlider.prototype, {
    leftValue: {
        get: function() {
            return this.leftSlider.value;
        },
        set: function(value) {
            value = this._trimValue(value, this.leftSlider);

            if (value === this.leftSlider.value) return;

            this.rightSlider.min = value;
            this.leftSlider.value = value;
            this.leftSlider.valueElem.value = value;
            this.leftSlider.elem.style.width = (value - this.min) / (this.max - this.min) * 100 + '%';

            this._emitValueChangedEvent();
        },
    },

    rightValue: {
        get: function() {
            return this.rightSlider.value;
        },
        set: function(value) {
            value = this._trimValue(value, this.rightSlider);

            if (value === this.rightSlider.value) return;

            this.leftSlider.max = value;
            this.rightSlider.value = value;
            this.rightSlider.valueElem.value = value;
            this.rightSlider.elem.style.width = (this.max - value) / (this.max - this.min) * 100 + '%';

            this._emitValueChangedEvent();
        }
    }
});


RangeDoubleSlider.prototype.constructor = RangeDoubleSlider;

if (module) {
    module.exports = RangeDoubleSlider;
}