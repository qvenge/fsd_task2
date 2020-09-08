function checkboxList(elem) {
    this.elem = elem;

    this.init()
}

checkboxList.prototype = {
    id: 'checkbox-list',

    init: function() {
        var self = this;

        if (this.elem.classList.contains(this.id + '_expandable')) {
            var label = this.elem.querySelector('.' + this.id + '__label');
            var ul = this.elem.querySelector('.' + this.id + '__ul');

            label.addEventListener('click', function(event) {
                if (self.elem.classList.contains(self.id + '_expanded')) {
                    ul.parentElement.style.height = '';
                    self.elem.classList.remove(self.id + '_expanded');
                } else {
                    ul.parentElement.style.height = ul.offsetHeight + 'px';
                    self.elem.classList.add(self.id + '_expanded');
                }
            });
        }
    }
}

checkboxList.prototype.constructor = checkboxList;

if (module) {
    module.exports = checkboxList;
}