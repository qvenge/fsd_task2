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
            var calendarCardElem = this.elem.querySelector('.calendar-card');
            var dropdownElem = this.elem.querySelector('.dropdown');
            var outputElems = this.elem.querySelectorAll('.output');

            var calendarCard = window.BEM.getEntityInstance(calendarCardElem, 'calendar-card');
            var dropdown = window.BEM.getEntityInstance(dropdownElem, 'dropdown');
            var arrival = window.BEM.getEntityInstance(outputElems[0], 'output');
            var departure = window.BEM.getEntityInstance(outputElems[1], 'output');
    
            if (arrival.value) {
                calendarCard.calendar.selectDate(arrival.value);
                shownDate = arrival.value;
            }
    
            if (departure.value) {
                calendarCard.calendar.selectDate(departure.value);
                shownDate = departure.value;
            }
    
            if (shownDate) {
                calendarCard.calendar.displayDate(shownDate);
            }
    
            this.elem.addEventListener('click', function(event) {
                if (outputElems[0].contains(event.target) || outputElems[1].contains(event.target)) {
                    dropdown.show(true) || dropdown.hide();
                }
            });
    
            this.elem.addEventListener('calendarcardreset', function() {
                arrival.value = '';
                departure.value = '';
                //dropdown.hide();
            });
    
            this.elem.addEventListener('calendarcardapply', function(event) {
                var dates = event.detail.dates.sort().map(function(date) {
                    return date.split('-').reverse().join('.')
                });
                arrival.value = dates[0] ? dates[0] : '';
                departure.value = dates[1] ? dates[1] : '';
                dropdown.hide();
            });
        }
    }
});


DatePicker.prototype.constructor = DatePicker;

if (module) {
    module.exports = DatePicker;
}