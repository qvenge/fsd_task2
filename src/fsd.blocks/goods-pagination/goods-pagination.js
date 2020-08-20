function GoodsPagination(elem) {
    this.elem = elem;

    this.init();
}

GoodsPagination.prototype = {
    init: function() {
        var params = JSON.parse(this.elem.dataset.bem)['goods-pagination'];

        this.numberOfItems = params.numberOfItems;
        this.itemsPerPage = params.itemsPerPage;
        this.lastPage = Math.ceil(this.numberOfItems / this.itemsPerPage);
    },

    postInit: function() {
        var pagination = this.elem.querySelector('.pagination').bemInstances['pagination'];
        var generateHint = this._generateHint.bind(this);

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