function Input(elem) {
    this.elem = elem;

    var bemParams = elem.dataset.bem ? JSON.parse(elem.dataset.bem) : {};
    this.options = bemParams.input ? bemParams.input : {};

    if (this.options.type === 'date') this._initDateEvents();
}

Input.prototype = {
    _initDateEvents: function() {
        var input = this.elem;
        var previousValue = input.value;

        function validate(value) {
            switch (value.length) {
                case 0:
                    return true;
                case 1:
                    return /[0-3]/.test(value);
                case 2:
                    return /0[1-9]|[12][0-9]|3[01]/.test(value);
                case 3:
                    return /(0[1-9]|[12][0-9]|3[01])\./.test(value);
                case 4:
                    return /(0[1-9]|[12][0-9]|3[01])\.[01]/.test(value);
                case 5:
                    return /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])/.test(value);
                case 6:
                    return /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\./.test(value);
                default:
                    return /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{1,4}$/.test(value);
            }
        }

        input.addEventListener('keydown', function(event) {
            if (event.code === 'Backspace' && previousValue[previousValue.length - 1] === '.') {
                input.value = input.value.slice(0, -1);
            }
        });

        input.addEventListener('input', function(event) {
            var value = input.value;

            if (value.length > 0 && /[4-9]/.test(value[0])) {
                value = '0' + value;
            }

            if (value.length > 1 && value[1] === '.') {
                value = '0' + value;
            }

            if (value.length > 2 && value[2] !== '.') {
                value = value.slice(0, 2) + '.' + value.slice(2);
            }

            if (value.length > 3 && /[2-9]/.test(value[3])) {
                value = value.slice(0, 3) + '0' + value.slice(3);
            }

            if (value.length > 4 && value[4] === '.') {
                value = value.slice(0, 3) + '0' + value.slice(3);
            }
            
            if (value.length > 5 && value[5] !== '.') {
                value = value.slice(0, 5) + '.' + value.slice(5);
            }


            if (validate(value)) {
                input.value = previousValue = value;
            } else {
                input.classList.add('input_invalid');

                setTimeout(function() {
                    input.classList.remove('input_invalid');
                }, 500);

                input.value = previousValue;
            }
        });
    }
}


Input.prototype.constructor = Input;

if (module) {
    module.exports = Input;
}