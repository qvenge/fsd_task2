function Header(elem, params) {
    this.elem = elem;

    this._init();
}

Object.defineProperties(Header.prototype, {
    id: {
        value: 'header',
        enumerable: true,
    },

    openMenu: {
        value: function() {
            this.elem.classList.add(this.id + '_active');
            this.hideableBlock.show();
            this.menuWrapper.classList.add(this.id + '__menu-wrapper_with-border-top');
            this.body.lock(this.id, 1000, (function() {
                this.closeMenu();
            }).bind(this));
        },
        enumerable: true,
        writable: true,
        configurable: true
    },

    closeMenu: {
        value: function() {
            this.elem.classList.remove(this.id + '_active');
            this.hideableBlock.hide();
            this.body.unlock(this.id);
        },
        enumerable: true,
        writable: true,
        configurable: true
    },

    _init: {
        value: function() {
            var self = this;
            var burger = this.elem.querySelector('.' + this.id + '__burger');
            var hideableElem = this.elem.querySelector('.hideable-block');

            this.menuWrapper = this.elem.querySelector('.' + this.id + '__menu-wrapper');
            this.body = window.BEM.getEntityInstance(document.body, 'body');
            this.hideableBlock = window.BEM.getEntityInstance(hideableElem, 'hideable-block');

            this._resizeHandler();

            window.addEventListener('optimizedResize', this._resizeHandler.bind(this));

            burger.addEventListener('click', function(event) {
                if (self.elem.classList.contains(self.id + '_active')) {
                    self.closeMenu()
                } else {
                    self.openMenu();
                }
            });

            hideableElem.addEventListener('hideableblockanimationend', function() {
                if (self.hideableBlock.isHidden) {
                    self.menuWrapper.classList.remove(self.id + '__menu-wrapper_with-border-top');
                }
            });

        }
    },

    _resizeHandler: {
        value: function(event) {
            if (document.body.classList.contains('body_desktop')) {
                this.hideableBlock.show(true);
                this.body.unlock(this.id);
            } else if (this.elem.classList.contains(this.id + '_active')) {
                this.hideableBlock.show(true);
                this.body.lock(this.id, 1000, (function() {
                    this.closeMenu();
                }).bind(this));
            } else  {
                this.hideableBlock.hide(true);
                this.body.unlock(this.id);
            }
        } 
    }
});


if (module) {
    module.exports = Header;
}