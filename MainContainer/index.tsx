import { Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Loading } from "../Loading";
import { SignIn } from "../SignIn";
import { MCAppbar } from "./appbar";
import { MCContent } from "./content";
import { MainContainerProps, MCContext, MCContextTypes } from "./ctx";
import { MCProfileMenu } from "./profile.menu";
import { MCSetting } from "./setting";
import { MCSidebar } from "./sidebar";
import { useCore } from "../context";
import { MCRestrict } from "./restrict";
import { ProfileMenuNotSign } from "./profile.menu.not.sign";
import "./style.css";
import { MCSignInBox } from "./signin.box";
import { MCRightbar } from "./rightbar";
import { useLocation } from "react-router-dom";
import { CrossSite } from "../Controller/cross.site";
import { FilePicker } from "../FilePicker";

export * from "./ctx";
export const MainContainer = (props: MainContainerProps) => {
  const { user } = useCore();
  const [open, setOpen] = useState<MCContextTypes["open"]>({
    sidebar: true,
    setting: false,
    signin: false,
  });
  const [state, setState] = useState<MCContextTypes["state"]>({
    anchorProfile: null,
    onFilePickerConfirm: null
  });
  const location = useLocation();

  const store = {
    ...props,
    user,
    open,
    handleOpen: (key: string, value: boolean) => () =>
      setOpen((o) => ({ ...o, [key]: value })),
    state,
    setState,
  };

  useEffect(() => {
    if(props.title){
      document.title = `${props.title} | ${process.env.REACT_APP_SITE_NAME}`
    } else if(process.env.NODE_ENV === "development") {
      console.log(`Please add props title to MainContainer`);
    }
  }, [props.title])

  useEffect(() => {
    if (user.loading === false && user.data && location.hash) {
      CrossSite.init(user.data, location.hash);
    }
  }, [user, location.hash]);

  if (props.signInOnly) {
    if (user.loading) {
      return <Loading />;
    } else if (!user.data) {
      return <SignIn />;
    }
  }

  if (props.loading) {
    return <Loading maxWidth={props.maxWidth} />;
  }

  if (props.restrict) {
    return (
      <MCContext.Provider value={store}>
        <Toolbar />
        <MCContent>
          <MCRestrict {...props.restrictProps} />
        </MCContent>
        <MCAppbar />
      </MCContext.Provider>
    );
  }

  return (
    <MCContext.Provider value={store}>
      <ProfileMenuNotSign>
        <Toolbar />
        <MCContent>{props.children}</MCContent>
        <MCSidebar />
        <MCRightbar />
        <MCAppbar />
        <MCProfileMenu />
        <MCSetting />
      </ProfileMenuNotSign>
      <MCSignInBox />
      <FilePicker />
    </MCContext.Provider>
  );
};

export default MainContainer;
