function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function Body(elem, params) {
    this.elem = elem;
    this._resizeTimeout = null;

    this._lockingEntities = {};
    this._zIndexes = {};

    this._init();
}


Object.defineProperties(Body.prototype, {
    id: {
        value: 'body',
        enumerable: true
    },

    lock: {
        value: function(entityName, zIndex) {
            if (this._lockingEntities.hasOwnProperty(entityName)) {
                return false;
            }

            var self = this;

            if (!this._zIndexes.hasOwnProperty(zIndex)) {
                var modal = this._createModal(zIndex);

                this._zIndexes[zIndex] = {
                    modal: modal,
                    entities: {}
                };

                setTimeout(function() {
                    modal.classList.add(self.id + '__modal_active');
                }, 15);

                this.elem.classList.add(this.id + '_locked');
            }

            // на случай если установлен таймер на удаление
            clearTimeout(this._zIndexes[zIndex].timerId);

            this._zIndexes[zIndex].entities[entityName] = true;
            this._lockingEntities[entityName] = zIndex;

            return true;
        },
        enumerable: true,
        writable: true,
        configurable: false
    },

    unlock: {
        value: function(entityName) {
            if (!this._lockingEntities.hasOwnProperty(entityName)) {
                return false;
            }
            
            var self = this;
            var prevIndex = this._lockingEntities[entityName];
            var container = this._zIndexes[prevIndex];

            delete container.entities[entityName];

            if (isEmpty(container.entities)) {
                container.modal.classList.remove(this.id + '__modal_active');

                container.timerId = setTimeout(function() {
                    container.modal.parentElement.removeChild(container.modal);
                    delete self._zIndexes[prevIndex];
                }, 300);
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
        }
    },

    _createModal: {
        value: function(zIndex) {
            var modal = document.createElement('DIV');
            modal.className = this.id + '__modal';
            modal.style.zIndex = zIndex;
            this.elem.insertBefore(modal, this.elem.firstElementChild);
            return modal;
        }
    }

});

if (module) {
    module.exports = Body;
}