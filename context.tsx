import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  createTheme,
  CssBaseline,
  Theme,
  ThemeOptions,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { deepmerge } from "@mui/utils";
import { defaultTheme } from "./default.theme";
import { useTranslation } from "react-i18next";
import { initI18Next } from "./Translate";
import { FirebaseApp } from "firebase/app";
import { Auth, User, getAuth, onIdTokenChanged } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Alerts } from "./Alerts";
import { To } from "react-router-dom";
import { PopupProvider, PopupTranslate } from "./Popup";
import "./style.css";
import { watchDarkmode } from "./watch.darkmode";
import { LocaleKey, TFunction } from "./Translate/en_th";
import { PickIconName } from "./PickIcon";
import { Noti, NotiAction, NotiState } from "./Noti";

if (process.env.NODE_ENV === "development") {
  [
    "REACT_APP_apiKey",
    "REACT_APP_authDomain",
    "REACT_APP_projectId",
    "REACT_APP_storageBucket",
    "REACT_APP_messagingSenderId",
    "REACT_APP_appId",
    "REACT_APP_databaseURL",
    "REACT_APP_SITE_NAME",
    "REACT_APP_DOMAIN",
    "REACT_APP_PREFIX",
    "REACT_APP_LOGO",
    "REACT_APP_ICON_FAV",
    "REACT_APP_ICON_192",
    "REACT_APP_ICON_512",
  ].forEach((key) => {
    if (!Boolean(process.env[key])) {
      console.warn(`ENV "${key}" not found`);
    }
  });
}

export type { TFunction } from "./Translate/en_th";

initI18Next();

export type SystemMode = "default" | "dark" | "light";
export type SystemState = {
  darkmode: boolean;
  mode: SystemMode;
};
export interface userTypes {
  loading: boolean;
  data: User | null;
}
export interface CoreProviderProps {
  theme?: ThemeOptions;
  firebaseConfig?: { [key: string]: string };
  firebaseApp: FirebaseApp;
  onSettingChange?: (key: string, value: any) => void;
  sitename?: LocaleKey;
  logo?: string;
  logoComponent?: string;
  startActions?: React.ReactNode;
  endActions?: React.ReactNode;
  profileMenu?: React.ReactNode;
  appMenu?: {
    icon?: PickIconName;
    label?: React.ReactNode;
    to?: To;
    href?: string;
    type: "Link" | "a" | "divider";
  }[];
}
export interface CoreContextTypes
  extends Omit<CoreProviderProps, "firebaseApp"> {
  firebaseApp?: CoreProviderProps["firebaseApp"];
  isMobile: boolean;
  theme: Theme;
  t: TFunction;
  fb: null | {
    auth: Auth;
    db: Firestore;
  };
  user: userTypes;
  setUser: Dispatch<SetStateAction<userTypes>>;
  open: Record<string, boolean>;
  setOpen: Dispatch<SetStateAction<Record<string, boolean>>>;
  systemState: SystemState;
  setSystemState: Dispatch<SetStateAction<SystemState>>;
  noti: NotiState,
  setNoti: Dispatch<NotiAction>
}

const CoreContext = createContext<CoreContextTypes>({
  isMobile: false,
  theme: createTheme({}),
  t: () => "",
  fb: null,
  user: {
    loading: true,
    data: null,
  },
  setUser: () => {},
  logo: "",
  open: {},
  setOpen: () => {},
  systemState: {
    darkmode: false,
    mode: "default",
  },
  setSystemState: () => {},
  noti: new NotiState(),
  setNoti: () => {}
});

export const CoreProvider = React.memo(
  (props: { children: ReactNode } & CoreProviderProps) => {
    const { t } = useTranslation();
    const [fb, setFB] = useState<CoreContextTypes["fb"]>(null);
    const [user, setUser] = useState<CoreContextTypes["user"]>({
      loading: true,
      data: null,
    });
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const [systemState, setSystemState] = useState<SystemState>({
      darkmode: false,
      mode: "default",
    });
    const [noti,setNoti] = useReducer(NotiState.reducer, new NotiState())

    const getTheme = useCallback((): Theme => {
      const mode: "dark" | "light" =
        systemState.mode === "default"
          ? systemState.darkmode
            ? "dark"
            : "light"
          : (systemState.mode as "dark" | "light");
      return createTheme(deepmerge(defaultTheme(mode === "dark"), props.theme));
    }, [systemState, props.theme]);
    const isMobile = useMediaQuery(getTheme().breakpoints.down("sm"));

    const store = {
      ...props,
      isMobile,
      theme: getTheme(),
      fb,
      user,
      setUser,
      t,
      open,
      setOpen,
      systemState,
      setSystemState,
      noti,
      setNoti
    };

    useEffect(() => {
      if (props.firebaseApp) {
        const auth = getAuth(props.firebaseApp);
        const db = getFirestore(props.firebaseApp);
        if (auth && db) {
          setFB((s) => ({ ...s, auth: auth, db: db }));
        }
        const unwatchIdTokenChanged = onIdTokenChanged(auth, async (data) => {
          if (data) {
            setUser((s) => ({ ...s, loading: false, data }));
          } else {
            setUser((s) => ({
              ...s,
              loading: false,
              data: null,
            }));
          }
        });
        return () => unwatchIdTokenChanged();
      } else {
        return () => {};
      }
    }, [props.firebaseApp]);

    useEffect(() => {
      if (props.firebaseConfig) {
        console.warn(
          "CoreProvider firebaseConfig is deprecated. please change to app"
        );
      }
    }, [props.firebaseConfig]);

    useEffect(() => {
      if (localStorage.getItem("mode")) {
        setSystemState((s) => ({
          ...s,
          mode: localStorage.getItem("mode") as SystemMode,
        }));
      }
      return watchDarkmode((darkmode) => {
        setSystemState((s) => ({ ...s, darkmode }));
      });
    }, []);

    const trans: PopupTranslate = {
      confirm: t("Confirm"),
      remove: t("Remove"),
      cancel: t("Cancel"),
      close: t("Close"),
    };

    return (
      <ThemeProvider theme={store.theme}>
        <CoreContext.Provider value={store}>
          <CssBaseline />
          <Alerts>
            <PopupProvider trans={trans}>{props.children}</PopupProvider>
          </Alerts>
          <Noti />
        </CoreContext.Provider>
      </ThemeProvider>
    );
  }
);

export const useCore = () => useContext(CoreContext);

export default CoreProvider;
