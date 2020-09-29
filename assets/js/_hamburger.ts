const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav-header');
// On click
hamburger.addEventListener('click', function () {
  // Toggle class "is-active"
  hamburger.classList.toggle('is-active');
  nav.classList.toggle('is-active');
  // Do something else, like open/close menu
});
