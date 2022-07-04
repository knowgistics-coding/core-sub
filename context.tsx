import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createTheme,
  CssBaseline,
  darken,
  Theme,
  ThemeOptions,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme } from "./default.theme";
import { useTranslation } from "react-i18next";
import { initI18Next, loadFromFB } from "./Translate";
import { FirebaseApp } from "firebase/app";
import {
  Auth,
  User,
  IdTokenResult,
  getAuth,
  onIdTokenChanged,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Alerts } from "./Alerts";
import type { To } from "react-router-dom";
import { library, IconProp, IconPack } from "@fortawesome/fontawesome-svg-core";
import { fad } from "@fortawesome/pro-duotone-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";
import i18next from "i18next";
import { PopupProvider, PopupTranslate } from "./react-popup";
import "./style.css";

library.add(fad as IconPack, far as IconPack);

console.log(`Document: https://phra-in.web.app`);

initI18Next();

export type SystemMode = "default" | "dark" | "light";
export type SystemState = {
  mode: SystemMode;
};
export interface userTypes {
  loading: boolean;
  data: User | null;
  claims: IdTokenResult | null;
}
export interface CoreProviderProps {
  theme?: ThemeOptions;
  firebaseConfig?: { [key: string]: string };
  firebaseApp: FirebaseApp;
  onSettingChange?: (key: string, value: any) => void;
  sitename?: string;
  logo?: string;
  logoComponent?: string;
  startActions?: React.ReactNode;
  endActions?: React.ReactNode;
  profileMenu?: React.ReactNode;
  appMenu?: {
    icon?: IconProp;
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
  t: (text: string, dict?: { [key: string]: string }) => string;
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
}

const CoreContext = createContext<CoreContextTypes>({
  isMobile: false,
  theme: createTheme({}),
  t: () => "",
  fb: null,
  user: {
    loading: true,
    data: null,
    claims: null,
  },
  setUser: () => {},
  sitename: "",
  logo: "",
  open: {},
  setOpen: () => {},
  systemState: {
    mode: "default",
  },
  setSystemState: () => {},
});

export const CoreProvider = (
  props: { children: ReactNode } & CoreProviderProps
) => {
  const { t } = useTranslation();
  const [fb, setFB] = useState<CoreContextTypes["fb"]>(null);
  const [user, setUser] = useState<CoreContextTypes["user"]>({
    loading: true,
    data: null,
    claims: null,
  });
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [systemState, setSystemState] = useState<{
    mode: SystemMode;
  }>({
    mode: "default",
  });

  if (props?.theme?.palette?.primary) {
    const primary = props?.theme?.palette?.primary as any;
    if (primary.main) {
      props.theme.palette.gradient = {
        main: `linear-gradient(45deg, ${darken(primary.main, 0.5)} 0%, ${
          primary.main
        } 100%)`,
      };
    }
  }

  const getTheme = useCallback((): Theme => {
    let mode = "light";
    if (systemState.mode === "default") {
      const elem = window.matchMedia("(prefers-color-scheme: dark)");
      mode = elem.matches ? "dark" : "light";
    } else {
      mode = systemState.mode;
    }
    if (mode === "dark") {
<<<<<<< HEAD
      return createTheme(
        deepmerge(
          deepmerge(defaultTheme, {
            palette: {
              text: { primary: "#FFF", secondary: "#FFF6" },
              mode: "dark",
            },
          }),
          props.theme
        )
      );
=======
      return createTheme(deepmerge(defaultDarkTheme, props.theme));
>>>>>>> 70f06e81d8ff1092abe2696d3ebc6e9643065f9a
    } else {
      return createTheme(deepmerge(defaultTheme, props.theme));
    }
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
  };

  useEffect(() => {
    if (props.firebaseApp) {
      const auth = getAuth(props.firebaseApp);
      const db = getFirestore(props.firebaseApp);
      if (auth && db) {
        setFB((s) => ({ ...s, auth: auth, db: db }));
      }

      loadFromFB(db).then((langs) => {
        langs.forEach(({ name, value }) =>
          i18next.addResourceBundle(name, "translation", value)
        );
        const current = i18next.language;
        i18next.changeLanguage(current);
      });
      const unwatchIdTokenChanged = onIdTokenChanged(auth, async (data) => {
        if (data) {
          const claims = await data.getIdTokenResult(true);
          setUser((s) => ({
            ...s,
            loading: false,
            data: data,
            claims: claims,
          }));
        } else {
          setUser((s) => ({ ...s, loading: false, data: null, claims: null }));
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
    const mode = localStorage.getItem("mode");
    if (mode) {
      setSystemState((s) => ({ ...s, mode: mode as SystemMode }));
    }
  }, []);

  const trans: PopupTranslate = {
    confirm: t("Confirm"),
    remove: t("Remove"),
    cancel: t("Cancel"),
    close: t("Close"),
  };

  return (
    <ThemeProvider theme={store.theme}>
      <CssBaseline />
      <Alerts>
        <PopupProvider trans={trans}>
          <CoreContext.Provider value={store}>
            {props.children}
          </CoreContext.Provider>
        </PopupProvider>
      </Alerts>
    </ThemeProvider>
  );
};

export const useCore = () => useContext(CoreContext);
