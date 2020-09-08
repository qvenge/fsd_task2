var BemEntity = require('../../common.blocks/_bem-entity/_bem-entity.js');

function ImageGallery(elem) {
    BemEntity.call(this);
    this.elem = elem;

    this.addPostInitCallback(function() {
        var imageSlider = this.elem.querySelector('.image-slider').bemInstances['image-slider'];
        var self = this;
        var btnContainer = this.elem.querySelector('.' + this.id + '__bullet-btn-container');
        var prevBtn = this.elem.querySelector('.' + this.id + '__prev-image-btn');
        var nextBtn = this.elem.querySelector('.' + this.id + '__next-image-btn');
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

        imageSlider.elem.addEventListener('imagechanged', function(event) {
            if (event.detail.prevIndex !== undefined) {
                btns[event.detail.prevIndex].classList.remove(self.id + '__bullet-btn_active');
            }
            btns[event.detail.index].classList.add(self.id + '__bullet-btn_active');
        });
    });
}

ImageGallery.prototype = Object.create(BemEntity.prototype, {
    id: {
        value: 'image-gallery',
        enumerable: true
    },
});

if (module) {
    module.exports = ImageGallery;
}

