import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fab, Grid } from "@mui/material";
import { createContext, useContext } from "react";
import { Container } from "../Container";
import { ContentHeader } from "../ContentHeader";
import { useCore } from "../context";
import { Slideshow } from "../Controller/slideshow";
import { FabGroup } from "../FabGroup";
import MainContainer from "../MainContainer";
import { SlideShowEditCard } from "./card";
import { SlideshowEditSidebar } from "./sidebar";

export type SlideShowEditProps = {
  back: string;
  value: Slideshow;
  onChange: (data: Slideshow) => void;
  onSave: () => Promise<boolean>;
};

const SlideshowContext = createContext<SlideShowEditProps>({
  back: "/",
  value: new Slideshow(),
  onChange: () => {},
  onSave: async () => false,
});

export const useSlideshow = () => useContext(SlideshowContext);

export const SlideShowEdit = (props: SlideShowEditProps) => {
  const { t } = useCore();
  const { value, onChange, onSave } = props;

  return (
    <SlideshowContext.Provider value={{ ...props }}>
      <MainContainer signInOnly sidebar={<SlideshowEditSidebar />}>
        <Container maxWidth="md">
          <ContentHeader
            label={value.title}
            breadcrumbs={[
              { label: t("Home"), to: "/" },
              { label: t("SLIDESHOW"), to: `/slideshow` },
              { label: t("Edit") },
            ]}
          />
          <Grid container spacing={1}>
            {value.slides.map((slide, index, slides) => (
              <Grid item xs={12} sm={6} md={4} key={slide.key}>
                <SlideShowEditCard index={index} length={slides.length} />
              </Grid>
            ))}
          </Grid>
        </Container>
        <FabGroup>
          <Fab
            size="small"
            color="info"
            children={<FontAwesomeIcon icon={["far", "plus"]} />}
            onClick={() => onChange(value.add.slide())}
          />
          <Fab
            size="small"
            color="success"
            children={<FontAwesomeIcon icon={["far", "save"]} />}
            onClick={onSave}
          />
        </FabGroup>
      </MainContainer>
    </SlideshowContext.Provider>
  );
};
