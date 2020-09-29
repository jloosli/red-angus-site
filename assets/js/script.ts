// core version + navigation, pagination modules:
import Swiper, { Navigation,  Autoplay, Lazy } from 'swiper';

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
  on: {
    init: function () {
      this.update();
    }
  }
})

window['mySwiper'] = mySwiper;
