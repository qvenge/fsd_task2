require('./searchroompage.scss');

window.BEM.initAllEntities();

var filterBtn = document.querySelector('.sr-page__filters-btn');

var filterContainer = document.querySelector('.sr-page__filters-outer-container');
var body = window.BEM.getEntityInstance(document.body, 'body');

filterBtn.addEventListener('click', function(event) {
    filterContainer.classList.toggle('sr-page__filters-outer-container_open');
    body.lock('hideable-sidebar', 998) || body.unlock('hideable-sidebar');
});