import { alpha, Box, Pagination, styled } from "@mui/material";
import * as React from "react";
import { Container } from "../Container";
import { ContentHeaderProps } from "../ContentHeader";
import { Book } from "../Controller/book";
import { Post } from "../Controller/post";
import { MainContainer } from "../MainContainer";
import { NotFound } from "../NotFound";
import { PageViewer } from "../PageViewer";
import { BookViewCover } from "./cover";
import { BookViewSidebar } from "./sidebar";

export interface BookViewProps {
  loading?: boolean;
  back?: string;
  value?: Book;
  posts?: Record<string, Post>;
  breadcrumbs?: ContentHeaderProps["breadcrumbs"];
}

const BookViewContext = React.createContext<
  BookViewProps & {
    selected: string;
    setSelect: React.Dispatch<React.SetStateAction<string>>;
    pages: string[];
    pagesPost: Record<string, string>;
  }
>({
  selected: "",
  setSelect: () => {},
  pages: [],
  pagesPost: {},
});

export const useBookView = () => React.useContext(BookViewContext);

const Paginate = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  backgroundColor: alpha(theme.palette.background.paper, 0.25),
  padding: theme.spacing(3, 0),
  backdropFilter: "blur(3px)",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.sidebarWidth,
  },
}));

export const BookView = (props: BookViewProps) => {
  const [selected, setSelect] = React.useState<string>("cover");
  const pages =
    props.value?.contents?.reduce((total: string[], content) => {
      if (content.type === "item") {
        return total.concat(content.key);
      } else if (content.type === "folder" && content.items?.length) {
        return total.concat(...content.items.map((item) => item.key));
      }
      return total;
    }, []) || [];
  const pagesPost =
    Object.assign(
      {},
      ...(props.value?.contents?.reduce(
        (total: Record<string, string>[], content) => {
          if (content.type === "item" && content.value) {
            return total.concat({ [content.key]: content.value });
          } else if (content.type === "folder" && content.items?.length) {
            return total.concat(
              ...content.items.map((item) => ({ [item.key]: item.value! }))
            );
          }
          return total;
        },
        []
      ) || [])
    ) || {};

  return (
    <BookViewContext.Provider
      value={{ ...props, selected, setSelect, pages, pagesPost }}
    >
      <MainContainer
        loading={props.loading}
        dense
        sidebar={<BookViewSidebar />}
      >
        {props.posts?.[pagesPost[selected]] ? (
          <PageViewer
            maxWidth="post"
            breadcrumbs={[
              { label: "Home", to: "/" },
              { label: props.value?.title || "Book" },
              { label: props.posts?.[pagesPost[selected]]?.title },
            ]}
            data={props.posts?.[pagesPost[selected]].toJSON()}
            noContainer
          />
        ) : (
          <NotFound noButton />
        )}
        <Box sx={{ pb: 12 }} />
        <Paginate>
          <Container maxWidth="post">
            <Box display={"flex"} justifyContent="center">
              <Pagination
                page={
                  pages.indexOf(selected) > -1 ? pages.indexOf(selected) + 1 : 1
                }
                count={pages.length}
                onChange={(_e, page) => setSelect(pages[page - 1] || "cover")}
              />
            </Box>
          </Container>
        </Paginate>
        <BookViewCover />
      </MainContainer>
    </BookViewContext.Provider>
  );
};
