function DatePicker(elem) {
    this.elem = elem;

    this._init();
}

Object.defineProperties(DatePicker.prototype, {
    id: {
        value: 'date-picker',
        enumerable: true
    },

    _init: {
        value: function() {
            var shownDate;
            var self = this;
            var calendarElem = this.elem.querySelector('.calendar');
            var dropdownElem = this.elem.querySelector('.dropdown');
            var outputElems = this.elem.querySelectorAll('.output');
            var resetBtn = this.elem.querySelector('.' + this.id + '__reset-btn');
            var applyBtn = this.elem.querySelector('.' + this.id + '__apply-btn');

            var calendar = window.BEM.getEntityInstance(calendarElem, 'calendar');
            var dropdown = window.BEM.getEntityInstance(dropdownElem, 'dropdown');
            var arrival = window.BEM.getEntityInstance(outputElems[0], 'output');
            var departure = window.BEM.getEntityInstance(outputElems[1], 'output');
    
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
                if (outputElems[0].contains(event.target) || outputElems[1].contains(event.target)) {
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
        }
    }
});


DatePicker.prototype.constructor = DatePicker;

if (module) {
    module.exports = DatePicker;
}