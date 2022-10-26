import { IconButton } from "@mui/material";
import update from "react-addons-update";
import { PickIcon } from "../../../PickIcon";
import { PostOptions, SlideItem as SlideItemTypes, usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PostSelect } from "../../post.select";
import { PEEditorProps } from "../heading";

export const PEEditorSlide = ({ content, index }: PEEditorProps) => {
  const { setData } = usePE();
  const handleChangePost = (post: PostOptions) => {
    const { id, title, feature } = post;
    if (id && title && feature) {
      const item: SlideItemTypes = {
        feature,
        id,
        title,
        link: { from: "post", value: id },
      };
      setData((d) =>
        update(d, {
          contents: {
            [index]: {
              slide: {
                $apply: (slide?: SlideItemTypes[]) =>
                  slide ? slide.concat(item) : [item],
              },
            },
          },
        })
      );
    }
  };

  return (
    <PEPanel
      content={content}
      contentKey={content.key}
      index={index}
      noContainer
      startActions={
        <PostSelect onChange={handleChangePost} clearValueAfterConfirm>
          <IconButton size="small">
            <PickIcon icon={"plus"} />
          </IconButton>
        </PostSelect>
      }
    ></PEPanel>
  );
};
