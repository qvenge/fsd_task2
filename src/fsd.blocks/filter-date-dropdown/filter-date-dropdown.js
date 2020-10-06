function FilterDateDropdown(elem) {
    this.elem = elem;

    this._init();
}

Object.defineProperties(FilterDateDropdown.prototype, {
    id: {
        value: 'filter-date-dropdown',
        enumerable: true
    },

    _init: {
        value: function() {
            var initialDates = [];
            var self = this;
            var calendarCardElem = this.elem.querySelector('.calendar-card');
            var hideableElem = this.elem.querySelector('.hideable-block');
            var outputElem = this.elem.querySelector('.output');

            var calendarCard = window.BEM.getEntityInstance(calendarCardElem, 'calendar-card');
            var hideableBlock = window.BEM.getEntityInstance(hideableElem, 'hideable-block');
            var output = window.BEM.getEntityInstance(outputElem, 'output');

            var MONTHS = calendarCard.calendar.constructor.MONTHS.map(function(month) {
                return month.slice(0, 3).toLowerCase();
            });


            hideableBlock.addController(outputElem);

            
            output.value.split(' - ').forEach(function(dateString) {
                var day_month = dateString.split(' ');

                if (day_month.length === 2) {
                    var day = parseInt(day_month[0]);
                    var monthIndex = MONTHS.indexOf(day_month[1]);

                    if (day && ~monthIndex) {
                        var date = new Date();
                        date.setMonth(monthIndex, day);
                        initialDates.push(date);
                    }
                }
            });

            if (initialDates.length === 2) {
                calendarCard.calendar.selectDate(initialDates[0]);
                calendarCard.calendar.selectDate(initialDates[1]);
                calendarCard.calendar.displayDate(initialDates[1]);
            } else {
                calendarCard.reset();
                output.value = '';
            }
            

            this.elem.addEventListener('calendarcardreset', function(event) {
                output.value = '';
            });
    
            this.elem.addEventListener('calendarcardapply', function(event) {
                if (event.detail.dates.length === 2) {
                    var dates = event.detail.dates.sort().map(function(dateString) {
                        var date = new Date(dateString);
                        var month = calendarCard.calendar.constructor.MONTHS[date.getMonth()].slice(0, 3);
                        return date.getDate() + ' ' + month.toLowerCase();
                    });
                    output.value = dates.join(' - ');
                } else {
                    output.value = '';
                }
                hideableBlock.hide();
            });
        }
    }
});


FilterDateDropdown.prototype.constructor = FilterDateDropdown;

if (module) {
    module.exports = FilterDateDropdown;
}