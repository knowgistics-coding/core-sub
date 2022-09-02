import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Slide, styled, Toolbar, Typography } from "@mui/material";
import moment from "moment";
import { useBookView } from ".";
import { useCore } from "../context";
import { apiURL } from "../Controller";

const Root = styled(Box, { shouldForwardProp: (prop) => prop !== "bg" })<{
  bg?: string;
}>(({ bg }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: `rgba(0,0,0,0.75)`,
  zIndex: 1100,
  display: "flex",
  flexDirection: "column",
  backgroundImage: bg ? `url("${apiURL}/file/id/${bg}")` : undefined,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
}));

const Content = styled(Box)(() => ({
  flex: 1,
  backgroundColor: `rgba(0,0,0,0.5)`,
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  maxWidth: theme.sidebarWidth,
  alignItems: "center",
}));

export const BookViewCover = () => {
  const { t } = useCore();
  const { value, selected, setSelect, pages } = useBookView();

  const handleOpen = () => pages.length && setSelect(pages[0]);

  return (
    <Slide in={Boolean(selected === "cover")}>
      <Root bg={value?.feature?.image?._id}>
        <Toolbar />
        <Content>
          <Wrapper>
            <Typography variant="h1">{value?.title}</Typography>
            <Typography variant="caption">
              <FontAwesomeIcon
                icon={["far", "calendar"]}
                style={{ marginRight: "0.5rem" }}
              />
              {moment(value?.datemodified || new Date()).format("LL")}
              <Box display="inline-block" px={1}>
                |
              </Box>
              <FontAwesomeIcon
                icon={["far", "clock"]}
                style={{ marginRight: "0.5rem" }}
              />
              {moment(value?.datemodified || new Date()).format("LT")}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={["far", "book-open"]} />}
              color="light"
              sx={{ mt: 3 }}
              onClick={handleOpen}
            >
              {t("Read")}
            </Button>
          </Wrapper>
        </Content>
      </Root>
    </Slide>
  );
};
