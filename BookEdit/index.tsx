import * as React from "react";
import update from "react-addons-update";
import { BackLink } from "../BackLink";
import { Container } from "../Container";
import { Breadcrumb, ContentHeader } from "../ContentHeader";
import { useCore } from "../context";
import { BookRawData } from "../Controller";
import { FabGroup, FabIcon } from "../FabGroup";
import { FeatureImageEdit } from "../FeatureImage";
import { MainContainer, MainContainerProps } from "../MainContainer";
import { usePopup } from "../react-popup";
import { TitleEdit } from "../TitleEdit";
import { VisibilityEdit } from "../VisibilityEdit";
import { BookEditContents } from "./contents";
import { BookEditCtl } from "./ctl";
import { PostAdd, PostDocument } from "./post.add";
import { AddToFolder } from "./post.to.folder";

type StateType = {
  MoveID: string;
};

export const BookEditContext = React.createContext<{
  state: StateType;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
  data: Partial<BookRawData>;
  setData: React.Dispatch<React.SetStateAction<Partial<BookRawData>>>;
}>({
  data: {},
  setData: () => {},
  state: {MoveID: ""},
  setState: () => {},
});
export const useBookEdit = () => React.useContext(BookEditContext);

export type BookEditProps = {
  breadcrumbs?: Breadcrumb[];
  data: Partial<BookRawData>;
  setData: React.Dispatch<React.SetStateAction<Partial<BookRawData>>>;
  containerProps?: Omit<MainContainerProps, "children" | "sidebar">;
};
export const BookEdit = (props: BookEditProps) => {
  const { t } = useCore();
  const { Popup } = usePopup();
  const [open, setOpen] = React.useState<boolean>(false);
  const [state, setState] = React.useState<StateType>({MoveID: ""})

  const handleChangeField =
    <Key extends keyof BookRawData>(field: Key) =>
    (value: BookRawData[Key]) => {
      props.setData((d) => update(d, { [field]: { $set: value } }));
    };
  const handleAddFolder = () => {
    Popup.prompt({
      title: t("Create $Name", { name: t("Chapter") }),
      text: t("$NameName", { name: t("Chapter") }),
      icon: "plus-circle",
      onConfirm: (value) => {
        if (value) {
          props.setData((d) => BookEditCtl.add.folder(d, value));
        }
      },
    });
  };
  const handleAddPost = async (posts: PostDocument[]) => {
    if (posts) {
      posts?.forEach((v) => {
        props.setData((d) => BookEditCtl.add.post(d, v.title));
      });
      setOpen(false);
    }
  };

  return (
    <BookEditContext.Provider
      value={{ data: props.data, setData: props.setData, state, setState }}
    >
      <MainContainer
        sidebar={
          <>
            <BackLink divider to="/" />
            <TitleEdit
              value={props.data.title}
              onChange={handleChangeField("title")}
            />
            <FeatureImageEdit
              value={props.data.feature}
              onChange={handleChangeField("feature")}
              onRemove={() => handleChangeField("feature")(null)}
            />
            <VisibilityEdit onChange={handleChangeField("visibility")} />
          </>
        }
        {...props.containerProps}
      >
        <Container maxWidth="post">
          <ContentHeader
            label={props.data.title}
            breadcrumbs={(props.breadcrumbs || []).concat({
              label: props.data.title || t("No Title"),
            })}
          />
          <pre style={{ fontSize: 12 }}>
            <BookEditContents />
          </pre>
        </Container>
        <FabGroup>
          <FabIcon icon="folder-plus" onClick={handleAddFolder} />
          <FabIcon icon="file-download" onClick={() => setOpen(true)} />
          <FabIcon icon="save" color="success" />
        </FabGroup>
        <PostAdd
          open={open}
          onClose={() => setOpen(false)}
          onAddPost={handleAddPost}
        />
        <AddToFolder open={Boolean(state.MoveID)} onClose={() => setState(s=>({...s, MoveID: ""}))} />
      </MainContainer>
    </BookEditContext.Provider>
  );
};
