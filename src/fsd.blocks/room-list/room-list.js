function RoomList(elem) {
    this.elem = elem;
}


var proto = RoomList.prototype;

proto.id = 'room-list';

proto.init = function() {
    var self = this;

    var words = {
        bedrooms: ['спальня', 'спальни', 'спален'],
        beds: ['кровать', 'кровати', 'кроватей'],
        bathrooms: ['ванная комната', 'ванные комнаты', 'ванных комнат'],
    }

    this.elem.addEventListener('qlstatechanged', function() {
        var dropdown = self.elem.querySelector('.' + self.id + '__dropdown').bemEntities['dropdown'];
        var list = self.elem.querySelector('.' + self.id + '__list').bemEntities['quantitative-list'];

        var output = list.getState().reduce(function(memo, item) {
            if (item.value === 0) return memo;
            if (memo) memo += ', ';
            return memo + self.getOutput(item.value, words[item.name]);
        }, '');

        dropdown.output = output ? output : dropdown.defaultOutput;
    });
};


proto.getOutput = function(number, words) {
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
};


if (module) {
    module.exports = RoomList;
}