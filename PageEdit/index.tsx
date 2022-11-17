import { useState } from "react";
import { MainContainer } from "../MainContainer";
import { PEContent } from "./content";
import { PEContext, PageEditProps, PageEditStateTypes } from "./context";
import { DialogManager } from "./dialog.manager";
import { DialogImagePosition } from "./dialog/image.pos";
import { DialogImageRatio } from "./dialog/image.ratio";
import { DialogInsert } from "./dialog/insert";
import { PESidebar } from "./sidebar";

export * from "./context";
export { PageEditData } from "./ctl";

export const PageEdit = ({ children, ...props }: PageEditProps) => {
  const [state, setState] = useState<PageEditStateTypes>({
    loading: false,
    focus: null,
    hideToolbar: false,
    remove: -1,
    selected: [],
    insert: null,
  });

  return (
    <PEContext.Provider
      value={{
        ...props,
        state,
        setState,
      }}
    >
      <DialogManager>
        <MainContainer
          dense
          {...props.mainContainerProps}
          sidebar={<PESidebar />}
        >
          <PEContent />
          {children}
        </MainContainer>
        <DialogImageRatio />
        <DialogImagePosition />
        <DialogInsert />
      </DialogManager>
    </PEContext.Provider>
  );
};
