# Slide


```tsx
// example

import { SlideShow, Slide } from "../../components/Slideshow";

export const Sample = () => {
  const [data, setData] = useState<SlideDocument>({});
  const [slider, setSlider] = useState<Slide | null>(null);

  const handleSetSlide = (slider: Slide) => {
    setSlider(slider);
  };

  return (
    <>
      <SlideShow
        title={data.title}
        feature={data.feature}
        date={data.datecreate?.toMillis()}
        onChange={handleSetSlide}
        slides={data.contents}
      />
    </>
  );
};
```

| Name     | Type                                           | Default | Description                                   |
| -------- | ---------------------------------------------- | ------- | --------------------------------------------- |
| title    | string                                         |         | Title display on first slide                  |
| feature  | StockDisplayProps <br>\| null <br>\| undefined |         | Image display on first slide                  |
| date     | number                                         |         | Date display on first slide (number of Epoch) |
| onChange | func                                           |         | function return Slider object to parent       |
| Slides   | SlideValue[]                                   |         | array of slide value                          |

## Slide Value

| Name      | Type                                           | Default | Description       |
| --------- | ---------------------------------------------- | ------- | ----------------- |
| key       | \*string                                       |         | key of each slide |
| title     | string                                         |         | Slide title       |
| image     | StockDisplayProps <br>\| null <br>\| undefined |         | Slide image       |
| secondary | string                                         |         | Slide Description |
