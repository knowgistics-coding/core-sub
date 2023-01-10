import {
  Box,
  IconButton,
  Slide,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useBookView } from ".";
import { useCore } from "../context";
import { apiURL } from "../Controller";
import { Counter } from "../Counter";
import { PickIcon } from "../PickIcon";

const VerticalLine = styled("span")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  "&:before": {
    content: '"|"',
    display: "inline-block",
  },
}));

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
  alignItems: "center",
  width: "100%",
  maxWidth: theme.breakpoints.values.sm,
  padding: theme.spacing(3),
  boxSizing: "border-box",
}));

const ReadIcon = styled(IconButton)(({ theme }) => ({
  fontSize: theme.spacing(8),
  padding: 0,
  color: "white"
}));

export const BookViewCover = () => {
  const { t } = useCore();
  const { value, selected, setSelect, pages, user } = useBookView();

  const handleOpen = () => pages.length && setSelect(pages[0]);

  return (
    <Slide in={Boolean(selected === "cover")}>
      <Root bg={value?.feature?.image?._id}>
        <Toolbar />
        <Content>
          <Wrapper>
            <Typography variant="body1" sx={{ mb: 3 }}>
              <PickIcon icon="book" style={{ marginRight: "1ch" }} />
              {t("BOOK")}
            </Typography>
            <Typography variant="h1" align="center">
              {value?.title}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              <PickIcon icon={"calendar"} style={{ marginRight: "0.5rem" }} />
              {moment(value?.datemodified || new Date()).format("LL")}
              <VerticalLine />
              <PickIcon icon={"clock"} style={{ marginRight: "0.5rem" }} />
              {moment(value?.datemodified || new Date()).format("LT")}
              <VerticalLine />
              <PickIcon icon={"eye"} style={{ marginRight: "0.5rem" }} />
              <Counter id={value?.id} />
            </Typography>
            {value?.displayName && (
              <Typography mb={3}>
                <PickIcon icon="user" /> {value?.displayName ?? user.user?.displayName}
              </Typography>
            )}
            <ReadIcon onClick={handleOpen}>
              <PickIcon icon="circle-chevron-right" />
            </ReadIcon>
          </Wrapper>
        </Content>
      </Root>
    </Slide>
  );
};
