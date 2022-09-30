import { faArrowDown, faArrowUp } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import update from "react-addons-update";
import { useBookEdit } from ".";
import { ActionIcon } from "../ActionIcon";
import { useCore } from "../context";
import { BookContent, BookContentItem } from "../Controller";
import { KuiActionIcon } from "../KuiActionIcon";
import { usePopup } from "../react-popup";
import { BookEditCtl } from "./ctl";

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
        title: t("Edit Title"),
        text: "Out-Folder",
        icon: "plus-circle",
        onConfirm: (value) => {
          if (value) {
            setData((d) =>
              update(d, {
                contents: { [index]: { title: { $set: value } } },
              })
            );
          }
        },
      });
    }
  };

  const handleEditTitleOutFolder = (index: number) => () => {
    if (data.contents) {
      Popup.prompt({
        title: t("Edit Title"),
        text: "Out-Folder",
        icon: "plus-circle",
        onConfirm: (value) => {
          if (value) {
            setData((d) =>
              update(d, {
                contents: { [index]: { title: { $set: value } } },
              })
            );
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
            title: t("Edit Title"),
            text: "In-Folder",
            icon: "plus-circle",
            onConfirm: (value) => {
              if (value) {
                setData((d) =>
                  update(d, {
                    contents: {
                      [folderIndex]: {
                        items: {
                          [itemIndex]: { title: { $set: value } },
                        },
                      },
                    },
                  })
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
      text: t("DoYouWantToRemove", { name: content.title }),
      icon: "trash",
      onConfirm: () => {
        setData((d) => BookEditCtl.remove.item(d, content.key));
      },
    });
  };
  const handleRemoveSub =
    (folderIndex: number, itemIndex: number, content: BookContentItem) =>
    () => {
      Popup.remove({
        title: t("Remove"),
        text: t("DoYouWantToRemove", { name: content.title }),
        icon: "trash",
        onConfirm: () => {
          setData((d) => BookEditCtl.remove.sub(d, folderIndex, itemIndex));
        },
      });
    };

  const handleMoveOutFolder =
    (folderIndex: number, itemIndex: number) => () => {
      setData((d) => BookEditCtl.folder.moveOut(d, folderIndex, itemIndex));
    };

  const handleMoveUpInFolder =
    (folderIndex: number, itemIndex: number) => () => {
      if (data.contents) {
        const folder = data?.contents[folderIndex];
        if (folder.items) {
          if (itemIndex !== 0) {
            const [a, b] = [
              folder.items[itemIndex - 1],
              folder.items[itemIndex],
            ];
            setData((d) =>
              update(d, {
                contents: {
                  [folderIndex]: {
                    items: {
                      [itemIndex]: { $set: a },
                      [itemIndex - 1]: { $set: b },
                    },
                  },
                },
              })
            );
          }
        }
      }
    };

  const handleMoveDownInFolder =
    (folderIndex: number, itemIndex: number) => () => {
      if (data.contents) {
        const folder = data?.contents[folderIndex];
        if (folder.items) {
          const [a, b] = [folder.items[itemIndex + 1], folder.items[itemIndex]];
          setData((d) =>
            update(d, {
              contents: {
                [folderIndex]: {
                  items: {
                    [itemIndex]: { $set: a },
                    [itemIndex + 1]: { $set: b },
                  },
                },
              },
            })
          );
        }
      }
    };

  const handleMoveUpFolder = (a: number) => () => {
    if (data.contents) {
      const [x, y] = [data?.contents[a - 1], data?.contents[a]];
      setData((d) =>
        update(d, {
          contents: { [a]: { $set: x }, [a - 1]: { $set: y } },
        })
      );
    }
  };
  const handleMoveDownFolder = (a: number) => () => {
    if (data.contents) {
      const [x, y] = [data?.contents[a + 1], data?.contents[a]];
      setData((d) =>
        update(d, {
          contents: { [a]: { $set: x }, [a + 1]: { $set: y } },
        })
      );
    }
  };

  const handleMoveUp = (a: number) => () => {
    if (data.contents) {
      const [x, y] = [data?.contents[a - 1], data?.contents[a]];
      setData((d) =>
        update(d, {
          contents: { [a]: { $set: x }, [a - 1]: { $set: y } },
        })
      );
    }
  };
  const handleMoveDown = (a: number) => () => {
    if (data.contents) {
      const [x, y] = [data?.contents[a + 1], data?.contents[a]];
      setData((d) =>
        update(d, {
          contents: { [a]: { $set: x }, [a + 1]: { $set: y } },
        })
      );
    }
  };

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
                      <FontAwesomeIcon size="2x" icon={["far", "folder"]} />
                    </ListItemIcon>
                    <ListItemText primary={content.title} />
                    <ListItemSecondaryAction>
                      {index !== 0 && (
                        <ActionIcon
                          icon={faArrowUp}
                          onClick={handleMoveUpFolder(index)}
                        />
                      )}
                      {data.contents && index < data?.contents?.length - 1 && (
                        <ActionIcon
                          icon={faArrowDown}
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
                          <FontAwesomeIcon
                            size="2x"
                            icon={["far", "file-alt"]}
                          />
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                        <ListItemSecondaryAction>
                          {itemIndex !== 0 && (
                            <ActionIcon
                              icon={faArrowUp}
                              onClick={handleMoveUpInFolder(index, itemIndex)}
                            />
                          )}
                          {(items?.length || 0) - 1 > itemIndex && (
                            <ActionIcon
                              icon={faArrowDown}
                              onClick={handleMoveDownInFolder(index, itemIndex)}
                            />
                          )}
                          <KuiActionIcon
                            tx="restore"
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
                    <FontAwesomeIcon size="2x" icon={["far", "file-alt"]} />
                  </ListItemIcon>
                  <ListItemText primary={content.title} />
                  <ListItemSecondaryAction>
                    {index !== 0 && (
                      <ActionIcon
                        icon={faArrowUp}
                        onClick={handleMoveUp(index)}
                      />
                    )}
                    {data.contents && index < data?.contents?.length - 1 && (
                      <ActionIcon
                        icon={faArrowDown}
                        onClick={handleMoveDown(index)}
                      />
                    )}

                    <KuiActionIcon
                      tx="add"
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
