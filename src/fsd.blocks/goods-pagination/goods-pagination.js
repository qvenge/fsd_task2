function GoodsPagination(elem) {
    this.elem = elem;

    this._init();
}

GoodsPagination.prototype = {
    id: 'goods-pagination',
    
    _init: function() {
        var paginationElem = this.elem.querySelector('.pagination');
        var pagination = window.BEM.getEntityInstance(paginationElem, 'pagination');
        var params = window.BEM.getParams(this.elem, this.id) || {};
        var generateHint = this._generateHint.bind(this);

        this.numberOfItems = params.numberOfItems;
        this.itemsPerPage = params.itemsPerPage;
        this.lastPage = Math.ceil(this.numberOfItems / this.itemsPerPage);

        pagination.setHint(generateHint(1));

        this.elem.addEventListener('pagechanged', function(event) {
            pagination.setHint(generateHint(event.detail.page));
        });
    },

    _generateHint: function(page) {
        var hint = '';

        hint = hint + (this.itemsPerPage * (page - 1) + 1);
        hint = hint + ' - ' + (page === this.lastPage ? this.numberOfItems : this.itemsPerPage * page);
        hint = hint + ' из ' + (this.numberOfItems < 100 ? this.numberOfItems : '100+') + ' вариантов аренды';

        return hint;
    }
}

GoodsPagination.prototype.constructor = GoodsPagination;

if (module) {
    module.exports = GoodsPagination;
}