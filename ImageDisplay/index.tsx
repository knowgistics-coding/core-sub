import { Box, BoxProps, Checkbox, styled } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useOnScreen } from "../StockDisplay/observ";
import { BlurhashImage } from "../StockDisplay/blurhash.image";
import { ImageCredit } from "../Controller/image";
import { CreditDisplay } from "../StockDisplay/credit";

class ImageDisplayData {
  static load(src: string): Promise<string> {
    return new Promise((res) => {
      fetch(src)
        .then(function (response) {
          return response.blob();
        })
        .then(function (myBlob) {
          var objectURL = URL.createObjectURL(myBlob);
          res(objectURL);
        });
    });
  }
}

//SECTION - Root
type RootProps = BoxProps & {
  ratio: number;
  hover?: boolean;
};
const Root = styled(Box, {
  shouldForwardProp: (prop) =>
    ["ratio", "src", "hover"].includes(prop.toString()) === false,
})<RootProps>(({ theme, ratio, hover }) => ({
  cursor: "pointer",
  position: "relative",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  "&:before": {
    content: "''",
    display: "block",
    paddingTop: `calc(100% * ${ratio})`,
  },
  "&>.shadow": {
    ...theme.mixins.absoluteFluid,
    boxShadow: "inset 0 -32px 64px #0008",
  },
  "&:hover": {
    ">canvas,img": {
      objectFit: hover ? "contain" : "cover",
    },
  },
  ">canvas,img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));
//!SECTION

//SECTION - CheckStyled
export const CheckStyled = styled(Checkbox)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(1),
  left: theme.spacing(1),
  color: "white",
}));
//!SECTION

export type ImageDisplayProps = {
  src?: string;
  imageId?: string;
  hover?: boolean;
  hash?: string;
  checkbox?: boolean;
  checked?: boolean;
  onCheck?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onClick?: BoxProps["onClick"]
};

export const ImageDisplay = (props: ImageDisplayProps) => {
  const divRef = useRef<HTMLDivElement>();
  const showing = useOnScreen(divRef);
  const [state, setState] = useState<{
    url: null | string;
    credit: null | ImageCredit;
  }>({
    url: null,
    credit: null,
  });

  useEffect(() => {
    if (props.src) {
      ImageDisplayData.load(props.src).then((url) =>
        setState((s) => ({ ...s, url }))
      );
    }
    if (props.imageId) {
      ImageCredit.get(props.imageId).then((credit) =>
        setState((s) => ({ ...s, credit }))
      );
    }
  }, [props.src, props.imageId]);

  return (
    <Root
      ref={divRef}
      className="ImageDisplay-root"
      ratio={1}
      hover={props.hover}
    >
      {props.hash && <BlurhashImage hash={props.hash} />}
      {showing && state.url && <img src={state.url} alt="preview" />}
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        alt="transparent"
      />
      <Box className="shadow" onClick={props.onClick} />
      {state.credit?.value && (
        <CreditDisplay
          type={state.credit.type}
          uid={state.credit.user}
          value={state.credit.value}
          isAbsolute
          sx={{ pl: 1 }}
        />
      )}
      {props.checkbox && (
        <CheckStyled
          checked={Boolean(props.checked)}
          onChange={props.onCheck}
        />
      )}
    </Root>
  );
};
