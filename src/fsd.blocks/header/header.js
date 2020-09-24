function Header(elem, params) {
    this.elem = elem;

    this._init();
}

Object.defineProperties(Header.prototype, {
    id: {
        value: 'header',
        enumerable: true,
    },

    _init: {
        value: function() {
            var self = this;
            var burger = this.elem.querySelector('.' + this.id + '__burger');
            var menuWrapper = this.elem.querySelector('.' + this.id + '__menu-wrapper');
            var defaultMenuWrapperHeightStyle = menuWrapper.style.height;
            var body = window.BEM.getEntityInstance(document.body, 'body');

            var timerId = null;

            burger.addEventListener('click', function(event) {
                if (self.elem.classList.contains(self.id + '_active')) {
                    self.elem.classList.remove(self.id + '_active');
                    menuWrapper.style.height = defaultMenuWrapperHeightStyle;
                    timerId = setTimeout(function() {
                        menuWrapper.classList.remove(self.id + '__menu-wrapper_with-border-top');
                    }, 300);
                    body.unlock(self.id);
                } else {
                    self.elem.classList.add(self.id + '_active');
                    menuWrapper.style.height = menuWrapper.firstElementChild.offsetHeight + 'px';
                    menuWrapper.classList.add(self.id + '__menu-wrapper_with-border-top');
                    clearTimeout(timerId);
                    timerId = null;
                    body.lock(self.id, 1000);
                }
                
            });

        }
    }
});


if (module) {
    module.exports = Header;
}