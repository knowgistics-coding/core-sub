import * as React from "react";

export type AbsatzOptionType =
  | "inline"
  | "blockType"
  | "fontSize"
  | "fontFamily"
  | "list"
  | "textAlign"
  | "colorPicker"
  | "link"
  | "embedded"
  | "emoji"
  | "image"
  | "remove"
  | "history";

export type AbsatzInlineType =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "monospace"
  | "superscript"
  | "subscript";

export type AbsatzBlockType =
  | "Normal"
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "H5"
  | "H6"
  | "Blockquote"
  | "Code";

export type AbsatzFontFamilyType =
  | "Arial"
  | "Georgia"
  | "Impact"
  | "Tahoma"
  | "Times New Roman"
  | "Verdana";

export type AbsatzListType = "unordered" | "ordered" | "indent" | "outdent";

export type AbsatzTextAlignType = "left" | "center" | "right" | "justify";

export type AbsatzLinkType = "link" | "unlink";

export type AbsatzHistoryType = "undo" | "redo";

export type AbsatzButtonStyleType = Partial<{
  icon: string;
  className: string;
}>;

export type AbsatzSectionType = {
  inDropdown: boolean;
  className: string;
  component: React.ReactNode;
  dropdownClassName: string;
};

export type AbsatzToolbarType = {
  options?: AbsatzOptionType[];
  inline: AbsatzSectionType & { options: AbsatzInlineType[] } & Record<
      AbsatzInlineType,
      AbsatzButtonStyleType
    >;
  blockType: AbsatzSectionType & { options: AbsatzBlockType[] };
  fontSize: AbsatzSectionType & { icon?: string; options: Number[] };
  fontFamily: AbsatzSectionType & { options: AbsatzFontFamilyType[] };
  list: AbsatzSectionType & { options: AbsatzListType[] } & Record<
      AbsatzListType,
      AbsatzButtonStyleType
    >;
  textAlign: AbsatzSectionType & { options: AbsatzTextAlignType[] } & Record<
      AbsatzTextAlignType,
      AbsatzButtonStyleType
    >;
  colorPicker: AbsatzSectionType & {
    icon: string;
    popupClassName: string;
    colors: string[];
  };
  link: AbsatzSectionType & {
    popupClassName: string;
    showOpenOptionOnHover: boolean;
    defaultTargetOption: "_blank" | "_self" | "_parent" | "_top";
    options: AbsatzLinkType[];
    linkCallback: string;
  } & Record<AbsatzLinkType, AbsatzButtonStyleType>;
  emoji: AbsatzSectionType & {
    icon: string;
    popupClassName: string;
    emojis: string[];
  };
  embedded: AbsatzSectionType & {
    icon?: string;
    popupClassName: string;
    embedCallback: string;
    defaultSize: {
      height: string;
      width: string;
    };
  };
  image: AbsatzSectionType & {
    icon: string;
    popupClassName: undefined;
    urlEnabled: boolean;
    uploadEnabled: boolean;
    alignmentEnabled: boolean;
    uploadCallback: unknown;
    previewImage: boolean;
    inputAccept: string;
    alt: { present: boolean; mandatory: boolean };
    defaultSize: {
      height: string;
      width: string;
    };
  };
  remove: {
    icon: string;
    className: string;
    component: React.ReactNode;
  };
  history: AbsatzSectionType & { options: AbsatzHistoryType[] } & Record<
      AbsatzHistoryType,
      AbsatzButtonStyleType
    >;
};

export type AbsatzToolbarOptionsType = {
  [key in keyof AbsatzToolbarType]?: Partial<AbsatzToolbarType[key]>;
};

export const toolbar = (
  inDropdown: boolean = false
): AbsatzToolbarOptionsType => ({
  options: [
    "inline",
    "textAlign",
    "remove",
    "history",
    "link",
  ],
  inline: {
    inDropdown,
    options: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "superscript",
      "subscript",
    ],
  },
  list: {
    inDropdown,
    options: ["unordered", "ordered", "indent", "outdent"],
  },
  textAlign: {
    inDropdown,
    options: ["left", "center", "right"],
  },
  link: {
    inDropdown,
    showOpenOptionOnHover: true,
    defaultTargetOption: "_self",
    options: ["link", "unlink"],
    linkCallback: undefined,
  },
  image: {
    urlEnabled: true,
    uploadEnabled: true,
    alignmentEnabled: true,
    previewImage: false,
    inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
    alt: { present: false, mandatory: false },
    defaultSize: {
      height: "auto",
      width: "auto",
    },
  },
  history: {
    inDropdown,
    options: ["undo", "redo"],
  },
});
