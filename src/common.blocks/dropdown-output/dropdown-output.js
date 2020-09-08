// ================= DropdownOutput CLASS ================= 
var BemEntity = require('../_bem-entity/_bem-entity.js');

function DropdownOutput(elem) {
    BemEntity.call(this);

    this.elem = elem;
    this._initializedCallback = [];

    this.setPostInit(function() {
        var self = this;
        var dropdownElem = this.elem.querySelector('.dropdown');
        var outputElem = this.elem.querySelector('.output');

        this.dropdown = dropdownElem.bemInstances['dropdown'];
        this.output = outputElem.bemInstances['output'];
        
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
    });
}

DropdownOutput.prototype = Object.create(BemEntity.prototype, {
    id: {
        value: 'dropdown-output',
        enumerable: true,
        writable: false,
        configurable: false,
    },

    open: {
        value: function(clicked) {
            this.dropdown.show(clicked);
        },
        enumerable: true,
        writable: true,
        configurable: true,
    },

    close: {
        value: function() {
            this.dropdown.hide();
        },
        enumerable: true,
        writable: true,
        configurable: true,
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
    }
});

if (module) {
    module.exports = DropdownOutput;
}