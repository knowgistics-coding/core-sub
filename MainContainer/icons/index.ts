import { FunctionComponent, SVGProps } from "react";
import { ReactComponent as book } from "./book.svg";
import { ReactComponent as feed } from "./feed.svg";
import { ReactComponent as file } from "./file.svg";
import { ReactComponent as images } from "./images.svg";
import { ReactComponent as maps } from "./maps.svg";
import { ReactComponent as post } from "./post.svg";
import { ReactComponent as profile } from "./profile.svg";
import { ReactComponent as slideshow } from "./slideshow.svg";
import { ReactComponent as study } from "./study.svg";
import { ReactComponent as teach } from "./teach.svg";

export { ReactComponent as book } from "./book.svg";
export { ReactComponent as feed } from "./feed.svg";
export { ReactComponent as file } from "./file.svg";
export { ReactComponent as images } from "./images.svg";
export { ReactComponent as maps } from "./maps.svg";
export { ReactComponent as post } from "./post.svg";
export { ReactComponent as profile } from "./profile.svg";
export { ReactComponent as slideshow } from "./slideshow.svg";
export { ReactComponent as study } from "./study.svg";
export { ReactComponent as teach } from "./teach.svg";

const Icons: Record<
  string,
  FunctionComponent<
    SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >
> = {
  scroll: feed,
  "id-card": profile,
  "graduation-cap": study,
  "chalkboard-user": teach,
  "file-alt": post,
  book: book,
  images: slideshow,
  image: images,
  "map-location-dot": maps,
  file: file,
};

export default Icons;
