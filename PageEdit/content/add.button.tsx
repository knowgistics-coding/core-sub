import { Fab } from "@mui/material";
import { debounce } from "lodash";
import React from "react";
import { PickIcon } from "../../PickIcon";
import { ShowTypes, usePE } from "../context";
import { Blocks } from "./blocks";

const scrollToBottom = debounce(() => {
  window.scrollTo(0, document.body.scrollHeight);
}, 250)

export const PEContentAddButton = () => {
  const { show, setData, pageData } = usePE();
  const handleAddContent = (type: ShowTypes) => () => {
    setData(pageData.content.add(type).toJSON());
    scrollToBottom()
  };

  return (
    <React.Fragment>
      {Blocks.filter((block) => show.includes(block.key)).map((block) => (
        <Fab
          size="small"
          color="info"
          key={block.key}
          onClick={handleAddContent(block.key)}
        >
          <PickIcon icon={block.icon} />
        </Fab>
      ))}
    </React.Fragment>
  );
};
