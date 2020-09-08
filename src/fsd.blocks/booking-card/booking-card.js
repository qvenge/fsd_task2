var BemEntity = require('../../common.blocks/_bem-entity/_bem-entity.js');

function valueToString(value) {
    value = String(value);
    var result = value.slice(-3);

    for (var i = -3; i > -value.length; i -= 3) {
        result = value.slice(i - 3, i) + ' ' + result;
    }

    return result;
}

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
};

function BookingCard(elem) {
    BemEntity.call(this);
    this.elem = elem;

    this.setPostInit(function() {
        var self = this;
        var rentCost = this.elem.querySelector('.' + this.id + '__cost-item_rent');
        var priceField = this.elem.querySelector('.' + this.id + '__price-field');
        var totalField = this.elem.querySelector('.' + this.id + '__total-sum');
        var calendar = this.elem.querySelector('.calendar').bemInstances['calendar'];
        var price = parseInt(priceField.textContent.replace(' ', ''));

        function setCosts(dates) {
            dates = dates.sort().map(function(date) {
                return new Date(date);
            });

            var days = dates.length === 2
                ? Math.ceil(Math.abs((dates[1].getTime() - dates[0].getTime()) / 86400000))
                : dates.length === 1 ? 1 : 0;

            rentCost.children[0].textContent = valueToString(price) + '₽ x ' + getOutput(days, ['сутки', 'суток', 'суток']);
            rentCost.children[1].textContent = valueToString(price * days) + '₽';
            rentCost.setAttribute('data-cost', price * days);

            var costItems = Array.prototype.slice.call(rentCost.parentElement.children);

            var totalCost = costItems.reduce(function(sum, item) {
                return sum + parseFloat(item.dataset.cost);
            }, 0);

            totalField.textContent = totalCost > 0 ? valueToString(totalCost) : 0;
        }

        setCosts(calendar.getDates());

        this.elem.addEventListener('calendarstatechanged', function(event) {
            setCosts(event.detail.selectedDates);
        });
    });
}


BookingCard.prototype = Object.create(BemEntity.prototype, {
    id: {
        value: 'booking-card',
        enumerable: true,
        writable: false,
        configurable: false
    }
});

if (module) {
    module.exports = BookingCard;
}