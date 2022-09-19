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
import { useBookEdit } from ".";
import { useCore } from "../context";
import { BookContent, BookContentItem } from "../Controller";
import { KuiActionIcon } from "../KuiActionIcon";
import { usePopup } from "../Popup";
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
  const { data, setData } = useBookEdit();
  const { Popup } = usePopup();

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
    (folderIndex: number, itemIndex:number, content: BookContentItem) => () => {
      Popup.remove({
        title: t("Remove"),
        text: t("DoYouWantToRemove", { name: content.title }),
        icon: "trash",
        onConfirm: () => {
          setData((d) => BookEditCtl.remove.sub(d, folderIndex, itemIndex));
        },
      });
    };

  return (
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
                    <KuiActionIcon tx="edit" />
                    <KuiActionIcon
                      tx="remove"
                      onClick={handleRemoveFolder(content)}
                    />
                  </ListItemSecondaryAction>
                </ListItemFolder>
                <ListItemFolderSub>
                  {content.items?.map((item, itemIndex) => (
                    <ListItemPost key={item.key}>
                      <ListItemIcon>
                        <FontAwesomeIcon size="2x" icon={["far", "file-alt"]} />
                      </ListItemIcon>
                      <ListItemText primary={item.title} />
                      <ListItemSecondaryAction>
                        <KuiActionIcon tx="edit" />
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
                  <KuiActionIcon tx="edit" />
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
  );
};
