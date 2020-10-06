function Sidebar(elem, params) {
    this.elem = elem;
    this.params = params;
    this.isOpen = false;
    this.btn = null;
    this.contentWrapper = null;
    this.transitionDuration = 0.3;

    this._init();
}


Object.defineProperties(Sidebar.prototype, {
    id: {
        value: 'sidebar',
        enumerable: true
    },

    open: {
        value: function() {
            this._open();
            this.isOpen = true;
        },
        enumerable: true,
        writable: true
    },

    close: {
        value: function() {
            this._close();
            this.isOpen = false;
        },
        enumerable: true,
        writable: true
    },

    stick: {
        value: function() {
            if (this.isOpen) {
                this._open();
            }

            this.elem.classList.add(this.id + '_fixed');
        },
        enumerable: true,
        writable: true,
    },

    unstick: {
        value: function() {
            this._close();
            this.elem.classList.remove(this.id + '_fixed');
        },
        enumerable: true,
        writable: true,
    },

    _init: {
        value: function() {
            var self = this;

            this.btn = this.elem.querySelector('.' + this.id + '__btn');
            this.content = this.elem.querySelector('.' + this.id + '__content');

            this.content.parentElement.addEventListener('click', function(event) {
                if (event.currentTarget === event.target) {
                    self.close();
                }
            });

            this.btn.addEventListener('click', function() {
                self.isOpen ? self.close() : self.open();
            });
        }
    },

    _open: {
        value: function() {
            var body = window.BEM.getEntityInstance(document.body, 'body');

            this.elem.classList.add(this.id + '_open');
            this.content.style.right = 'calc(100% - ' + this.content.offsetWidth + 'px)';
            this.btn.style.left = this.content.offsetWidth + 'px';
            body.lock(this.id, 998);
        }
    },

    _close: {
        value: function() {
            var body = window.BEM.getEntityInstance(document.body, 'body');
            
            // setTimeout((function() {
            //     this.elem.classList.remove(this.id + '_open');
            // }).bind(this), this.transitionDuration * 1000);
            this.elem.classList.remove(this.id + '_open');
            this.content.style.right = '';
            this.btn.style.left = '';
            body.unlock(this.id);
        }
    }
});


if (module) {
    module.exports = Sidebar;
}