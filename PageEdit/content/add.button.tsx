import { Fab, Tooltip } from "@mui/material";
import { debounce } from "lodash";
import React from "react";
import { ShowTypes } from "../../Controller/page";
import { PickIcon } from "../../PickIcon";
import { usePE } from "../context";
import { Blocks } from "./blocks";

const scrollToBottom = debounce(() => {
  window.scrollTo(0, document.body.scrollHeight);
}, 250);

export const PEContentAddButton = () => {
  const { show, data, setData } = usePE();
  const handleAddContent = (type: ShowTypes) => () => {
    setData(data.contentAdd(type));
    scrollToBottom();
  };

  return (
    <React.Fragment>
      {Blocks.filter((block) => show.includes(block.key)).map((block) => (
        <Tooltip placement="left-end" title={block.title} key={block.key}>
          <Fab size="small" color="info" onClick={handleAddContent(block.key)}>
            <PickIcon icon={block.icon} />
          </Fab>
        </Tooltip>
      ))}
    </React.Fragment>
  );
};
