import { IconButton } from "@mui/material";
import { PickIcon } from "../../../PickIcon";
import { PostOptions, usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PostSelect } from "../../post.select";
import { PEEditorProps } from "../heading";

export const PEEditorSlide = ({ content, index }: PEEditorProps) => {
  const { data, setData } = usePE();
  const handleChangePost = (post: PostOptions) => {
    const { id, title, feature } = post;
    if (id && title && feature) {
      setData(
        data.slideAdd(content.key, {
          feature,
          id,
          title,
          link: { from: "post", value: id },
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
