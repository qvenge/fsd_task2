function GuestList(elem) {
    this.elem = elem;
}


var proto = GuestList.prototype;

proto.id = 'guest-list';


proto.postInit = function() {
    var self = this;
    var resetBtn = this.elem.querySelector('.' + this.id + '__reset-btn');
    var applyBtn = this.elem.querySelector('.' + this.id + '__apply-btn');
    var dropdownOutput = this.elem.querySelector('.dropdown-output').bemInstances['dropdown-output'];
    var list = this.elem.querySelector('.quantitative-list').bemInstances['quantitative-list'];

    dropdownOutput.addInitializedCallback(updateOutput);

    function updateOutput() {
        var listState = list.getState();
        var guestQuantity = 0;
        var babiesQuantity = 0;
        var output = [];

        listState.forEach(function(st) {
            st.name === 'babies' ? (babiesQuantity += st.value) : (guestQuantity += st.value);
        });

        guestQuantity && (output.push(self.getOutput(guestQuantity, ['гость', 'гостя', 'гостей'])));
        babiesQuantity && (output.push(self.getOutput(babiesQuantity, ['младенец', 'младенца', 'младенцов'])));

        dropdownOutput.value = output.join(', ');
        resetBtn.classList.toggle(self.id + '__reset-btn_hidden', !output.length);
    }

    self.elem.addEventListener('qlstatechanged', function() {
        updateOutput();
    });

    resetBtn.addEventListener('click', function() {
        list.reset();
        dropdownOutput.close();
    });

    applyBtn.addEventListener('click', function() {
        dropdownOutput.close();
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