var BemEntity = require('../../common.blocks/_bem-entity/_bem-entity.js');

function DatePicker(elem) {
    BemEntity.call(this);
    this.elem = elem;

    this.setPostInit(function() {
        var self = this;
        var calendar = this.elem.querySelector('.calendar').bemInstances['calendar'];
        var dropdown = this.elem.querySelector('.dropdown').bemInstances['dropdown'];
        var outputs = this.elem.querySelectorAll('.output');
        var arrival = outputs[0].bemInstances['output'];
        var departure = outputs[1].bemInstances['output'];
        var resetBtn = this.elem.querySelector('.' + this.id + '__reset-btn');
        var applyBtn = this.elem.querySelector('.' + this.id + '__apply-btn');
        var shownDate;

        if (arrival.value) {
            calendar.selectDate(arrival.value);
            shownDate = arrival.value;
        }

        if (departure.value) {
            calendar.selectDate(departure.value);
            shownDate = departure.value;
        }

        if (shownDate) {
            calendar.displayDate(shownDate);
        }

        this.elem.addEventListener('click', function(event) {
            if (outputs[0].contains(event.target) || outputs[1].contains(event.target)) {
                dropdown.show(true) || dropdown.hide();
            }
        });

        resetBtn.classList.toggle(this.id + '__reset-btn_hidden', !shownDate);
        resetBtn.addEventListener('click', function() {
            calendar.reset();
            //dropdown.hide();
        });

        applyBtn.addEventListener('click', function() {
            dropdown.hide();
        });

        this.elem.addEventListener('calendarstatechanged', function(event) {
            var dates = event.detail.selectedDates.sort().map(function(date) {
                return date.split('-').reverse().join('.')
            });
            arrival.value = dates[0] ? dates[0] : '';
            departure.value = dates[1] ? dates[1] : '';
            resetBtn.classList.toggle(self.id + '__reset-btn_hidden', !dates.length);
        });
    });
}

DatePicker.prototype = Object.create(BemEntity.prototype, {
    id: {
        value: 'date-picker',
        enumerable: true,
        writable: false,
        configurable: false
    }
});


DatePicker.prototype.constructor = DatePicker;

if (module) {
    module.exports = DatePicker;
}