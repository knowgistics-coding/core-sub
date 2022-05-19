import { Alert, styled } from "@mui/material";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AlertProps } from "@mui/material";
import update from "react-addons-update";
import { genKey } from "draft-js";

const Root = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  maxWidth: theme.sidebarWidth,
  zIndex: 1301,
  "&>:not(:last-child)": {
    marginBottom: theme.spacing(1),
  },
}));

export interface AlertType {
  label: React.ReactNode;
  severity?: AlertProps["severity"];
  key?: string;
  aid?: string;
}

export type AlertContextTypes = {
  addAlert: (item: AlertType) => void;
  removeAlert: (key: string) => void;
};
const AlertContext = createContext<AlertContextTypes>({
  addAlert: () => {},
  removeAlert: () => {},
});

const AlertIitem = ({ label, ...props }: AlertType) => {
  const { removeAlert } = useContext(AlertContext);

  useEffect(() => {
    setTimeout(() => {
      if (props.aid) {
        removeAlert(props.aid);
      }
    }, 5000);
  }, [props.aid, removeAlert]);

  return (
    <Alert
      variant="filled"
      {...props}
      onClose={() => props.aid && removeAlert(props.aid)}
    >
      {label}
    </Alert>
  );
};

export const Alerts = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<AlertType[]>([]);

  const addAlert = useCallback(
    (newItem: AlertType) =>
      setItems((items) =>
        update(items, { $push: [{ ...newItem, aid: genKey() }] })
      ),
    []
  );
  const removeAlert = useCallback(
    (key: string) =>
      setItems((items) => items.filter((item) => item.aid !== key)),
    []
  );

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      {children}
      <Root>
        {items.map((item) => (
          <AlertIitem {...item} key={item.aid} />
        ))}
      </Root>
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
