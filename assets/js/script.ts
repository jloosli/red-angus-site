// core version + navigation, pagination modules:
import Swiper, {Navigation, Autoplay, Lazy} from 'swiper';

// configure Swiper to use modules
Swiper.use([Navigation, Autoplay, Lazy]);


const mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  loop: true,
  lazy: true,
  preloadImages: true,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  autoplay: true,
});

// Hack to get the image to resize correctly
window.document.addEventListener('DOMContentLoaded', (event) => {
  mySwiper.update();
});


const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav-header');
// On click
hamburger.addEventListener('click', function () {
  // Toggle class "is-active"
  hamburger.classList.toggle('is-active');
  nav.classList.toggle('is-active');
  // Do something else, like open/close menu
});
