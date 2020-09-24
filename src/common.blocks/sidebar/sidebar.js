function Sidebar(elem, params) {
    this.elem = elem;
    this.params = params;

    this._init();
}


Object.defineProperties(Sidebar.prototype, {
    id: {
        value: 'sidebar',
        enumerable: true
    },

    stick: {
        value: function() {
            this.elem.classList.add(this.id + '_fixed');
        },
        enumerable: true,
        writable: true,
    },

    unstick: {
        value: function() {
            this.elem.classList.remvoe(this.id + '_fixed');
        },
        enumerable: true,
        writable: true,
    },

    _init: {
        value: function() {
            var self = this;
            var btn = this.elem.querySelector('.' + this.id + '__btn');

            btn.addEventListener('click', function() {
                self.elem.classList.toggle(self.id + '_open');
            });
        }
    }
});


if (module) {
    module.exports = Sidebar;
}