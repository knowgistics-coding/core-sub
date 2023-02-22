import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fab, ListItemButton, ListItemText, Menu } from "@mui/material";
import { createContext, MouseEvent, useContext, useState } from "react";
import { Container } from "../Container";
import { ContentHeader } from "../ContentHeader";
import { useCore } from "../context";
import { Slideshow, SlideshowSlide } from "../Controller/slideshow";
import { DialogImagePosition } from "../DialogImagePosition";
import { FabGroup } from "../FabGroup";
import MainContainer from "../MainContainer";
import { SlideshowCardContainer } from "./card";
import { SlideshowEdit } from "./edit";
import { SlideshowEditSidebar } from "./sidebar";

export type SlideShowEditProps = {
  back: string;
  value: Slideshow;
  onChange: (data: Slideshow) => void;
  onPreview?: () => void;
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
  const [menu, setMenu] = useState<{
    anchor: Element;
    slide: SlideshowSlide;
  } | null>(null);
  const [state, setState] = useState<{
    edit: SlideshowSlide | null;
    position: SlideshowSlide | null;
  }>({
    edit: null,
    position: null,
  });

  const handleMenu =
    (slide: SlideshowSlide) => (event: MouseEvent<HTMLElement>) =>
      setMenu({ anchor: event.currentTarget, slide });
  const handleEditOpen = () => {
    if (menu?.slide) {
      setState((s) => ({ ...s, edit: menu.slide }));
      setMenu(null);
    }
  };
  const handleEditSlide = (slide: SlideshowSlide) => {
    onChange(value.slide.replace(slide));
    setState((s) => ({ ...s, edit: null }));
  };
  const handlePosition = (slide: SlideshowSlide) => () =>
    setState((s) => ({ ...s, position: slide }));
  const handlePositionChange = (pos: Record<"top" | "left", string>) => {
    if (state.position?.feature) {
      onChange(value.slide.replace(state.position.featuring.pos(pos)));
    }
  };
  const handleRemoveSlide = () => {
    if (menu?.slide) {
      onChange(value.slide.remove(menu.slide.key));
      setMenu(null);
    }
  };

  return (
    <SlideshowContext.Provider value={{ ...props }}>
      <MainContainer
        title={t("Edit $Name", { name: t("SLIDESHOW") })}
        signInOnly
        sidebar={<SlideshowEditSidebar />}
      >
        <Container maxWidth="md">
          <ContentHeader
            label={value.title}
            breadcrumbs={[
              { label: t("Home"), to: "/" },
              { label: t("SLIDESHOW"), to: `/slideshow` },
              { label: t("Edit") },
            ]}
          />
          <SlideshowCardContainer
            items={value.slides}
            onChange={(slides) => onChange(value.set("slides", slides))}
            onMenu={handleMenu}
            onPosition={handlePosition}
          />
        </Container>
        <FabGroup>
          <Fab
            size="small"
            color="info"
            children={<FontAwesomeIcon icon={["far", "plus"]} />}
            onClick={() => onChange(value.slide.add())}
          />
          <Fab
            size="small"
            color="success"
            children={<FontAwesomeIcon icon={["far", "save"]} />}
            onClick={onSave}
          />
        </FabGroup>
      </MainContainer>
      <Menu
        open={Boolean(menu)}
        anchorEl={menu?.anchor}
        onClose={() => setMenu(null)}
        MenuListProps={{ dense: true }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <ListItemButton onClick={handleEditOpen}>
          <ListItemText primary={t("Edit")} />
        </ListItemButton>
        <ListItemButton
          sx={{ color: "error.main" }}
          onClick={handleRemoveSlide}
        >
          <ListItemText primary={t("Remove")} />
        </ListItemButton>
      </Menu>
      <SlideshowEdit
        open={Boolean(state.edit)}
        slide={state.edit}
        onChange={handleEditSlide}
        onClose={() => setState((s) => ({ ...s, edit: null }))}
      />
      {state.position?.feature?.image && (
        <DialogImagePosition
          open={true}
          image={state.position.feature.image}
          onSave={handlePositionChange}
          onClose={() => setState((s) => ({ ...s, position: null }))}
          value={state.position?.feature?.pos}
          ratio={2 / 3}
        />
      )}
    </SlideshowContext.Provider>
  );
};
