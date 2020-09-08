function ImageGallery(elem) {
    this.elem = elem;
    this._init()
}

ImageGallery.prototype = {
    _init: function() {
        var self = this;
        var imageSliderElem = this.elem.querySelector('.image-slider');
        var btnContainer = this.elem.querySelector('.' + this.id + '__bullet-btn-container');
        var prevBtn = this.elem.querySelector('.' + this.id + '__prev-image-btn');
        var nextBtn = this.elem.querySelector('.' + this.id + '__next-image-btn');

        var imageSlider = window.BEM.getEntityInstance(imageSliderElem, 'image-slider');
        var btns = btnContainer.children;

        for (var i = 0; i < imageSlider.length; ++i) {
            var bulletBtn = document.createElement('DIV');
            bulletBtn.classList.add(this.id + '__bullet-btn');
            bulletBtn.setAttribute('data-index', i);

            if (imageSlider.currentIndex === i) {
                bulletBtn.classList.add(this.id + '__bullet-btn_active');
            }

            btnContainer.appendChild(bulletBtn);
        }

        prevBtn.addEventListener('click', function() {
            imageSlider.prev();
        });

        nextBtn.addEventListener('click', function() {
            imageSlider.next();
        });

        btnContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains(self.id + '__bullet-btn')) {
                imageSlider.goTo(Number(event.target.dataset.index));
            }
        });

        imageSliderElem.addEventListener('imagechanged', function(event) {
            if (event.detail.prevIndex !== undefined) {
                btns[event.detail.prevIndex].classList.remove(self.id + '__bullet-btn_active');
            }
            btns[event.detail.index].classList.add(self.id + '__bullet-btn_active');
        });
    }
}

Object.defineProperties(ImageGallery.prototype, {
    id: {
        value: 'image-gallery',
        enumerable: true
    },
});

ImageGallery.prototype.constructor = ImageGallery;

if (module) {
    module.exports = ImageGallery;
}

