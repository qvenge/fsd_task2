function Button(elem, params) {
    this.elem = elem;

    this._init();
}

Object.defineProperties(Button.prototype, {
    id: {
        value: 'button',
        enumerable: true
    },

    _init: {
        value: function() {
            var self = this;

            this.elem.addEventListener('click', function(event) {
                var event = new Event('buttonclick', { bubbles: true });
                self.elem.dispatchEvent(event);
            });
        }
    }
});


if (module) {
    module.exports = Button;
}