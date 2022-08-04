import * as React from "react";
import { DialogPrompt } from "../../../DialogPrompt";
import type { DialogPromptProps } from "../../../DialogPrompt";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCore } from "components/core-sub/context";

export const Context = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

export const LinkUrl = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  Omit<DialogPromptProps, "open" | "title" | "label" | "onClose">) => {
  const { t } = useCore();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Context.Provider value={{ open, setOpen }}>
      {children}
      <DialogPrompt
        {...props}
        open={open}
        label="URL"
        title={t("Change $Name")}
        onClose={() => setOpen(false)}
      />
    </Context.Provider>
  );
};

export const ListItemURL = () => {
  const { t } = useCore();
  const { setOpen } = React.useContext(Context);

  return (
    <ListItemButton onClick={() => setOpen(true)}>
      <ListItemIcon>
        <FontAwesomeIcon icon={["far", "link"]} />
      </ListItemIcon>
      <ListItemText primary={t("Change $Name", { name: "URL" })} />
    </ListItemButton>
  );
};
