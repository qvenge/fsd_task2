function HideableBlock(elem, params) {
    this.elem = elem;
    this.params = params || {};
    this.isHidden = false;
    this._controllers = [];
    this._onClickListener = null;

    this._init();
}

HideableBlock.prototype = {
    id: 'hideable-block',


    show: function(withoutAnimation) {
        if (!this.isHidden) {
            return false;
        }
        this.isHidden = false;
        this.elem.classList.remove(this.id + '_hidden');
        this._addListener();

        if (!withoutAnimation && this.elem.classList.contains(this.id + '_animated')) {
            this._performAnimation();
        } else {
            this._resetInlineStyles();
        }
        return true;
    },


    hide: function(withoutAnimation) {
        if (this.isHidden) {
            return false;
        }
        this.isHidden = true;
        this.elem.classList.add(this.id + '_hidden');
        this._removeListener();

        if (!withoutAnimation && this.elem.classList.contains(this.id + '_animated')) {
            this._performAnimation();
        } else {
            this._hideWithInlineStyles();
        }
        return true;
    },


    toggle: function() {
        this.show() || this.hide();
    },


    addController: function(elem) {
        if (this._controllers.every(function(controller) { return controller.elem !== elem })) {
            var listener = this.toggle.bind(this);
            elem.addEventListener('click', listener);
            this._controllers.push({ elem: elem, listener: listener });
        }
    },
    

    removeController: function(elem) {
        var controllers = this._controllers;

        for (var i = 0; i < controllers.length; ++i) {
            if (controllers[i].elem === elem) {
                elem.removeEventListener('click', controllers[i].listener);
                controllers.splice(i, 1);
                this._removeListener();
                this._addListener();
                return;
            }
        }
    },


    _init: function() {
        this.params.closeOnOuterClick = this.params.closeOnOuterClick !== false;
        this.params.widthByContent = this.params.widthByContent === true;
        this.container = this.elem.querySelector('.' + this.id + '__container');

        this._extendWidth = this.elem.classList.contains(this.id + '_animated_extending') 
            || this.elem.classList.contains(this.id + '_animated_extending-x');

        this.hide(true);
    },


    _hideWithInlineStyles: function() {
        var style = this.container.style;

        style.overflow = 'hidden';
        style.height = '0px';

        if (this._extendWidth) {
            style.width = '0px';
        }
    },


    _resetInlineStyles: function() {
        var style = this.container.style;

        style.height = '';
        style.width = '';
        style.overflow = '';
    },


    _performAnimation: function() {
        var self = this;

        if (this.animationTimerId) {
            cancelAnimationFrame(this.animationTimerId);
            this.container.removeEventListener('transitionend', this._onTransitionEndListener);
            this._emitAnimationCancelEvent();
        }

        this._onTransitionEndListener = (function(event) {
            if (!this.isHidden) {
                this._resetInlineStyles();
            }
            this.animationTimerId = null;
            this._emitAnimationEndEvent();
            this.container.removeEventListener('transitionend', this._onTransitionEndListener);
            this._onTransitionEndListener = null;
        }).bind(this);

        this.container.addEventListener('transitionend', this._onTransitionEndListener);

        this._emitAnimationStartEvent();

        this.animationTimerId = requestAnimationFrame(function() {
            var container = self.container;

            if (this._extendWidth) {
                var width = self.params.widthByContent ? container.firstElementChild.offsetWidth : container.parentElement.clientWidth;
                container.style.width = width + 'px';
            }

            container.style.height = container.firstElementChild.offsetHeight + 'px';
            container.style.overflow = 'hidden';

            if (self.isHidden) {
                self.animationTimerId = requestAnimationFrame(function() {
                    self._hideWithInlineStyles();
                });
            }
        });
    },


    _addListener: function() {
        if (this.params.closeOnOuterClick && !this._onClickListener) {
            var self = this;
            var ignoredElements = [this.elem].concat(this._controllers.map(function(ctrl) { return ctrl.elem }));

            this._onClickListener = function(event) {
                var target = event.target;

                if (ignoredElements.some(function(elem) { return elem.contains(target); })) {
                    return;
                }
                
                self.hide();
            };

            document.addEventListener('click', self._onClickListener);
        }
    },


    _removeListener: function() {
        if (this._onClickListener) {
            document.removeEventListener('click', this._onClickListener);
            this._onClickListener = null;
        }
    },


    _emitAnimationStartEvent: function() {
        var event = new Event('hideableblockanimationstart', { bubbles: true });
        this.elem.dispatchEvent(event);
    },
    
    _emitAnimationEndEvent: function() {
        var event = new Event('hideableblockanimationend', { bubbles: true });
        this.elem.dispatchEvent(event);
    },

    _emitAnimationCancelEvent: function() {
        var event = new Event('hideableblockanimationcancel', { bubbles: true });
        this.elem.dispatchEvent(event);
    },
}


HideableBlock.prototype.constructor = HideableBlock;


if (module) {
    module.exports = HideableBlock;
}