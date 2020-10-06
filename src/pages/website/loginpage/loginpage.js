require('./loginpage.scss');

window.BEM.initAllEntities();


var loginpage = document.querySelector('.loginpage');
var registrationCard = loginpage.querySelector('.loginpage__registration-form');
var signinCard = loginpage.querySelector('.loginpage__sign-in-form');

loginpage.addEventListener('buttonclick', function(event) {
    if (event.target.name === 'showregistration') {
        loginpage.classList.add('loginpage_registration');
    } else if (event.target.name === 'showsignin') {
        loginpage.classList.remove('loginpage_registration');
    }
});