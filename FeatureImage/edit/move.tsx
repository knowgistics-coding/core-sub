import { Fragment, useState } from "react";
import { ActionIcon } from "../../ActionIcon";
import {
  DialogImagePosition,
  DialogImagePositionProps,
} from "../../DialogImagePosition";
import { StockDisplayImageTypes } from "../../StockDisplay";

export const FIEMove = ({
  image,
  onChange,
}: {
  image: StockDisplayImageTypes;
  onChange: DialogImagePositionProps["onSave"];
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <ActionIcon icon={"arrows"} onClick={() => setOpen(true)} />
      <DialogImagePosition
        image={image}
        open={open}
        onClose={() => setOpen(false)}
        onSave={onChange}
        cover
      />
    </Fragment>
  );
};
