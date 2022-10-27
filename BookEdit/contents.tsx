import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemSecondaryAction,
  ListItemText,
  styled,
} from "@mui/material";
import { useBookEdit } from ".";
import { ActionIcon } from "../ActionIcon";
import { useCore } from "../context";
import { BookContent, BookContentItem } from "../Controller/book";
import { KuiActionIcon } from "../KuiActionIcon";
import { PickIcon } from "../PickIcon";
import { usePopup } from "../Popup";

const ListStyled = styled(List)(({ theme }) => ({
  "&>div:not(:last-child)": {
    marginBottom: theme.spacing(1),
  },
}));

const ListItemPost = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${theme.palette.divider}`,
}));

const ListItemFolder = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.neutral.main,
  color: theme.palette.neutral.contrastText,
  border: `solid 1px ${theme.palette.divider}`,
}));

const ListItemFolderSub = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  border: `solid 1px ${theme.palette.neutral.main}`,
  "&>*:not(:last-child)": {
    marginBottom: theme.spacing(1),
  },
}));

const ListItemNoRows = styled(
  ({ text, ...props }: ListItemProps & { text: string }) => (
    <ListItem {...props}>
      <ListItemText secondary={text} />
    </ListItem>
  )
)<{
  text: string;
}>(({ theme }) => ({
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: theme.palette.divider,
}));

export const BookEditContents = () => {
  const { t } = useCore();
  const { data, setData, setState } = useBookEdit();
  const { Popup } = usePopup();

  const handleEditTitleFolder = (index: number) => () => {
    if (data.contents) {
      Popup.prompt({
        title: t("Edit $Name", { name: t("Title") }),
        text: t("Title"),
        icon: "plus-circle",
        onConfirm: (value) => {
          if (value) {
            setData(data.setContent(index, "title", value));
          }
        },
      });
    }
  };

  const handleEditTitleOutFolder = (index: number) => () => {
    if (data.contents) {
      Popup.prompt({
        title: t("Edit $Name", { name: t("Title") }),
        text: t("Title"),
        icon: "plus-circle",
        onConfirm: (value) => {
          if (value) {
            setData(data.setContent(index, "title", value));
          }
        },
      });
    }
  };

  const handleEditTitleInFolder =
    (folderIndex: number, itemIndex: number) => () => {
      if (data.contents) {
        const folder = data?.contents[folderIndex];
        if (folder.items) {
          Popup.prompt({
            title: t("Edit $Name", { name: t("Title") }),
            text: t("Title"),
            icon: "plus-circle",
            onConfirm: (value) => {
              if (value) {
                setData(
                  data.setContentItem(folderIndex, itemIndex, "title", value)
                );
              }
            },
          });
        }
      }
    };

  const handleRemoveFolder = (content: BookContent) => () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: content.title }),
      icon: "trash",
      onConfirm: () => {
        setData(data.removeContent(content.key));
      },
    });
  };
  const handleRemoveSub =
    (folderIndex: number, itemIndex: number, content: BookContentItem) =>
    () => {
      Popup.remove({
        title: t("Remove"),
        text: t("Do You Want To Remove $Name", { name: content.title }),
        icon: "trash",
        onConfirm: () => {
          setData(data.removeContentItem(folderIndex, itemIndex));
        },
      });
    };
  const handleMoveOutFolder = (folderIndex: number, itemIndex: number) => () =>
    setData(data.pullFromFolder(folderIndex, itemIndex));
  const handleMoveUpInFolder = (folderIndex: number, itemIndex: number) => () =>
    setData(data.moveContentItem(folderIndex, itemIndex, itemIndex - 1));
  const handleMoveDownInFolder =
    (folderIndex: number, itemIndex: number) => () =>
      setData(data.moveContentItem(folderIndex, itemIndex, itemIndex + 1));
  const handleMoveUpFolder = (a: number) => () =>
    setData(data.moveContent(a, a - 1));
  const handleMoveDownFolder = (a: number) => () =>
    setData(data.moveContent(a, a + 1));
  const handleMoveUp = (a: number) => () => setData(data.moveContent(a, a - 1));
  const handleMoveDown = (a: number) => () =>
    setData(data.moveContent(a, a + 1));

  return (
    <>
      <ListStyled>
        {data.contents?.map((content, index) => {
          switch (content.type) {
            case "folder":
              return (
                <div key={content.key}>
                  <ListItemFolder>
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <PickIcon size="2x" icon="folder" />
                    </ListItemIcon>
                    <ListItemText primary={content.title} />
                    <ListItemSecondaryAction>
                      {index !== 0 && (
                        <ActionIcon
                          icon={"arrow-up"}
                          onClick={handleMoveUpFolder(index)}
                        />
                      )}
                      {data.contents && index < data?.contents?.length - 1 && (
                        <ActionIcon
                          icon={"arrow-down"}
                          onClick={handleMoveDownFolder(index)}
                        />
                      )}

                      <KuiActionIcon
                        tx="edit"
                        onClick={handleEditTitleFolder(index)}
                      />
                      <KuiActionIcon
                        tx="remove"
                        onClick={handleRemoveFolder(content)}
                      />
                    </ListItemSecondaryAction>
                  </ListItemFolder>
                  <ListItemFolderSub>
                    {content.items?.map((item, itemIndex, items) => (
                      <ListItemPost key={item.key}>
                        <ListItemIcon>
                          <PickIcon size="2x" icon={"file-alt"} />
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                        <ListItemSecondaryAction>
                          {itemIndex !== 0 && (
                            <ActionIcon
                              icon={"arrow-up"}
                              onClick={handleMoveUpInFolder(index, itemIndex)}
                            />
                          )}
                          {(items?.length || 0) - 1 > itemIndex && (
                            <ActionIcon
                              icon={"arrow-down"}
                              onClick={handleMoveDownInFolder(index, itemIndex)}
                            />
                          )}
                          <ActionIcon
                            icon="folder-download"
                            onClick={handleMoveOutFolder(index, itemIndex)}
                          />
                          <KuiActionIcon
                            tx="edit"
                            onClick={handleEditTitleInFolder(index, itemIndex)}
                          />
                          <KuiActionIcon
                            tx="remove"
                            onClick={handleRemoveSub(index, itemIndex, item)}
                          />
                        </ListItemSecondaryAction>
                      </ListItemPost>
                    ))}
                    {(content.items?.length || 0) === 0 && (
                      <ListItemNoRows text={t("No rows")} />
                    )}
                  </ListItemFolderSub>
                </div>
              );
            default:
              return (
                <ListItemPost key={content.key}>
                  <ListItemIcon>
                    <PickIcon size="2x" icon={"file-alt"} />
                  </ListItemIcon>
                  <ListItemText primary={content.title} />
                  <ListItemSecondaryAction>
                    {index !== 0 && (
                      <ActionIcon
                        icon={"arrow-up"}
                        onClick={handleMoveUp(index)}
                      />
                    )}
                    {data.contents && index < data?.contents?.length - 1 && (
                      <ActionIcon
                        icon={"arrow-down"}
                        onClick={handleMoveDown(index)}
                      />
                    )}

                    <ActionIcon
                      icon="folder-upload"
                      onClick={() =>
                        setState((s) => ({ ...s, MoveID: content.key }))
                      }
                    />
                    <KuiActionIcon
                      tx="edit"
                      onClick={handleEditTitleOutFolder(index)}
                    />
                    <KuiActionIcon
                      tx="remove"
                      onClick={handleRemoveFolder(content)}
                    />
                  </ListItemSecondaryAction>
                </ListItemPost>
              );
          }
        })}
        {(data.contents?.length || 0) === 0 && (
          <ListItemNoRows text={t("No rows")} />
        )}
      </ListStyled>
    </>
  );
};
