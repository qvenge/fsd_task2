// ================= OutputDropdown CLASS ================= 
function OutputDropdown(elem) {
    this.elem = elem;
    this.display = elem.querySelector('.' + this.id + '__output');

    this.init();
}

OutputDropdown._expanded = null;
OutputDropdown._listener = null;

(function() {
    this.id = 'output-dropdown';

    this.init = function() {
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
        if (OutputDropdown._expanded) OutputDropdown._expanded.close();
        OutputDropdown._expanded = this;
        this.elem.classList.add(this.id + '_expanded');
        this.isExpanded = true;
        this._addListener();
    };


    this.close = function() {
        if (OutputDropdown._expanded === this) OutputDropdown._expanded = null;
        this.elem.classList.remove(this.id + '_expanded');
        this.isExpanded = false;
        this._removeListener();
    };
    

    this.setDefaultOutput = function() {
        this.output = this.defaultOutput;
    };


    this._addListener = function() {
        if (!OutputDropdown._listener) {
            var self = this;

            OutputDropdown._listener = function(event) {
                if (self.elem.contains(event.target)) {
                    return;
                }
        
                OutputDropdown._expanded.close();
            }

            document.addEventListener('click', function() {
                document.addEventListener('click', OutputDropdown._listener);
            }, { once: true });
        }
    };


    this._removeListener = function() {
        if (OutputDropdown._listener) {
            document.removeEventListener('click', OutputDropdown._listener);
            OutputDropdown._listener = null;
        }
    };
}).call(OutputDropdown.prototype);


Object.defineProperties(OutputDropdown.prototype, {
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
    module.exports = OutputDropdown;
}