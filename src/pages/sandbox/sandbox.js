require('./sandbox.scss');

window.BEM.initAllEntities();


// var someBlocks = document.querySelectorAll('.some-block');

// someBlocks.forEach(function(block) {
//     var dropdownElem = block.querySelector('.hideable-block');

//     var dropdown = window.BEM.getEntityInstance(dropdownElem, 'hideable-block');


//     var btn = block.querySelector('.some-block__btn');

//     dropdown.addController(btn);

//     block.addEventListener('hideableblockanimationstart', function() {
//         console.log('dropdownanimationstart')
//     })

//     block.addEventListener('hideableblockanimationend', function() {
//         console.log('dropdownanimationend')
//     })

//     block.addEventListener('hideableblockanimationcancel', function() {
//         console.log('dropdownanimationcancel')
//     })

//     btn.addEventListener('click', function(event) {
//     });
// });