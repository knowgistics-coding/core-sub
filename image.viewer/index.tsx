import { Box, Fade, IconButton, styled } from "@mui/material";
import * as React from "react";
import { PickIcon } from "../PickIcon";

const Root = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#000D",
  backdropFilter: "blur(4px)",
  zIndex: 9999,
});

const Container = styled(Box)({
  userSelect: "none",
  overflow: "hidden",
  height: "100%",
  width: "100%",
});

const ImageStyled = styled("img")({
  cursor: "grab",
  position: "relative",
  width: "100%",
  height: "100%",
  objectFit: "contain",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const Actions = styled(Box)({
  display: "flex",
  alignItems: "center",
  position: "absolute",
  top: 0,
  right: 0,
  color: "white",
});

export const ImageViewer = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const imageRef = React.useRef<HTMLImageElement | null>(null);
  const [pos, setPos] = React.useState<{
    hold: boolean;
    x: number;
    y: number;
    pageX: number;
    pageY: number;
    zoom: number;
  }>({
    hold: false,
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
    zoom: 100,
  });

  const handleZoom = (increase: boolean) => () => {
    if (
      ((!increase && pos.zoom > 100) || (increase && pos.zoom < 300)) &&
      imageRef.current &&
      containerRef.current?.getBoundingClientRect
    ) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPos((s) => {
        const increment = 50 * (increase ? 1 : -1);
        imageRef.current!.style.width = `${
          (width * (s.zoom + increment)) / 100
        }px`;
        imageRef.current!.style.height = `${
          (height * (s.zoom + increment)) / 100
        }px`;
        return { ...s, zoom: s.zoom + increment };
      });
    }
  };

  function handleDragStart(e: React.MouseEvent<HTMLImageElement>) {
    if (imageRef.current) {
      const { offsetLeft, offsetTop } = imageRef.current;
      const { pageX, pageY } = e;
      setPos((s) => ({
        ...s,
        hold: true,
        x: offsetLeft,
        y: offsetTop,
        pageX,
        pageY,
      }));
    }
  }

  function handleDragEnd() {
    setPos((s) => ({ ...s, hold: false }));
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (imageRef.current && pos.hold === true) {
      const { pageX, pageY } = e;
      imageRef.current.style.left = `${pos.x + (pageX - pos.pageX)}px`;
      imageRef.current.style.top = `${pos.y + (pageY - pos.pageY)}px`;
    }
  }

  function handleReset() {
    if (imageRef.current) {
      imageRef.current.style.width = "100%";
      imageRef.current.style.height = "100%";
      imageRef.current.style.left = "50%";
      imageRef.current.style.top = "50%";
      setPos((s) => ({ ...s, zoom: 100 }));
    }
  }

  React.useEffect(() => {
    Array.from(document.getElementsByTagName("body")).forEach((body) => {
      body.style.overflow = "hidden";
    });
    return () => {
      Array.from(document.getElementsByTagName("body")).forEach((body) => {
        body.style.overflow = "auto";
      });
    };
  }, []);

  return (
    <Fade in={true}>
      <Root>
        <Container
          ref={containerRef}
          onMouseUp={handleDragEnd}
          onMouseMove={handleMouseMove}
          onWheel={(e) => handleZoom(e.deltaY > 0)()}
        >
          <ImageStyled
            ref={imageRef}
            onDragStart={(e) => {
              e.preventDefault();
            }}
            id="drag-img"
            src="https://img.freepik.com/free-photo/cool-geometric-triangular-figure-neon-laser-light-great-backgrounds-wallpapers_181624-9331.jpg?w=2000"
            onMouseDown={handleDragStart}
          />
        </Container>
        <Actions>
          <IconButton onClick={handleZoom(true)} color="inherit">
            <PickIcon icon="magnifying-glass-plus" />
          </IconButton>
          <div>{pos.zoom}%</div>
          <IconButton
            onClick={handleZoom(false)}
            color="inherit"
          >
            <PickIcon icon="magnifying-glass-minus" />
          </IconButton>
          <IconButton onClick={handleReset} color="inherit">
            <PickIcon icon="redo" />
          </IconButton>
        </Actions>
      </Root>
    </Fade>
  );
};
