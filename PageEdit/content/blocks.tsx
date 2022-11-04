import { LocaleKey } from "../../Translate/en_th";
import { PickIconName } from "../../PickIcon";
import { ShowTypes } from "../../Controller/page";

export const Blocks: {
  title: LocaleKey;
  icon: PickIconName;
  key: ShowTypes;
}[] = [
  { title: "Heading", icon: "heading", key: "heading" },
  { title: "Paragraph", icon: "paragraph", key: "paragraph" },
  { title: "Image", icon: "image", key: "image" },
  { title: "Video", icon: "video", key: "video" },
  { title: "Cover", icon: "image", key: "cover" },
  { title: "Slide", icon: "images", key: "slide" },
  { title: "Highlight", icon: "newspaper", key: "highlight" },
  { title: "Card", icon: "table", key: "card" },
  { title: "Table", icon: "table", key: "table" },
  { title: "Divider", icon: "horizontal-rule", key: "divider" },
  { title: "File", icon: "file-alt", key: "file" },
];
