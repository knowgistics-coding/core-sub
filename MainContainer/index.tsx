import { Toolbar } from "@mui/material";
import { useState } from "react";
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
  });

  const store = {
    ...props,
    user,
    open,
    handleOpen: (key: string, value: boolean) => () =>
      setOpen((o) => ({ ...o, [key]: value })),
    state,
    setState,
  };

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
    </MCContext.Provider>
  );
};
