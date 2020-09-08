function Pagination(elem) {
    this.elem = elem;
    this.radius = 2;
    this.currentPage = undefined;
    this.pages = [];

    this.nextBtn = this.elem.querySelector('.' + this.id + '__btn_next');
    this.prevBtn = this.elem.querySelector('.' + this.id + '__btn_prev');
    this.leftEllipsis = this._createEllipsis();
    this.rightEllipsis = this._createEllipsis();

    this._init();
    this._initEvents();
}

Pagination.prototype = {
    id: 'pagination',

    changePage: function(number) {
        number = Number(number);
        
        if (number < 1) number = 1;
        else if (number > this.pages.length) number = this.pages.length;

        this._reset();

        var shownItems = this._getPagesAround(number);

        for (var i = 0; i < shownItems.length; ++i) {
            shownItems[i].classList.add(this.id + '__shown-item');
        }

        if (number > this.radius + 2) {
            this.leftEllipsis.classList.add(this.id + '__shown-item');
        } else {
            this.leftEllipsis.classList.remove(this.id + '__shown-item');
        }

        if (number < this.pages.length - this.radius - 1) {
            this.rightEllipsis.classList.add(this.id + '__shown-item');
        } else {
            this.rightEllipsis.classList.remove(this.id + '__shown-item');
        }

        this._adjustButtons(number);

        this.pages[number - 1].classList.add(this.id + '__page_current');

        this._emitPageChangedEvent(number, this.currentPage);

        this.currentPage = number;
    },


    setHint: function(text) {
        var hint = this.elem.querySelector('.' + this.id + '__hint');
        hint.classList.add(this.id + '__shown-item');
        hint.textContent = text;
    },


    removeHint: function() {
        hint.classList.remove(this.id + '__shown-item');
    },

    _init: function() {
        var params = this.elem.dataset.params;
        var pageContainer = this.elem.querySelector('.' + this.id + '__pages');

        if (params) {
            params = JSON.parse(params);

            for (var i = 0; i < params.pages.length; ++i) {
                var number = i + 1;
                var link = document.createElement('a');
                
                link.textContent = number;
                link.href = params.pages[i];
                link.classList.add(this.id + '__page');

                pageContainer.appendChild(link);
                this.pages.push(link);
            }

            this.pages[0].classList.add(this.id + '__page_first');
            this.pages[this.pages.length - 1].classList.add(this.id + '__page_last');

            if (this.pages.length > 2) {
                pageContainer.insertBefore(this.leftEllipsis, this.pages[1]);
                pageContainer.insertBefore(this.rightEllipsis, this.pages[this.pages.length - 1]);
            }

            this.changePage(params.currentPage);
        }
    },

    _initEvents: function() {
        var self = this;

        this.elem.addEventListener('click', function(event) {
            if (event.target.classList.contains(self.id + '__page')) {
                self.changePage(event.target.textContent);
            } else if (event.target.classList.contains(self.id + '__btn_prev')) {
                self.changePage(self.currentPage - 1);
            } else if (event.target.classList.contains(self.id + '__btn_next')) {
                self.changePage(self.currentPage + 1);
            }
        });
    },


    _adjustButtons: function(number) {
        if (this.nextBtn) {
            if (number < this.pages.length) {
                this.nextBtn.classList.add(this.id + '__shown-item');
                this.nextBtn.href = this.pages[number].href;
            } else {
                this.nextBtn.classList.remove(this.id + '__shown-item');
            }
        }

        if (this.prevBtn) {
            if (number > 1) {
                this.prevBtn.classList.add(this.id + '__shown-item');
                this.prevBtn.href = this.pages[number - 2].href;
            } else {
                this.prevBtn.classList.remove(this.id + '__shown-item');
            }
        }
    },


    _reset: function() {
        var shownItems = this.elem.querySelectorAll('.' + this.id + '__shown-item') || [];

        for (var i = 0; i < shownItems.length; ++i) {
            shownItems[i].classList.remove(this.id + '__shown-item');
        }

        if (this.currentPage !== undefined) {
            this.pages[this.currentPage - 1].classList.remove(this.id + '__page_current');
        }
    },


    _createEllipsis: function() {
        var ellipsis = document.createElement('DIV');
        ellipsis.className = this.id + '__ellipsis';
        ellipsis.textContent = '...';

        return ellipsis;
    },


    _getPagesAround: function(numPage) {
        var leftIndex = numPage - this.radius - 1;
        var rightIndex = numPage + this.radius;

        if (leftIndex < 0) leftIndex = 0;
        else if (rightIndex > this.pages.length - 1) rightIndex = this.pages.length - 1;

        return this.pages.slice(leftIndex, rightIndex);
    },


    _emitPageChangedEvent: function(page, previousPage) {
        var event = new Event('pagechanged', { bubbles: true, cancelable: true });
        event.detail = { page: page, previousPage: previousPage };

        this.elem.dispatchEvent(event);
    }
};

Pagination.prototype.constructor = Pagination;

if (module) {
    module.exports = Pagination;
}