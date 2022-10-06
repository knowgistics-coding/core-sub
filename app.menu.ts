import * as React from "react";
import { To } from "react-router-dom";
import { FirebaseApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";
import { PickIconName } from "./PickIcon";

export type AppMenu = {
  icon?: PickIconName;
  label?: React.ReactNode;
  to?: To;
  href?: string;
  type: "a" | "Link" | "divider";
};

export const getAppMenu = async (app: FirebaseApp): Promise<AppMenu[]> => {
  const data = (await get(ref(getDatabase(app), `menus`))).val() as AppMenu[];
  return data;
};
