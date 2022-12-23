import {
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
} from "@mui/material";
import { Fragment } from "react";
import { useBookView } from ".";
import { BackLink } from "../BackLink";
import { useCore } from "../context";
import { PickIcon } from "../PickIcon";
import { Folder, ListItemChildPost } from "./folder";
import { BookViewTitle } from "./title";

const ListItemPost = styled(ListItemChildPost)({
  borderRight: `solid 4px currentColor`,
  "&.Mui-selected": {
    borderRight: `none`,
  },
});

export const BookViewSidebar = () => {
  const { t } = useCore();
  const { back, onBack, value, selected, setSelect } = useBookView();

  const handleSelect = (key: string) => () => setSelect(key);

  return (
    <Fragment>
      <div>
        {onBack && (
          <ListItem divider>
            <Button
              color="neutral"
              startIcon={<PickIcon icon="chevron-left" />}
              onClick={onBack}
            >
              {t("Back")}
            </Button>
          </ListItem>
        )}
        {Boolean(back) && typeof back === "string" ? (
          <BackLink divider to={back} />
        ) : (
          back
        )}
        <BookViewTitle
          title={value?.title}
          userId={value?.user}
          selected={selected === "cover"}
          onClick={handleSelect("cover")}
        />
        <ListItem divider>
          <Stack flex={1} spacing={1}>
            {value?.contents?.map((content) => {
              switch (content.type) {
                case "folder":
                  return (
                    <Folder
                      label={content.title}
                      length={content.items?.length}
                      key={content.key}
                    >
                      {content.items?.map((item, index, items) => (
                        <ListItemChildPost
                          divider={items.length - 1 > index}
                          dense
                          key={item.key}
                          selected={selected === item.key}
                          onClick={handleSelect(item.key)}
                        >
                          <ListItemIcon>
                            <PickIcon icon={"file-alt"} />
                          </ListItemIcon>
                          <ListItemText primary={item.title} />
                        </ListItemChildPost>
                      ))}
                      {!Boolean(content.items?.length) && (
                        <ListItemButton disabled dense>
                          <ListItemText secondary="No Item" />
                        </ListItemButton>
                      )}
                    </Folder>
                  );
                default:
                  return (
                    <ListItemPost
                      dense
                      key={content.key}
                      onClick={handleSelect(content.key)}
                      selected={selected === content.key}
                    >
                      <ListItemIcon>
                        <PickIcon icon={"file-alt"} />
                      </ListItemIcon>
                      <ListItemText primary={content.title} />
                    </ListItemPost>
                  );
              }
            })}
          </Stack>
        </ListItem>
      </div>
    </Fragment>
  );
};
