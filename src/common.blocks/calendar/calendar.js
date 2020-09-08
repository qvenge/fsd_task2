var MONTHS = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август', 
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

var MODS = ['single', 'multiple', 'range'];


function normalizeDate(dateString) {
    return dateString.split('.').reverse().join('-')
}

function dateToString(date) {
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

function isValidDate(date) {
    return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())
}

function stringToDateAndVerify(date) {
    if (typeof date === 'string') {
        date = new Date(normalizeDate(date));
    }

    if (!isValidDate(date)) {
        throw Error('Invalid Date');
    }

    return date;
}



// ======================== CALENDAR ==============================

function Calendar(elem) {
    this.elem = elem;

    this.init();
    this._initEvents();
}


Calendar.prototype = {
    id: 'calendar',

    init: function() {
        var bemParams = this.elem.dataset.bem && JSON.parse(this.elem.dataset.bem);

        this.options = (bemParams && bemParams[this.id]) || {};
        this.mode = MODS.indexOf(this.options.mode) !== -1 ? this.options.mode : 'single';
        this.date = new Date();
        this.isUpdating = false;
        this.dateContainer = this.elem.querySelector('.' + this.id + '__dates');
        this.selectedDates = Object.create(null);
        this.range = [];

        if (Array.isArray(this.options.dates) && this.options.dates.length) {
            this.options.dates.forEach(function(date) {
                this.selectDate(date);
            }, this);

            this.date = new Date(normalizeDate(this.options.dates[0]));
        }

        this._update();
    },

    selectDate: function(date) {
        date = stringToDateAndVerify(date);

        var dateString = dateToString(date);
        var targetElem = this.dateContainer.querySelector('.' + this.id + '__date[data-date="'+ dateString +'"');

        this._selectDate(dateString, targetElem);
    },


    unselectDate: function(date) {
        date = stringToDateAndVerify(date);

        var dateString = dateToString(date);
        var targetElem = this.dateContainer.querySelector('.' + this.id + '__date[data-date="'+ dateString +'"');

        this._unselectDate(dateString, targetElem);
    },

    nextMonth: function() {
        this.date.setMonth(this.date.getMonth() + 1);
        this._update();
    },

    previousMonth: function() {
        this.date.setMonth(this.date.getMonth() - 1);
        this._update();
    },

    getDates: function() {
        return Object.keys(this.selectedDates).map(function(dateString) {
            return new Date(dateString);
        });
    },

    displayCurrentMonth: function() {
        this.date = new Date();
        this._update();
    },

    displayDate: function(date) {
        date = stringToDateAndVerify(date);

        this.date = date;
        this._update();
    },

    reset: function() {
        var selectedElems = this.dateContainer.querySelectorAll('.' + this.id + '__date_selected');

        for (var i = 0; i < selectedElems.length; ++i) {
            selectedElems[i].classList.remove(this.id + '__date_selected');
        }

        this._clearRange();
        this.range = [];
        this.selectedDates = Object.create(null);
        this.displayCurrentMonth();

        this._emitCalendarStateChangedEvent();
    },

    _selectDate: function(dateString, targetElem) {
        if (dateString in this.selectedDates) {
            return false;
        }

        if (this.mode === 'single' || this.range.length >= 2) {
            this.reset();
        }

        this.selectedDates[dateString] = true;

        if (this.mode === 'range') {
            this.range.push(dateString);
            this.range.sort()
        }

        if (targetElem) {
            targetElem.classList.add(this.id + '__date_selected');

            if (targetElem.classList.contains(this.id + '__date_prev-month')) {
                this.previousMonth();
            } else if (targetElem.classList.contains(this.id + '__date_next-month')) {
                this.nextMonth();
            }
        }

        this._emitDateSelectedEvent(dateString);
        this._emitCalendarStateChangedEvent();

        return true;
    },

    _unselectDate: function(dateString, targetElem) {
        if (dateString in this.selectedDates) {
            delete this.selectedDates[dateString];

            if (this.mode === 'range') {
                this.range = this.range.filter(function(date) {
                    return date !== dateString;
                });
            }

            if (targetElem) {
                targetElem.classList.remove(this.id + '__date_selected');
            }

            this._emitDateUnselectedEvent(dateString);
            this._emitCalendarStateChangedEvent();

            return true;
        } 

        return false;
    },


    _initEvents: function() {
        var self = this;

        var prevMonthBtn = this.elem.querySelector('.' + this.id + '__prev-month-btn');
        var nextMonthBtn = this.elem.querySelector('.' + this.id + '__next-month-btn');

        prevMonthBtn.addEventListener('click', function() {
            self.previousMonth();
        });

        nextMonthBtn.addEventListener('click', function() {
            self.nextMonth();
        });


        this.dateContainer.addEventListener('mouseover', function(event) {
            if (self.range.length === 1 && event.target.classList.contains(self.id + '__date')) {
                var leftElem, rightDate;

                self._clearRange();

                if (self.range[0] === event.target.dataset.date) {
                    return;
                }

                if (self.range[0] < event.target.dataset.date) {
                    leftElem = self.dateContainer.querySelector('.' + self.id + '__date_selected');
                    rightDate = event.target.dataset.date;
                } else {
                    leftElem = event.target;
                    rightDate = self.range[0];
                }

                if (!leftElem) {
                    leftElem = self.dateContainer.firstChild;
                } else {
                    leftElem.classList.add(self.id + '__date_ranged_first');
                }

                while (leftElem && leftElem.dataset.date <= rightDate) {
                    if (leftElem.dataset.date === rightDate) {
                        leftElem.classList.add(self.id + '__date_ranged_last');
                    }
                    leftElem.classList.add(self.id + '__date_ranged');
                    leftElem = leftElem.nextElementSibling;
                }
            }
        });


        this.dateContainer.addEventListener('mouseleave', function(event) {
            if (self.range.length === 1) {
                self._clearRange();
            }
        });


        this.dateContainer.addEventListener('click', function(event) {
            if (!event.target.classList.contains(self.id + '__date')) {
                return;
            }

            var target = event.target;
            var dateString = target.dataset.date;

            self._unselectDate(dateString, target) || self._selectDate(dateString, target);
        });
    },


    _update: function() {
        if (this.isUpdating) {
            return false;
        }

        var title = this.elem.querySelector('.' + this.id + '__month-year');
        var date = new Date(this.date.getFullYear(), this.date.getMonth());
        var today = dateToString(new Date());
        var dateIterator = new Date(date.getFullYear(), date.getMonth());
        var leftShift = dateIterator.getDay() === 0 ? 6 : (dateIterator.getDay() - 1);

        dateIterator.setDate(dateIterator.getDate() - leftShift);

        // set Month Year title
        title.textContent = MONTHS[date.getMonth()] + ' ' + date.getFullYear();

        // clean dateContainer
        while (this.dateContainer.firstChild) this.dateContainer.removeChild(this.dateContainer.lastChild);

        do {
            var dateString = dateToString(dateIterator);
            var dateElem = document.createElement('DIV');

            dateElem.className = this.id + '__date';
            dateElem.textContent = dateIterator.getDate();
            dateElem.dataset.date = dateString;

            if (dateString in this.selectedDates) {
                dateElem.classList.add(this.id + '__date_selected')
            }

            if (dateIterator.getMonth() < date.getMonth()) {
                dateElem.classList.add(this.id + '__date_prev-month');
            } else  if (dateIterator.getMonth() > date.getMonth()) {
                dateElem.classList.add(this.id + '__date_next-month');
            }
            
            if (dateString === today) {
                dateElem.classList.add(this.id + '__date_today');
            }

            if (this.range.length === 2) {
                if (dateString === this.range[0]) {
                    dateElem.classList.add(this.id + '__date_ranged', this.id + '__date_ranged_first');
                } else if (dateString === this.range[1]) {
                    dateElem.classList.add(this.id + '__date_ranged', this.id + '__date_ranged_last');
                } else if (this.range[0] < dateString && dateString < this.range[1]) {
                    dateElem.classList.add(this.id + '__date_ranged');
                }
            }

            this.dateContainer.appendChild(dateElem);
            dateIterator.setDate(dateIterator.getDate() + 1);
        } while (dateIterator.getDay() !== 1 || dateIterator.getMonth() === date.getMonth());

        this.isUpdating = false;

        return true;
    },


    _clearRange: function() {
        var rangedElems = this.dateContainer.querySelectorAll('.' + this.id + '__date_ranged');

        if (rangedElems.length) {
            rangedElems[0].classList.remove(this.id + '__date_ranged_first');
            rangedElems[rangedElems.length - 1].classList.remove(this.id + '__date_ranged_last');

            for (var i = 0; i < rangedElems.length; ++i) {
                rangedElems[i].classList.remove(this.id + '__date_ranged');
            }
        }
    },

    _emitDateSelectedEvent: function(dateString) {
        var event = new Event('dateselected', { bubbles: true, cancelable: true });
        event.detail = { date: new Date(dateString) };
        this.elem.dispatchEvent(event);
    },

    _emitDateUnselectedEvent: function(dateString) {
        var event = new Event('dateunselected', { bubbles: true, cancelable: true });
        event.detail = { date: new Date(dateString) };
        this.elem.dispatchEvent(event);
    },

    _emitCalendarStateChangedEvent: function() {
        var event = new Event('calendarstatechanged', { bubbles: true, cancelable: true });
        event.detail = { selectedDates: Object.keys(this.selectedDates) };
        this.elem.dispatchEvent(event);
    },
}


Calendar.prototype.constructor = Calendar;

if (module) {
    module.exports = Calendar;
}