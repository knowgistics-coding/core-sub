import { Box, Breakpoint, Button, Divider, Typography } from "@mui/material";
import Absatz from "../Absatz";
import { Container } from "../Container";
import { useCore } from "../context";
import { PageDoc, ShowTypes } from "../Controller/page";
import { DGETable } from "../DataGridEditor";
import { FileDisplay } from "../FileDisplay";
import { LeafletContainer, LeafletMap } from "../LeafLet";
import { PickIcon } from "../PickIcon";
import {
  SlideContainer,
  SlideItem,
  SlideItemContent,
  SlideItemFeature,
} from "../Slide";
import { StockDisplay } from "../StockDisplay";
import { VideoDisplay } from "../VideoDisplay";

const PostContents: ShowTypes[] = [
  "heading",
  "paragraph",
  "file",
  "image",
  "table",
  "video",
];

export type PageContentProps = {
  data?: PageDoc;
  maxWidth?: Breakpoint;
};

export const PageContent = ({ data, ...props }: PageContentProps) => {
  const { isMobile, t } = useCore();

  return (
    <>
      {data?.contents?.map((content) => {
        const Wrapper = ({ children }: { children: React.ReactNode }) =>
          PostContents.includes(content.type) ? (
            <Container maxWidth={props.maxWidth || "post"} key={content.key}>
              <Box pt={content?.mt} pb={content?.mb}>
                {children}
              </Box>
            </Container>
          ) : (
            <Box pt={content?.mt} pb={content?.mb}>
              {children}
            </Box>
          );
        switch (content.type) {
          case "heading":
            return (
              <Wrapper key={content.key}>
                <Absatz
                  view
                  value={content?.heading?.value}
                  variant={content.heading?.variant || "h6"}
                  sx={{ fontWeight: "bold", "& *": { fontWeight: "bold" } }}
                />
              </Wrapper>
            );
          case "paragraph":
            return (
              <Wrapper key={content.key}>
                <Absatz
                  view
                  value={content.paragraph?.value}
                  sx={{ color: "text.secondary" }}
                />
              </Wrapper>
            );
          case "image":
            return (
              <Wrapper key={content.key}>
                <StockDisplay size="large" {...content?.image} />
              </Wrapper>
            );
          case "video":
            return (
              <Wrapper key={content.key}>
                <VideoDisplay value={content?.video} />
              </Wrapper>
            );
          case "table":
            if (content.table) {
              return (
                <Wrapper key={content.key}>
                  <DGETable
                    rows={content.table.rows}
                    columns={content.table.columns}
                  />
                </Wrapper>
              );
            } else {
              return null;
            }
          case "slide":
            return (
              <Wrapper key={content.key}>
                <SlideContainer>
                  {content.slide?.map((slide, sindex) => (
                    <SlideItem key={sindex}>
                      <SlideItemFeature {...slide.feature} />
                      <SlideItemContent>
                        <Typography variant="h3" paragraph>
                          {slide.title}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="light"
                          startIcon={<PickIcon icon={"link"} />}
                        >
                          {t("Open")}
                        </Button>
                      </SlideItemContent>
                    </SlideItem>
                  ))}
                </SlideContainer>
              </Wrapper>
            );
          case "cover":
            return (
              <Wrapper key={content.key}>
                <StockDisplay {...content.cover} ratio={isMobile ? 1 : 1 / 4} />
              </Wrapper>
            );
          case "file":
            return content.file?.content ? (
              <Wrapper key={content.key}>
                <FileDisplay
                  content={{
                    value: {
                      name: content.file.content.name,
                      size: content.file.content.size,
                      original: content.file.content.downloadURL,
                    },
                  }}
                  Link={content.file.content.downloadURL}
                />
              </Wrapper>
            ) : null;
          case "divider":
            return (
              <Wrapper key={content.key}>
                <Container maxWidth="post">
                  <Divider />
                </Container>
              </Wrapper>
            );
          default:
            return process.env.NODE_ENV === "development" ? (
              <pre key={content.key}>{JSON.stringify(content, null, 2)}</pre>
            ) : null;
        }
      })}
      {(data?.maps.length ?? 0) > 0 && (
        <Container maxWidth="post">
          <Box
            sx={(theme) => ({
              width: theme.sidebarWidth * 1.5,
              maxWidth: "100%",
              margin: "0 auto 1rem",
              position: "relative",
              "&:before": {
                content: "''",
                display: "block",
                paddingTop: "100%",
              },
            })}
          >
            <LeafletContainer
              rootProps={{
                sx: (theme) => ({ ...theme.mixins.absoluteFluid }),
              }}
            >
              <LeafletMap maps={data?.maps} />
            </LeafletContainer>
          </Box>
        </Container>
      )}
    </>
  );
};
