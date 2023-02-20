import Swiper, {
  A11y,
  Autoplay,
  Controller,
  EffectCoverflow,
  EffectCube,
  EffectFade,
  EffectFlip,
  HashNavigation,
  Keyboard,
  Lazy,
  Mousewheel,
  Navigation,
  Pagination,
  Parallax,
  Scrollbar,
  Thumbs,
  Virtual,
  Zoom,
} from "swiper";
import { SwiperProps } from "swiper/react";
import { SwiperModule } from "swiper/types";

export class Slide {
  /**
   * ========================================
   *   ____  _____   _   _____  ___  ____
   *  / ___||_   _| / \ |_   _||_ _|/ ___|
   *  \___ \  | |  / _ \  | |   | || |
   *   ___) | | | / ___ \ | |   | || |___
   *  |____/  |_|/_/   \_\|_|  |___|\____|
   *
   * ========================================
   */

  static modules: SwiperModule[] = [
    Virtual,
    Keyboard,
    Mousewheel,
    Navigation,
    Pagination,
    Scrollbar,
    Parallax,
    Zoom,
    Lazy,
    Controller,
    A11y,
    History,
    HashNavigation,
    Autoplay,
    EffectFade,
    EffectCube,
    EffectFlip,
    EffectCoverflow,
    Thumbs,
  ];

  static options: SwiperProps = {
    spaceBetween: 50,
    slidesPerView: 1,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    observer: true,
    autoplay: { delay: 3000 },
  };

  swiper: Swiper;

  constructor(swiper: Swiper) {
    this.swiper = swiper;
  }

  play(): Slide {
    this.swiper.autoplay.start();
    return this;
  }

  pause(): Slide {
    this.swiper.autoplay.stop();
    return this;
  }
}
