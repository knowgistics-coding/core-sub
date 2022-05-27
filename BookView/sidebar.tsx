import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
import { TitleSidebar } from "../TitleSidebar";
import { Folder, ListItemChildPost } from "./folder";

const ListItemPost = styled(ListItemChildPost)({
  borderRight: `solid 4px currentColor`,
  "&.Mui-selected": {
    borderRight: `none`,
  },
});

export const BookViewSidebar = () => {
  const { back, value, selected, setSelect } = useBookView();

  const handleSelect = (key: string) => () => setSelect(key);

  return (
    <Fragment>
      <div>
        {back && <BackLink divider to={back} />}
        <TitleSidebar
          dense
          divider
          title={value?.title}
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
                      label={content.label}
                      length={content.folder?.length}
                      key={content.key}
                    >
                      {content.folder?.map((item, index, items) => (
                        <ListItemChildPost
                          divider={items.length - 1 > index}
                          dense
                          key={item.key}
                          selected={selected === item.key}
                          onClick={handleSelect(item.key)}
                        >
                          <ListItemIcon>
                            <FontAwesomeIcon icon={["far", "file-alt"]} />
                          </ListItemIcon>
                          <ListItemText primary={item.label} />
                        </ListItemChildPost>
                      ))}
                      {!Boolean(content.folder?.length) && (
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
                        <FontAwesomeIcon icon={["far", "file-alt"]} />
                      </ListItemIcon>
                      <ListItemText primary={content.label} />
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
