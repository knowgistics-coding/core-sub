import React, { Fragment } from "react";
import { MainContainer, MainContainerProps } from "../MainContainer";
import { PageViewerContext, PageViewerProps } from "./context";
import { ContentHeader } from "../ContentHeader";
import { Container } from "../Container";
import { StockDisplay } from "../StockDisplay";
import { Box } from "@mui/material";
import { DateDisplay } from "../DateDisplay";
import { PageContent } from "../PageContent";

const PageContainer = ({
  children,
  noContainer,
  mainContainerProps,
}: {
  children: React.ReactNode;
  noContainer?: boolean;
  mainContainerProps?: Omit<MainContainerProps, "children">;
}) =>
  noContainer ? (
    <Fragment>{children}</Fragment>
  ) : (
    <MainContainer dense {...mainContainerProps}>
      {children}
    </MainContainer>
  );

export const PageViewer = (props: PageViewerProps) => {
  const data = props.data;

  return (
    <PageViewerContext.Provider value={{ ...props }}>
      <PageContainer
        noContainer={props.noContainer}
        mainContainerProps={props.mainContainerProps}
      >
        {data.feature && (
          <StockDisplay {...data.feature} size="large" ratio={1 / 4} />
        )}
        <Box py={6}>
          <Container maxWidth={props.maxWidth || "post"}>
            {(data.title || props.overrideHeader) && (
              <ContentHeader
                label={props.overrideHeader || data.title}
                breadcrumbs={props.breadcrumbs}
                secondary={<DateDisplay date={data.datemodified} />}
              />
            )}
          </Container>
          <PageContent data={data} />
          <Container maxWidth={props.maxWidth}>{props.children}</Container>
        </Box>
      </PageContainer>
    </PageViewerContext.Provider>
  );
};
