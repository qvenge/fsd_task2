function Output(elem) {
    this.elem = elem;

    this._output = this.elem.querySelector('.' + this.id + '__field');
    this.expanded = this.elem.classList.contains(this.id + '_expanded');
    this._input = this.elem.querySelector('.' + this.id + '__input');

    var bemParams = this.elem.dataset.bem && JSON.parse(this.elem.dataset.bem);
    this.options = (bemParams && bemParams[this.id]) || {};

    Object.defineProperty(this, 'placeholder', {
        value: this._input.placeholder || '',
        enumerable: true,
        writable: true,
        configurable: false
    });

    this.value = this._input.value;
}

Output.prototype = {
    id: 'output',

    reset: function() {
        this.value = '';
    },

    expand: function() {
        this.elem.classList.add(this.id + '_expanded');
    },

    shrink: function() {
        this.elem.classList.remove(this.id + '_expanded');
    }
};

Output.prototype.constructor = Output;


Object.defineProperties(Output.prototype, {
    value: {
        get: function() {
            return this._input.value;
        },

        set: function(value) {
            value = ((value || value === 0) ? value : '');

            this._input.value = value;
            this._output.textContent = value === '' ? this.placeholder : value;
        },
        enumerable: true,
        configurable: false
    }
});


if (module) {
    module.exports = Output;
}