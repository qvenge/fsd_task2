const Sidebar = require('../../../common.blocks/sidebar/sidebar');

require('./searchroompage.scss');

var MAX_WIDTH = 1180;

window.BEM.initAllEntities();

var sidebarElem = document.querySelector('.sidebar');
var sidebar = window.BEM.getEntityInstance(sidebarElem, 'sidebar');

if (document.documentElement.clientWidth < MAX_WIDTH) {
    sidebar.stick();
}

window.addEventListener('optimizedResize', function(event) {
    if (event.detail.width < MAX_WIDTH) {
        sidebar.stick()
    } else {
        sidebar.unstick();
    }
});