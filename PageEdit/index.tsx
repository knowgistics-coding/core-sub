import { useState } from "react";
import update from "react-addons-update";
import { DialogRemove } from "../DialogRemove";
import { MainContainer } from "../MainContainer";
import { PEContent } from "./content";
import { PEContext, PageEditProps, PageEditStateTypes } from "./context";
import { DialogManager } from "./dialog.manager";
import { DialogImageRatio } from "./dialog/image.ratio";
import { PESidebar } from "./sidebar";

export * from "./context";

export const PageEdit = ({ children, ...props }: PageEditProps) => {
  const [state, setState] = useState<PageEditStateTypes>({
    loading: false,
    focus: null,
    hideToolbar: false,
    remove: -1,
    selected: [],
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
        <DialogRemove
          open={state.remove > -1}
          onClose={() => setState((s) => ({ ...s, remove: -1 }))}
          onConfirm={() => {
            if (props.data.contents) {
              props.setData((d) =>
                update(d, { contents: { $splice: [[state.remove, 1]] } })
              );
              setState((s) => ({ ...s, remove: -1 }));
            }
          }}
        />
        <DialogImageRatio />
      </DialogManager>
    </PEContext.Provider>
  );
};
