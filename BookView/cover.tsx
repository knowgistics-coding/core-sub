import {
  Box,
  IconButton,
  Slide,
  Stack,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { useBookView } from ".";
import { useCore } from "../context";
import { apiURL, DateCtl } from "../Controller";
import { Counter } from "../Counter";
import { CoverUser } from "../CoverUser";
import { PickIcon } from "../PickIcon";

const VerticalLine = styled("span")(({ theme }) => ({
  padding: theme.spacing(0, 0.5),
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
  color: "white",
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
            <Typography variant="body1" sx={{ mb: 3 }}>
              <PickIcon icon="book" style={{ marginRight: "1ch" }} />
              {t("BOOK")}
            </Typography>
            <Typography variant="h1" align="center">
              {value?.title}
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <PickIcon icon={"calendar"} />
                <span>{DateCtl.toCoverDate(value?.datemodified)}</span>
                <VerticalLine />
                <PickIcon icon={"clock"} />
                <span>{DateCtl.toCoverTime(value?.datemodified)}</span>
                <VerticalLine />
                <PickIcon icon={"eye"} />
                <span>
                  <Counter id={value?.id} />
                </span>
              </Stack>
            </Typography>
            {value?.user && <CoverUser value={value.user} sx={{ mb: 3 }} />}
            <ReadIcon onClick={handleOpen}>
              <PickIcon icon="circle-chevron-right" />
            </ReadIcon>
          </Wrapper>
        </Content>
      </Root>
    </Slide>
  );
};
