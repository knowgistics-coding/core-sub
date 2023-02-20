import { StockDisplayProps } from "../StockDisplay";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { DateCtl } from "./date.ctl";
import { ExcludeMethods } from "./map";

//SECTION - SlideshowSlide

//ANCHOR - [type] SlideshowSlideVal
export type SlideshowSlideVal = Pick<
  SlideshowSlide,
  "title" | "desc" | "feature" | "key"
>;

//ANCHOR - [class] SlideshowSlide
export class SlideshowSlide {
  key: string;
  title: string;
  desc: string;
  feature: StockDisplayProps | null;

  constructor(data?: Partial<SlideshowSlide>) {
    this.key = data?.key ?? this.genKey(6);
    this.title = data?.title ?? "";
    this.desc = data?.desc ?? "";
    this.feature = data?.feature ?? null;
  }

  set<T extends "title" | "desc" | "feature">(
    field: T,
    value: this[T]
  ): SlideshowSlide {
    this[field] = value;
    return new SlideshowSlide(this);
  }

  readonly featuring = {
    pos: (pos: Record<"top" | "left", string>): SlideshowSlide => {
      if (this.feature) {
        this.feature.pos = pos;
      }
      return new SlideshowSlide(this);
    },
  };

  val(): SlideshowSlideVal {
    const { title, desc, feature, key } = this;
    return { title, desc, feature, key };
  }

  genKey(length: number): string {
    let result = "";
    const hexChars = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
      result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }
    return result;
  }
}
//!SECTION

//SECTION - Slideshow

//ANCHOR - [type] SlideshowConstructorValue
export type SlideshowConstructorValue = Omit<Slideshow, "slides"> & {
  slides?: (SlideshowSlide | SlideshowSlideVal)[];
};

//ANCHOR - SlideshowVal
export type SlideshowVal = Omit<ExcludeMethods<Slideshow>, "_id" | "slides"> & {
  slides: SlideshowSlideVal[];
};

//ANCHOR - [class] Slideshow
export class Slideshow {
  title: string;
  type: "slideshow" = "slideshow";
  user: string;
  datecreate: number;
  datemodified: number;
  visibility: VisibilityTabsValue;
  feature: StockDisplayProps | null;
  slides: SlideshowSlide[];

  constructor(data?: Partial<SlideshowConstructorValue>) {
    this.title = data?.title ?? "";
    this.user = data?.user ?? "";
    this.datecreate = DateCtl.toNumber(data?.datecreate);
    this.datemodified = DateCtl.toNumber(data?.datemodified);
    this.visibility = data?.visibility ?? "private";
    this.feature = data?.feature ?? null;
    this.slides = (data?.slides ?? []).map((doc) => new SlideshowSlide(doc));
  }

  set<T extends keyof this>(field: T, value: this[T]): Slideshow {
    this[field] = value;
    return new Slideshow(this);
  }

  setSlide<T extends keyof SlideshowSlide>(
    index: number,
    field: T,
    value: SlideshowSlide[T]
  ): Slideshow {
    if (this.slides.at(index)) {
      const slide = new SlideshowSlide({
        ...this.slides.at(index),
        [field]: value,
      });
      this.slides[index] = slide;
      return new Slideshow(this);
    } else {
      return this;
    }
  }

  readonly slide = {
    add: (): Slideshow => {
      this.slides = this.slides.concat(new SlideshowSlide());
      return new Slideshow(this);
    },
    replace: (slide: SlideshowSlide): Slideshow => {
      const index = this.slides.findIndex((s) => s.key === slide.key);
      if (index > -1) {
        this.slides[index] = new SlideshowSlide(slide);
      }
      return new Slideshow({ ...this });
    },
  };

  val(): SlideshowVal {
    const data = Object.entries(this)
      .filter(
        ([key, value]) =>
          value instanceof Function === false && ["_id"].includes(key) === false
      )
      .reduce<Omit<ExcludeMethods<Slideshow>, "_id">>(
        (data, [key, value]) => Object.assign(data, { [key]: value }),
        {} as Omit<ExcludeMethods<Slideshow>, "_id">
      );
    return { ...data, slides: this.slides.map((doc) => doc.val()) };
  }
}
//!SECTION
