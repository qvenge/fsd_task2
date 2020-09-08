function getOutput(number, words) {
    var num = number % 100;
    if (num > 19) {
        num = num % 10;
    }
    switch (num) {
        case 1: {
            return number + ' ' + words[0];
        }
        case 2: case 3: case 4: {
            return number + ' ' + words[1];
        }
        default: {
            return number + ' ' + words[2];
        }
    }
}



function RoomList(elem) {
    this.elem = elem;

    this._init()
}


Object.defineProperties(RoomList.prototype, {
    id: {
        value: 'room-list',
        enumerable: true
    },

    _init: {
        value: function() {
            var listElem = this.elem.querySelector('.quantitative-list');
            var dropdownElem = this.elem.querySelector('.dropdown-output');
            var list = window.BEM.getEntityInstance(listElem, 'quantitative-list');
            var dropdownOutput = window.BEM.getEntityInstance(dropdownElem, 'dropdown-output');

            var words = {
                bedrooms: ['спальня', 'спальни', 'спален'],
                beds: ['кровать', 'кровати', 'кроватей'],
                bathrooms: ['ванная комната', 'ванные комнаты', 'ванных комнат'],
            }

            this.elem.addEventListener('qlstatechanged', function() {
                var output = list.getState().reduce(function(memo, item) {
                    if (item.value === 0) return memo;
                    if (memo) memo += ', ';
                    return memo + getOutput(item.value, words[item.name]);
                }, '');

                dropdownOutput.value = output ? output : dropdownOutput.placeholder;
            });
        }
    }
});


if (module) {
    module.exports = RoomList;
}