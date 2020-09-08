function Dropdown(elem) {
    this.elem = elem;
    this._listener = null;
    this.isExpanded = false;

    this._init();
}

Dropdown.prototype = {
    id: 'dropdown',

    show: function(clicked) {
        if (this.isExpanded) {
            return false;
        }

        this.elem.classList.add(this.id + '_expanded');
        this.isExpanded = true;
        this._addListener(clicked);

        return true;
    },


    hide: function() {
        if (!this.isExpanded) {
            return false;
        }

        this.elem.classList.remove(this.id + '_expanded');
        this.isExpanded = false;
        this._removeListener();

        return true;
    },

    _init: function() {
        var self = this;

        this.elem.addEventListener('click', function(event) {
            event.fromDropdown = self;
        });

        this.elem.addEventListener('transitionstart', function(event) {
            if (self.isExpanded) {
                self.elem.style.clip = 'auto';
            }
            self._emitAnimationStartEvent();
        });

        this.elem.addEventListener('transitionend', function(event) {
            if (!self.isExpanded) {
                self.elem.style.clip = '';
            }
            self._emitAnimationEndEvent();
        });
    },


    _addListener: function(clicked) {
        if (!this._listener) {
            var self = this;

            this._listener = function(event) {
                if (event.fromDropdown === self) {
                    return;
                }
                
                self.hide();
            };

            if (clicked) {
                document.addEventListener('click', function() {
                    document.addEventListener('click', self._listener);
                }, { once: true });
            } else {
                document.addEventListener('click', self._listener);
            }
        }
    },


    _removeListener: function() {
        if (this._listener) {
            document.removeEventListener('click', this._listener);
            this._listener = null;
        }
    },


    _emitAnimationStartEvent: function() {
        var event = new Event('dropdownanimationstart', {bubbles: true, cancelable: true });
        this.elem.dispatchEvent(event);
    },
    

    _emitAnimationEndEvent: function() {
        var event = new Event('dropdownanimationend', {bubbles: true, cancelable: true });
        this.elem.dispatchEvent(event);
    }
}

Dropdown.prototype.constructor = Dropdown;


if (module) {
    module.exports = Dropdown;
}