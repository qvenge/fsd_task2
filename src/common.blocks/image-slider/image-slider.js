function ImageSlider(elem) {
    var bemParams = elem.dataset.bem && JSON.parse(elem.dataset.bem);

    this.elem = elem;
    this._currentIndex = undefined;
    this._images = null;
    this._slideshowTimerId = null;
    this.options = (bemParams && bemParams[this.id]) || {};

    this._init();
}

Object.defineProperties(ImageSlider.prototype, {
    id: {
        value: 'image-slider',
        enumerable: true,
    },

    next: {
        value: function() {
            return this.goTo(this._currentIndex + 1);
        },
        enumerable: true,
        writable: true
    },

    prev: {
        value: function() {
            return this.goTo(this._currentIndex - 1);
        },
        enumerable: true,
        writable: true
    },

    goTo: {
        value: function(index) {
            var prevIndex = this._currentIndex;

            if (this.isValidIndex(index)) {
                index = (index < 0 ? this.length : 0) + index % this.length;

                if (prevIndex !== index) {
                    if (prevIndex !== undefined) {
                        this._images[prevIndex].classList.remove(this.id + '__image_current');
                    }

                    this._images[index].classList.add(this.id + '__image_current');
                    this._currentIndex = index;

                    clearTimeout(this._slideshowTimerId);
                    this._slideshowTimerId = null;
                    
                    if (this.options.slideshow === true) {
                        this.enableSlideshow();
                    }

                    this._emitImageChangedEvent(prevIndex, index);
                    return true;
                }
            }
            return false;
        },
        enumerable: true,
        writable: true
    },

    isValidIndex: {
        value: function(index) {
            return typeof index === 'number' && ((0 <= index && index < this.length) || (this.options.loop === true && this.length > 0));
        }
    },

    length: {
        get: function() {
            return this._images.length;
        },
        enumerable: true
    },

    currentIndex: {
        get: function() {
            return this._currentIndex;
        },
        enumerable: true
    },

    enableSlideshow: {
        value: function() {
            if (!this._slideshowTimerId) {
                var speed = this.options.slideshowSpeed ? this.options.slideshowSpeed : 1;

                this._slideshowTimerId = setTimeout((function() {
                    this.options.slideshowReverse !== true ? this.next() : this.prev();
                }).bind(this), 1000 / speed);
            }

            this.options.slideshow = true;
        }
    },

    disableSlideshow: {
        value: function() {
            clearTimeout(this._slideshowTimerId);
            this._slideshowTimerId = null;
            this.options.slideshow = false;
        }
    },

    _init: {
        value: function() {
            var images = this.elem.querySelector('.' + this.id + '__container').children;

            this._images = images;
            
            if (images.length) {
                for (var i = 0; i < images.length; ++i) {
                    images[i].style.backgroundImage = 'url(' + images[i].dataset.src + ')';
                }
                
                this.goTo(typeof this.options.initialIndex === 'number' ? this.options.initialIndex : 0);
            }

            if (this.options.slideshow === true) {
                this.enableSlideshow();
            }
        }
    },

    _emitImageChangedEvent: {
        value: function(prevIndex, index) {
            var event = new Event('imagechanged', { bubbles: true, cancelable: false });
            event.detail = { index: index, prevIndex, prevIndex };
            this.elem.dispatchEvent(event);
        }
    }
});

if (module) {
    module.exports = ImageSlider;
}