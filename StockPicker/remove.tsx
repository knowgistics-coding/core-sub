import React from "react";
import { KuiButton } from "../KuiButton";
import { useSP } from "./context";
import { usePopup } from "../Popup";
import { useCore } from "../context";

export const SPRemove = () => {
  const { t } = useCore();
  const { state, setState, control } = useSP();
  const { Popup } = usePopup();

  const handleRemove = () => {
    Popup.remove({
      title: t("Remove"),
      text: t("DoYouWantToRemove", { name: t("Selected") }),
      icon: "trash",
      onConfirm: async () => {
        setState((s) => ({ ...s, loading: true }));
        if (control && state.selected.length) {
          const promises = state.selected.map(
            async (id) => await control.remove(id)
          );
          await Promise.all(promises);
          setState((s) => ({
            ...s,
            selected: [],
            docs: s.docs.filter((doc) => !s.selected.includes(doc._id)),
          }));
        }
        setState((s) => ({ ...s, loading: false }));
      },
    });
  };

  return state.selected.length ? (
    <React.Fragment>
      &nbsp;
      <KuiButton variant="outlined" tx="remove" onClick={handleRemove} />
    </React.Fragment>
  ) : null;
};
