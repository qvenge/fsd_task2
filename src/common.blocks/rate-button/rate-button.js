function RateButton(elem) {
    this.elem = elem;
    this.value = 0;

    this.init();
}

RateButton.prototype = {
    id: 'rate-button',

    init: function() {
        var self = this;

        this.elem.addEventListener('click', function(event) {
            if (event.target.classList.contains(self.id + '__star')) {

                var checkedStar = self.elem.querySelector('.' + self.id + '__star_checked');

                if (checkedStar) {
                    checkedStar.classList.remove(self.id + '__star_checked');
                }

                event.target.classList.add(self.id + '__star_checked');

                var stars = self.elem.getElementsByClassName(self.id + '__star');

                for (var i = 0; i < stars.length; ++i) {
                    if (stars[i] === event.target) {
                        break;
                    };
                }

                self.value = stars.length - i;
            }
        });
    }
};


Object.defineProperties(RateButton.prototype, {
    value: {
        get: function() {
            var stars = this.elem.getElementsByClassName(this.id + '__star');

            for (var i = 0; i < stars.length; ++i) {
                if (stars[i].contains(this.id + '__star_checked')) {
                    break;
                };
            }

            return stars.length - i;
        },
        set: function(value) {
            var stars = this.elem.getElementsByClassName(this.id + '__star');
            stars = Array.prototype.slice.call(stars).reverse();

            if (value < 0) {
                value = 0;
            }

            if (stars.length < value) {
                value = stars.length;
            }

            for (var i = 0; i < stars.length; ++i) {
                // if (i === value - 1) {
                //     stars[i].classList.add(this.id + '__star_checked');
                // } else {
                //     stars[i].classList.add(this.id + '__star_checked');
                // }

                stars[i].classList.toggle(this.id + '__star_checked', !(value - i - 1))
            }
        }
    }
})

RateButton.prototype.constructor = RateButton;

if (module) {
    module.exports = RateButton;
}