function CalendarCard(elem) {
    this.elem = elem;

    this._init();
}

Object.defineProperties(CalendarCard.prototype, {
    id: {
        value: 'calendar-card',
        enumerable: true
    },


    reset: {
        value: function() {
            if (this._emitCalendarCardResetEvent()) {
                this.calendar.reset();
                this.calendar.displayCurrentMonth();
            }
        },
        enumerable: true,
        writable: true,
        configurable: true
    },

    _init: {
        value: function() {
            var self = this;
            var calendarElem = this.elem.querySelector('.calendar');
            var applyBtn = this.elem.querySelector('.' + this.id + '__apply-btn');
            this.resetBtn = this.elem.querySelector('.' + this.id + '__reset-btn');

            this.calendar = window.BEM.getEntityInstance(calendarElem, 'calendar');

            this.resetBtn.addEventListener('click', function() {
                self.reset();
            });
    
            applyBtn.addEventListener('click', function() {
                self._emitCalendarCardApplyEvent();
            });
    
            this.elem.addEventListener('calendarstatechanged', function(event) {
                self._adjustResetBtn(event.detail.selectedDates);
            });

            this._adjustResetBtn(this.calendar.getDates());
        }
    },

    _adjustResetBtn: {
        value: function(dates) {
            if (dates.length) {
                this.resetBtn.classList.remove(this.id + '__reset-btn_hidden');
            } else {
                this.resetBtn.classList.add(this.id + '__reset-btn_hidden');
            }
        }
    },

    _emitCalendarCardResetEvent: {
        value: function() {
            var event = new Event('calendarcardreset', { bubbles: true, cancelable: true });
            return this.elem.dispatchEvent(event);
        }
    },

    _emitCalendarCardApplyEvent: {
        value: function() {
            var event = new Event('calendarcardapply', { bubbles: true });
            event.detail = { dates: this.calendar.getDates(true) };
            return this.elem.dispatchEvent(event);
        }
    }
});


CalendarCard.prototype.constructor = CalendarCard;

if (module) {
    module.exports = CalendarCard;
}