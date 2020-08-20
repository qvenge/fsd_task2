function GuestList(elem) {
    this.elem = elem;
}


var proto = GuestList.prototype;

proto.id = 'guest-list';


proto.postInit = function() {
    var self = this;
    var reset = this.elem.querySelector('.' + this.id + '__reset-btn');
    var apply = this.elem.querySelector('.' + this.id + '__apply-btn');
    var dropdown = this.elem.querySelector('.dropdown').bemInstances['dropdown'];
    var list = this.elem.querySelector('.quantitative-list').bemInstances['quantitative-list'];

    this.elem.addEventListener('qlstatechanged', function() {
        var listState = list.getState();
        var guestQuantity = 0;
        var babiesQuantity = 0;
        var output = [];

        listState.forEach(function(st) {
            st.name === 'babies' ? (babiesQuantity += st.value) : (guestQuantity += st.value);
        });

        guestQuantity && (output.push(self.getOutput(guestQuantity, ['гость', 'гостя', 'гостей'])));
        babiesQuantity && (output.push(self.getOutput(babiesQuantity, ['младенец', 'младенца', 'младенцов'])));

        dropdown.output = output.length ? output.join(', ') : dropdown.defaultOutput;
    });

    reset.addEventListener('click', function() {
        list.reset();
        dropdown.close();
    });

    apply.addEventListener('click', function() {
        dropdown.close();
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
    module.exports = GuestList;
}