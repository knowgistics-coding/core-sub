import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ComponentType,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { StockDisplayProps } from "../StockDisplay";
import { NextButton, PrevButton } from "./button";
import { PaginationBlock } from "./pagination";
import { Slide } from "./slide";
import { SlideCover } from "./slide.cover";
import { SlideItem } from "./slide.item";
import { SlideRoot } from "./slide.root";
import "swiper/css";
import { Slideshow } from "../Controller/slideshow";
import { Autoplay } from "swiper";

//SECTION - TYPES
//ANCHOR - SlideValue
export type SlideValue = {
  key: string;
  title?: string;
  image?: StockDisplayProps | null;
  secondary?: string;
};

//ANCHOR - SlideShowProps
export type SlideShowProps = {
  value?: Slideshow;
  slideId?: string;
};
//!SECTION

export type SlideshowContextState = {
  slider: Slide | null;
  setSlider: Dispatch<SetStateAction<Slide | null>>;
};
const SlideshowContext = createContext<SlideshowContextState>({
  slider: null,
  setSlider: () => {},
});

export const connectSlideshow =
  <T extends {}>(Comp: ComponentType<T & SlideshowContextState>) =>
  (props: T) => {
    const [slider, setSlider] = useState<Slide | null>(null);

    return (
      <SlideshowContext.Provider value={{ slider, setSlider }}>
        <Comp {...props} slider={slider} setSlider={setSlider} />
      </SlideshowContext.Provider>
    );
  };

export const SlideShowViewer = React.memo((props: SlideShowProps) => {
  const { slider, setSlider } = useContext(SlideshowContext);

  return (
    <SlideRoot>
      <Swiper
        {...Slide.options}
        modules={[Autoplay]}
        onSlideChange={(swiper) => setSlider(new Slide(swiper))}
        // onSwiper={(swiper) => console.log(swiper)}
        onInit={(swiper) => {
          swiper.autoplay.stop();
          setSlider(new Slide(swiper));
        }}
      >
        {props.value && (
          <SwiperSlide>
            <SlideCover
              primary={props.value.title}
              image={props.value.feature}
              date={props.value.datecreate}
              slideId={props.slideId}
              user={props.value.user}
            />
          </SwiperSlide>
        )}
        {props.value?.slides.map((s, index, slides) => {
          return (
            <SwiperSlide key={s.key}>
              <SlideItem
                title={s.title}
                image={s.feature}
                counter={`${index + 1}/${slides.length}`}
                secondary={s.desc}
              />
            </SwiperSlide>
          );
        })}
        <PaginationBlock
          className="swiper-pagination"
          cover={slider?.swiper.activeIndex === 0}
        />
        <NextButton
          className="swiper-button-next"
          cover={slider?.swiper.activeIndex === 0}
          disabled={slider?.swiper.isEnd}
        >
          <FontAwesomeIcon size="4x" icon={["far", "chevron-right"]} />
        </NextButton>
        <PrevButton
          className="swiper-button-prev"
          disabled={slider?.swiper.isBeginning}
        >
          <FontAwesomeIcon size="4x" icon={["far", "chevron-left"]} />
        </PrevButton>
      </Swiper>
    </SlideRoot>
  );
});
