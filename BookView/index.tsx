import { alpha, Box, Pagination, styled } from "@mui/material";
import * as React from "react";
import ActionIcon from "../ActionIcon";
import { Container } from "../Container";
import { ContentHeaderProps } from "../ContentHeader";
import { useCore } from "../context";
import { Book } from "../Controller/book";
import { Map } from "../Controller/map";
import { Post } from "../Controller/post";
import { User } from "../Controller/user";
import { MainContainer } from "../MainContainer";
import { NotFound } from "../NotFound";
import { PageViewer } from "../PageViewer";
import { BookViewCover } from "./cover";
import { BookViewMaps } from "./maps";
import { BookViewSidebar } from "./sidebar";

export interface BookViewProps {
  loading?: boolean;
  back?: string | React.ReactNode;
  onBack?: () => void;
  value?: Book;
  posts?: Record<string, Post>;
  breadcrumbs?: ContentHeaderProps["breadcrumbs"];
}

type UserState = {
  loading: boolean;
  user: User | null;
  posts: Record<string, Post>;
};

const BookViewContext = React.createContext<
  BookViewProps & {
    selected: string;
    setSelect: React.Dispatch<React.SetStateAction<string>>;
    pages: string[];
    pagesPost: Record<string, string>;
    user: UserState;
    setUser: React.Dispatch<React.SetStateAction<UserState>>;
  }
>({
  selected: "",
  setSelect: () => {},
  pages: [],
  pagesPost: {},
  user: { loading: true, user: null, posts: {} },
  setUser: () => {},
});

export const useBookView = () => React.useContext(BookViewContext);

const Paginate = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  backgroundColor: alpha(theme.palette.neutral.main, 0.25),
  padding: theme.spacing(3, 0),
  backdropFilter: "blur(3px)",
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.sidebarWidth,
  },
  zIndex: theme.zIndex.appBar - 1,
}));

export const BookView = (props: BookViewProps) => {
  const { t } = useCore();
  const [selected, setSelect] = React.useState<string>("cover");
  const [user, setUser] = React.useState<UserState>({
    loading: true,
    user: null,
    posts: {},
  });

  const pages =
    props.value?.contents?.reduce((total: string[], content) => {
      if (content.type === "item") {
        return total.concat(content.key);
      } else if (content.type === "folder" && content.items?.length) {
        return total.concat(...content.items.map((item) => item.key));
      }
      return total;
    }, []) || [];
  const pagesPost: Record<string, string> =
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
  const getPost = React.useCallback(
    (id: string) => {
      if (props.posts?.[id]) {
        return props.posts[id];
      } else if (user.posts?.[id]) {
        return user.posts[id];
      }
    },
    [props.posts, user.posts]
  );
  const getMaps = React.useCallback((): Map[] => {
    if (props.value) {
      const posts = Object.assign({}, user.posts, props.posts);
      return props.value.queryMap(Object.values(posts));
    }
    return [];
  }, [props.value, user.posts, props.posts]);

  const handleMapClick = (id: string) => {
    const posts = Object.values(Object.assign({}, props.posts, user.posts));
    const post = posts.find((post) =>
      post.maps.map((m) => m.id).includes(id)
    );
    if (post) {
      const postsKey = Object.entries(pagesPost).reduce(
        (docs, [key, value]) => Object.assign(docs, { [value]: key }),
        {} as Record<string, string>
      );
      if(postsKey?.[post.id]){
        setSelect(postsKey[post.id]);
      }
    }
  }

  React.useEffect(() => {
    if (!props.posts && props.value) {
      props.value.getPosts().then((posts) => {
        setUser((s) => ({ ...s, posts }));
      });
    }
  }, [props.value, props.posts]);

  return (
    <BookViewContext.Provider
      value={{ ...props, selected, setSelect, pages, pagesPost, user, setUser }}
    >
      <MainContainer
        loading={props.loading}
        dense
        sidebar={<BookViewSidebar />}
        endActions={
          getMaps().length > 0 ? (
            <ActionIcon
              size="large"
              icon="map-location-dot"
              onClick={() => setSelect("maps")}
            />
          ) : undefined
        }
      >
        {["cover", "maps"].includes(selected) === false &&
          (getPost(pagesPost[selected]) ? (
            <PageViewer
              maxWidth="post"
              breadcrumbs={[
                { label: t("Home"), to: "/" },
                { label: props.value?.title || "Book" },
                { label: getPost(pagesPost[selected])?.title },
              ]}
              data={getPost(pagesPost[selected])!}
              noContainer
            />
          ) : (
            <NotFound noButton />
          ))}
        {selected === "maps" ? (
          <BookViewMaps maps={getMaps()} onClick={handleMapClick} />
        ) : (
          <>
            <Box sx={{ pb: 12 }} />
            <Paginate>
              <Container maxWidth="post">
                <Box display={"flex"} justifyContent="center">
                  <Pagination
                    page={
                      pages.indexOf(selected) > -1
                        ? pages.indexOf(selected) + 1
                        : 1
                    }
                    count={pages.length}
                    onChange={(_e, page) => {
                      setSelect(pages[page - 1] || "cover");
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 500);
                    }}
                  />
                </Box>
              </Container>
            </Paginate>
          </>
        )}
        <BookViewCover />
      </MainContainer>
    </BookViewContext.Provider>
  );
};
