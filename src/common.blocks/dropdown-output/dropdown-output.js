function DropdownOutput(elem) {
    this.elem = elem;
    this._init();
}

DropdownOutput.prototype = {
    open: function() {
        this.hideable.show();
    },

    close: function() {
        this.hideable.hide();
    },

    _init: function() {
        var self = this;
        var hideableElem = this.elem.querySelector('.hideable-block');
        var outputElem = this.elem.querySelector('.output');

        this.hideable = window.BEM.getEntityInstance(hideableElem, 'hideable-block');
        this.output = window.BEM.getEntityInstance(outputElem, 'output');
        
        this.hideable.addController(outputElem);

        hideableElem.addEventListener('hideableblockanimationstart', function() {
            self.elem.classList.toggle(self.id + '_expanded');
            if (!self.hideable.isHidden) {
                self.output.expand();
            }
        });

        hideableElem.addEventListener('hideableblockanimationend', function() {
            if (self.hideable.isHidden) {
                self.output.shrink();
            }
        });
    }
};

Object.defineProperties(DropdownOutput.prototype, {
    id: {
        value: 'dropdown-output',
        enumerable: true,
        writable: false,
        configurable: false,
    },

    value: {
        get: function() {
            return this.output.value;
        },
        set: function(value) {
            return this.output.value = value;
        },
        enumerable: true,
        configurable: false
    },
    
    placeholder: {
        get: function() {
            return this.output.placeholder;
        },
        enumerable: true,
        configurable: false
    },
});

DropdownOutput.prototype.constructor = DropdownOutput;

if (module) {
    module.exports = DropdownOutput;
}