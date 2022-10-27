import * as React from "react";
import { BackLink } from "../BackLink";
import { Container } from "../Container";
import { Breadcrumb, ContentHeader } from "../ContentHeader";
import { useCore } from "../context";
import { Book } from "../Controller/book";
import { Post } from "../Controller/post";
import { FabGroup, FabIcon } from "../FabGroup";
import { FeatureImageEdit } from "../FeatureImage";
import { MainContainer, MainContainerProps } from "../MainContainer";
import { usePopup } from "../Popup";
import { TitleEdit } from "../TitleEdit";
import { VisibilityEdit } from "../VisibilityEdit";
import { BookEditContents } from "./contents";
import { PostAdd } from "./post.add";
import { AddToFolder } from "./post.to.folder";

type StateType = {
  MoveID: string;
};

export type BookEditProps = {
  breadcrumbs?: Breadcrumb[];
  data: Book;
  setData: (data: Book) => void;
  containerProps?: Omit<MainContainerProps, "children" | "sidebar">;
  onSave: () => void;
};

type contentType = Pick<BookEditProps, "data" | "setData" | "onSave"> & {
  state: StateType;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
  data: Book;
  setData: (data: Book) => void;
};

export const BookEditContext = React.createContext<contentType>({
  data: new Book({ user: "" }),
  setData: () => {},
  state: { MoveID: "" },
  setState: () => {},
  onSave: () => {},
});
export const useBookEdit = () => React.useContext(BookEditContext);

export const BookEdit = (props: BookEditProps) => {
  const { t } = useCore();
  const { Popup } = usePopup();
  const [open, setOpen] = React.useState<boolean>(false);
  const [state, setState] = React.useState<StateType>({ MoveID: "" });

  const handleChangeField =
    <Key extends keyof Book>(field: Key) =>
    (value: Book[Key]) => {
      props.setData(props.data.set(field, value));
    };
  const handleAddFolder = () => {
    Popup.prompt({
      title: t("Create $Name", { name: t("Chapter") }),
      text: t("$Name Name", { name: t("Chapter") }),
      icon: "plus-circle",
      onConfirm: (value) => {
        if (value) {
          props.setData(props.data.addFolder(value));
        }
      },
    });
  };
  const handleAddPost = async (posts: Post[]) => {
    if (posts) {
      posts?.forEach((post) => {
        props.setData(props.data.addPost(post));
      });
      setOpen(false);
    }
  };

  return (
    <BookEditContext.Provider
      value={{
        data: props.data,
        setData: props.setData,
        state,
        setState,
        onSave: props.onSave,
      }}
    >
      <MainContainer
        signInOnly
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
            <VisibilityEdit
              value={props.data.visibility}
              onChange={handleChangeField("visibility")}
            />
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
          <FabIcon icon="save" color="success" onClick={props.onSave} />
        </FabGroup>
        <PostAdd
          open={open}
          onClose={() => setOpen(false)}
          onAddPost={handleAddPost}
        />
        <AddToFolder
          open={Boolean(state.MoveID)}
          onClose={() => setState((s) => ({ ...s, MoveID: "" }))}
        />
      </MainContainer>
    </BookEditContext.Provider>
  );
};
