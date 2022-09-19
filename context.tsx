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
  Theme,
  ThemeOptions,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { deepmerge } from "@mui/utils";
import { defaultTheme } from "./default.theme";
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
import { library, IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faArrows,
  faArrowsV,
  faBan,
  faBars,
  faBook,
  faBookOpen,
  faCactus,
  faCalendar,
  faCamera,
  faCaretDown,
  faCheck,
  faCheckCircle,
  faCheckSquare,
  faChevronDown,
  faChevronLeft,
  faChevronUp,
  faCircle,
  faClock,
  faCog,
  faCopy,
  faCopyright,
  faDiagramPredecessor,
  faDownload,
  faEdit,
  faEllipsisV,
  faEye,
  faEyeSlash,
  faFileAlt,
  faFolder,
  faFolderOpen,
  faGripLines,
  faHeading,
  faHorizontalRule,
  faImage,
  faImages,
  faInfoCircle,
  faLink,
  faListUl,
  faMobile,
  faNewspaper,
  faPaperclip,
  faPaperPlane,
  faParagraph,
  faPlus,
  faQuestion,
  faRedo,
  faRetweet,
  faSave,
  faSignIn,
  faSignOut,
  faSpinner,
  faTable,
  faTimesCircle,
  faTrash,
  faTv,
  faUnlink,
  faUpload,
  faUserPlus,
  faVideo,
  faXmark,
} from "@fortawesome/pro-regular-svg-icons";
import i18next from "i18next";
import { PopupProvider, PopupTranslate } from "./Popup";
import "./style.css";
import { watchDarkmode } from "./watch.darkmode";

library.add(
  faPaperclip,
  faChevronLeft,
  faFolder,
  faFileAlt,
  faCalendar,
  faClock,
  faBookOpen,
  faFolderOpen,
  faCaretDown,
  faXmark,
  faPaperPlane,
  faHeading,
  faParagraph,
  faImage,
  faTable,
  faNewspaper,
  faImages,
  faBook,
  faVideo,
  faHorizontalRule,
  faPlus,
  faRedo,
  faEdit,
  faBars,
  faEllipsisV,
  faSave,
  faQuestion,
  faAlignLeft,
  faAlignRight,
  faAlignCenter,
  faMobile,
  faTv,
  faArrows,
  faDownload,
  faCheck,
  faCopy,
  faInfoCircle,
  faTrash,
  faEye,
  faCog,
  faBan,
  faSignOut,
  faUpload,
  faChevronDown,
  faSpinner,
  faSignIn,
  faLink,
  faUnlink,
  faCamera,
  faGripLines,
  faDiagramPredecessor,
  faArrowsV,
  faCheckSquare,
  faRetweet,
  faChevronUp,
  faCheckCircle,
  faTimesCircle,
  faCircle,
  faEyeSlash,
  faUserPlus,
  faCopyright,
  faListUl,
  faCactus,
  faChevronLeft
);

// console.log(`Document: https://phra-in.web.app`);

initI18Next();

export type TFunction = (text: string, dict?: Record<string, string>) => string;
export type SystemMode = "default" | "dark" | "light";
export type SystemState = {
  darkmode: boolean;
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
    darkmode: false,
    mode: "default",
  },
  setSystemState: () => {},
});

export const CoreProvider = React.memo(
  (props: { children: ReactNode } & CoreProviderProps) => {
    const { t } = useTranslation();
    const [fb, setFB] = useState<CoreContextTypes["fb"]>(null);
    const [user, setUser] = useState<CoreContextTypes["user"]>({
      loading: true,
      data: null,
      claims: null,
    });
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const [systemState, setSystemState] = useState<SystemState>({
      darkmode: false,
      mode: "default",
    });

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
            setUser((s) => ({
              ...s,
              loading: false,
              data: null,
              claims: null,
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
      const mode = localStorage.getItem("mode");
      if (mode) {
        setSystemState((s) => ({ ...s, mode: mode as SystemMode }));
      }
    }, []);

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
        </CoreContext.Provider>
      </ThemeProvider>
    );
  }
);

export const useCore = () => useContext(CoreContext);
