// ================= DROPDOWN CLASS ================= 
function Dropdown(elem) {
    this.elem = elem;
}

Dropdown._expanded = null;
Dropdown._listener = null;

(function() {
    this.id = 'dropdown';

    this.init = function() {
        this.display = this.elem.querySelector('.' + this.id + '__output');
        var self = this;
        this.isExpanded = false;

       Object.defineProperty(this, 'defaultOutput', {
            value: this.display.textContent,
            writable: false,
            enumerable: true,
            configurable: false
       });

        this.display.parentElement.addEventListener('click', function(event) {
            self.isExpanded ? self.close() : self.open();
        });
    };


    this.open = function() {
        if (Dropdown._expanded) Dropdown._expanded.close();
        Dropdown._expanded = this;
        this.elem.classList.add(this.id + '_expanded');
        this.isExpanded = true;
        this._addListener();
    };


    this.close = function() {
        if (Dropdown._expanded === this) Dropdown._expanded = null;
        this.elem.classList.remove(this.id + '_expanded');
        this.isExpanded = false;
        this._removeListener();
    };
    

    this.setDefaultOutput = function() {
        this.output = this.defaultOutput;
    };


    this._addListener = function() {
        if (!Dropdown._listener) {
            var self = this;

            Dropdown._listener = function(event) {
                if (self.elem.contains(event.target)) {
                    return;
                }
        
                Dropdown._expanded.close();
            }

            document.addEventListener('click', function() {
                document.addEventListener('click', Dropdown._listener);
            }, { once: true });
        }
    };


    this._removeListener = function() {
        if (Dropdown._listener) {
            document.removeEventListener('click', Dropdown._listener);
            Dropdown._listener = null;
        }
    };
}).call(Dropdown.prototype);


Object.defineProperties(Dropdown.prototype, {
    output: {
        get: function() {
            return this.display.textContent;
        },

        set: function(value) {
            this.display.textContent = value;
        },
        enumerable: true,
        configurable: false
    }
});


if (module) {
    module.exports = Dropdown;
}