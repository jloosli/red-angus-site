// core version + navigation, pagination modules:
import Swiper, {Navigation, Autoplay, Lazy} from 'swiper';

// configure Swiper to use modules
Swiper.use([Navigation, Autoplay, Lazy]);


const mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  loop: true,
  lazy: {
    loadPrevNext: true,
  },
  preloadImages: false,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: true,
});
