function Image(elem) {
    var bemParams = elem.dataset.bem && JSON.parse(elem.dataset.bem);

    this.elem = elem;
    this.options = (bemParams && bemParams[this.id]) || {};

    this._init();
}

Object.defineProperties(Image.prototype, {
    id: {
        value: 'image',
        enumerable: true,
    },

    _init: {
        value: function() {
            this.src = this.elem.dataset.src;
            this.elem.firstElementChild.style.backgroundImage = 'url(' + this.src + ')';
        }
    }
});

if (module) {
    module.exports = Image;
}