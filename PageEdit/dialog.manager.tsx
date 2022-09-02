import * as React from "react";

const Context = React.createContext<{
  open: Record<string, boolean>;
  setOpen: (key: string, field:string, value: boolean) => void;
  isOpen: (key: string) => boolean;
  key: string | number;
  setKey: React.Dispatch<React.SetStateAction<string | number>>;
}>({
  open: {},
  setOpen: () => {},
  isOpen: () => false,
  key: "",
  setKey: () => {},
});
export const useDialog = () => React.useContext(Context);

export interface DialogManagerProps {
  children?: React.ReactNode;
}

export const DialogManager = (props: DialogManagerProps) => {
  const [key, setKey] = React.useState<string | number>("");
  const [open, setStateOpen] = React.useState<Record<string, boolean>>({});

  const isOpen = (key: string) => Boolean(open[key]);
  const setOpen = (key: string, field:string, value: boolean) => {
    setStateOpen((s) => ({ ...s, [field]: value }));
    setKey(key)
  }

  return (
    <Context.Provider value={{ open, setOpen, isOpen, key, setKey }}>
      {props.children}
    </Context.Provider>
  );
};
