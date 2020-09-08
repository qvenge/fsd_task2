function DropdownOutput(elem) {
    this.elem = elem;
    this._init();
}

DropdownOutput.prototype = {
    open: function(clicked) {
        this.dropdown.show(clicked);
    },

    close: function() {
        this.dropdown.hide();
    },

    _init: function() {
        var self = this;
        var dropdownElem = this.elem.querySelector('.dropdown');
        var outputElem = this.elem.querySelector('.output');

        this.dropdown = window.BEM.getEntityInstance(dropdownElem, 'dropdown');
        this.output = window.BEM.getEntityInstance(outputElem, 'output');
        
        outputElem.addEventListener('click', function() {
            self.dropdown.isExpanded ? self.dropdown.hide() : self.dropdown.show(true);
        });

        dropdownElem.addEventListener('dropdownanimationstart', function() {
            if (self.dropdown.isExpanded) {
                self.output.expand();
                self.elem.classList.add(self.id + '_expanding');
            } else {
                self.output.shrink();
                self.elem.classList.remove(self.id + '_expanded');
                self.elem.classList.add(self.id + '_shrinking');
            }
        });

        dropdownElem.addEventListener('dropdownanimationend', function() {
            if (self.dropdown.isExpanded) {
                self.elem.classList.remove(self.id + '_expanding');
                self.elem.classList.add(self.id + '_expanded');
            } else {
                self.elem.classList.remove(self.id + '_shrinking');
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