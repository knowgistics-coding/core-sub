import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Grid,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from "@mui/material";
import { MouseEvent } from "react";
import { useCore } from "../context";
import { SlideshowSlide } from "../Controller/slideshow";
import { CSS } from "@dnd-kit/utilities";
import { arrayMoveImmutable } from "array-move";
import { StockDisplay } from "../StockDisplay";

//ANCHOR - Root
const Root = styled(Box)(({ theme }) => ({
  position: "relative",
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  "&:after": {
    content: "''",
    display: "block",
    paddingTop: "100%",
  },
}));

//ANCHOR - Inner
const Inner = styled(Box)(({ theme }) => ({
  ...theme.mixins.absoluteFluid,
  display: "flex",
  flexDirection: "column",
}));

//ANCHOR - TextZone
const TextZone = styled(Box)({
  flex: 1,
  marginBlock: 8,
  marginInline: 16,
  boxSizing: "border-box",
});

//ANCHOR - FeatureZone
const FeatureZone = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  flex: 2
}));

//ANCHOR - Actions
const Actions = styled(Box)(({ theme }) => ({
  position: "absolute",
  backgroundColor: "#0004",
  borderRadius: 8,
  top: 4,
  right: 4,
  padding: theme.spacing(0.5),
  backdropFilter: 'blur(3px)'
}));

//ANCHOR - FAButton
const FAButton = styled(
  ({ icon, ...props }: IconButtonProps & { icon: IconName }) => (
    <IconButton size="small" {...props}>
      <FontAwesomeIcon icon={["far", icon]} />
    </IconButton>
  )
)(({ theme }) => ({
  "&.MuiIconButton-sizeSmall": {
    fontSize: theme.typography.body1.fontSize,
    width: 28,
    height: 28,
  },
}));

//SECTION - SlideshowCardContainer
//ANCHOR - [type] SlideshowCardContainerProps
export type SlideshowCardContainerProps = {
  items: SlideshowSlide[];
  onChange: (slides: SlideshowSlide[]) => void;
  onMenu: (slide: SlideshowSlide) => (event: MouseEvent<HTMLElement>) => void;
  onPosition: (slide: SlideshowSlide) => () => void;
};

//ANCHOR - SlideshowCardContainer
export const SlideshowCardContainer = (props: SlideshowCardContainerProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = event.active.id;
    const overId = event.over?.id;
    if (overId && activeId !== overId) {
      const activeIndex = props.items.findIndex(
        (item) => item.key === activeId
      );
      const overIndex = props.items.findIndex((item) => item.key === overId);
      const newItems = arrayMoveImmutable(props.items, activeIndex, overIndex);
      props.onChange(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={props.items.map((item) => ({ id: item.key, data: item }))}
        strategy={rectSortingStrategy}
      >
        <Grid container spacing={1}>
          {props.items.map((item, index, items) => (
            <Grid item xs={12} sm={6} md={4} key={item.key}>
              <SlideShowEditCard
                index={index}
                length={items.length}
                data={item}
                onMenu={props.onMenu(item)}
                onPosition={props.onPosition(item)}
              />
            </Grid>
          ))}
        </Grid>
      </SortableContext>
    </DndContext>
  );
};

//SECTION - SlideShowEditCard
//ANCHOR - [type] SlideShowEditCardProps
export type SlideShowEditCardProps = {
  index: number;
  length: number;
  onMenu: (event: MouseEvent<HTMLElement>) => void;
  onPosition: () => void;
  data: SlideshowSlide;
};

export const SlideShowEditCard = (props: SlideShowEditCardProps) => {
  const { t } = useCore();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.data.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Root ref={setNodeRef} style={style}>
      <Inner>
        <FeatureZone>
          {props.data.feature && (
            <StockDisplay ratio={2 / 3} {...props.data.feature} />
          )}
        </FeatureZone>
        <TextZone>
          <Typography variant="caption" color="textSecondary">
            [{props.index + 1}/{props.length}]
          </Typography>
          <Typography variant="h6" noWrap>
            {props.data.title || t("No Title")}
          </Typography>
        </TextZone>
      </Inner>
      <Actions>
        <FAButton icon="arrows" onClick={props.onPosition} />
        <FAButton icon="ellipsis-h" onClick={props.onMenu} />
        <FAButton icon="grip-dots-vertical" {...attributes} {...listeners} />
      </Actions>
    </Root>
  );
};
//!SECTION
