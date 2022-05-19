import * as React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { To } from "react-router-dom";
import { FirebaseApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";

export type AppMenu = {
  icon?: IconProp;
  label?: React.ReactNode;
  to?: To;
  href?: string;
  type: "a" | "Link" | "divider";
};

export const getAppMenu = async (app: FirebaseApp): Promise<AppMenu[]> => {
  const data = (await get(ref(getDatabase(app), `menus`))).val() as AppMenu[];
  return data;
};
