import { Box, Pagination } from "@mui/material";
import * as React from "react";
import { Container } from "../Container";
import { ContentHeaderProps } from "../ContentHeader";
import { BookData } from "../Controller";
import { MainContainer } from "../MainContainer";
import { PageDocument } from "../PageEdit";
import { PageViewer } from "../PageViewer";
import { BookViewCover } from "./cover";
import { BookViewSidebar } from "./sidebar";

export interface BookViewProps {
  loading?: boolean;
  back?: string;
  value?: BookData;
  posts?: Record<string, PageDocument>;
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

export const BookView = (props: BookViewProps) => {
  const [selected, setSelect] = React.useState<string>("cover");
  const pages =
    props.value?.contents?.reduce((total: string[], content) => {
      if (content.type === "post") {
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
          if (content.type === "post" && content.value) {
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
        <Container maxWidth="post">
          {props.posts?.[pagesPost[selected]] && (
            <PageViewer
              breadcrumbs={[
                { label: "Home", to: "/" },
                { label: props.value?.title || "Book" },
                { label: props.posts?.[pagesPost[selected]]?.title },
              ]}
              data={props.posts?.[pagesPost[selected]]}
              noContainer
            />
          )}
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
        <BookViewCover />
      </MainContainer>
    </BookViewContext.Provider>
  );
};
