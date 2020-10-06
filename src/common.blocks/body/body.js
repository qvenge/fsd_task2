var MIN_DESKTOP_WIDTH = 980;
var MIN_TABLET_WIDTH = 650;


function isEmpty(obj) {
    return !Object.keys(obj).length;
}

function Body(elem, params) {
    this.elem = elem;
    this._resizeTimeout = null;

    this._lockingEntities = Object.create(null);
    this._modalContainers = Object.create(null);

    this._init();
}


Object.defineProperties(Body.prototype, {
    id: {
        value: 'body',
        enumerable: true
    },

    lock: {
        value: function(entityName, zIndex, modalOnclickCallback) {
            if (entityName in this._lockingEntities) {
                return false;
            }

            var self = this;
            var modalContainer = this._modalContainers[zIndex];

            if (!modalContainer) {
                modalContainer = {
                    modal: this._createModal(zIndex),
                    entities: {}
                };

                setTimeout(function() {
                    modalContainer.modal.classList.add(self.id + '__modal_active');
                }, 15);

                this.elem.classList.add(this.id + '_locked');
                this._modalContainers[zIndex] = modalContainer;
            }

            // на случай если установлен таймер на удаление
            clearTimeout(modalContainer.timerId);

            if (typeof modalOnclickCallback === 'function') {
                modalContainer.modal.addEventListener('click', modalOnclickCallback);
            }

            modalContainer.entities[entityName] = true;
            this._lockingEntities[entityName] = { zIndex: zIndex, modalOnclickCallback: modalOnclickCallback };

            return true;
        },
        enumerable: true,
        writable: true,
        configurable: false
    },

    unlock: {
        value: function(entityName) {
            var entityData = this._lockingEntities[entityName];

            if (!entityData) {
                return false;
            }
            
            var self = this;
            var prevIndex = entityData.zIndex;
            var modalContainer = this._modalContainers[prevIndex];

            delete modalContainer.entities[entityName];

            if (isEmpty(modalContainer.entities)) {
                modalContainer.modal.classList.remove(this.id + '__modal_active');

                modalContainer.timerId = setTimeout(function() {
                    var modal = self._modalContainers[prevIndex].modal;
                    modal.parentElement.removeChild(modal);
                    delete self._modalContainers[prevIndex];
                }, 300);
            }

            if (typeof entityData.modalOnclickCallback === 'function') {
                modalContainer.modal.removeEventListener('click', entityData.modalOnclickCallback);
            }

            delete this._lockingEntities[entityName];

            if (isEmpty(this._lockingEntities)) {
                this.elem.classList.remove(this.id + '_locked');
            }

            return true;
        },
        enumerable: true,
        writable: true,
        configurable: false
    },

    _init: {
        value: function() {
            var self = this;
            var resizeTimeout = null;

            window.addEventListener('resize', function(event) {    
                function delayed() {
                    var event = new Event('optimizedResize');

                    event.detail = {
                        width: document.documentElement.clientWidth,
                        height: document.documentElement.clientHeight
                    };

                    resizeTimeout = null;
                    window.dispatchEvent(event);
                }
    
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }
    
                resizeTimeout = setTimeout(delayed, 66);
            });


            window.addEventListener('optimizedResize', this._resizeHandler.bind(this));

            this._resizeHandler({ detail: { width: document.documentElement.clientWidth } })
        }
    },

    _resizeHandler: {
        value: function(event) {
            var width = event.detail.width;

            if (width >= MIN_DESKTOP_WIDTH) {
                this.elem.classList.remove(this.id + '_mobile');
                this.elem.classList.remove(this.id + '_tablet');
                this.elem.classList.add(this.id + '_desktop');
            } else if (width < MIN_DESKTOP_WIDTH && MIN_TABLET_WIDTH <= width) {
                this.elem.classList.remove(this.id + '_mobile');
                this.elem.classList.add(this.id + '_tablet');
                this.elem.classList.remove(this.id + '_desktop');
            } else {
                this.elem.classList.add(this.id + '_mobile');
                this.elem.classList.remove(this.id + '_tablet');
                this.elem.classList.remove(this.id + '_desktop');
            }
        }
    },

    _createModal: {
        value: function(zIndex) {
            var modal = document.createElement('DIV');
            modal.className = this.id + '__modal';
            modal.style.zIndex = zIndex;
            this.elem.appendChild(modal);
            return modal;
        }
    }

});

if (module) {
    module.exports = Body;
}