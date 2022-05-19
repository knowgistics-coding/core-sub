import { useState } from "react";
import { Container } from "../Container";
import { MainContainer } from "../MainContainer";
import { CEContext, ContentEditProps, StateTypes } from "./ctx";
import { CESidebar } from "./sidebar";
import { ContentHeader } from "../ContentHeader";
import { useCore } from "../context";
import { Box } from "@mui/material";
import { CEFeature } from "./content/feature";
import { CEAddButton } from "./content/add.button";
import { CEContent } from "./content.m";

export * from "./ctx";
export const ContentEdit = (props: ContentEditProps) => {
  const { t } = useCore();
  const [state, setState] = useState<StateTypes>({
    focus: null,
  });

  const getContentIndex = (key: string) => {
    const index = props.data.contents?.findIndex((item) => item.key === key);
    return typeof index === "number" ? index : -1;
  };

  const store = {
    ...props,
    state,
    setState,
    getContentIndex,
  };

  return (
    <CEContext.Provider value={store}>
      <MainContainer loading={store.loading} dense sidebar={<CESidebar />}>
        <CEFeature />
        <Box py={6}>
          <Container maxWidth={props.post ? "post" : undefined}>
            {props.show.includes("title") && (
              <ContentHeader
                label={props.data.title || t("No title")}
                breadcrumbs={props.breadcrumbs}
              />
            )}
          </Container>
          <CEContent />
        </Box>
      </MainContainer>
      <CEAddButton />
    </CEContext.Provider>
  );
};
