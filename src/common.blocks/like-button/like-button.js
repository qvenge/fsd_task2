function LikeButton(elem) {
    this.elem = elem;
    this._number = elem.getElementsByClassName(this.id + '__number')[0];

    this._init();
}

LikeButton.prototype = {
    id: 'like-button',

    _init: function() {
        var self = this;

        this.elem.addEventListener('click', function(event) {
            self.toggle();
        });
    },

    like: function() {
        if (this.isLiked) {
            return false;
        }

        this.elem.classList.add(this.id + '_liked');
        this._number.textContent = Number(this._number.textContent) + 1;

        return true;
    },

    dislike: function() {
        if (!this.isLiked) {
            return false;
        }

        this.elem.classList.remove(this.id + '_liked');
        this._number.textContent = Number(this._number.textContent) - 1;

        return true;
    },

    toggle: function() {
        this.like() || this.dislike(); 
    }
};

Object.defineProperties(LikeButton.prototype, {
    isLiked: {
        get: function() {
            return this.elem.classList.contains(this.id + '_liked');
        }
    },
})

LikeButton.prototype.constructor = LikeButton;

if (module) {
    module.exports = LikeButton;
}