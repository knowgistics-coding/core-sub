import { Box, BoxProps, Checkbox, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, {
  Fragment,
  HTMLAttributes,
  useCallback,
  useRef,
  useState,
} from "react";
import { CreditDisplay, CreditDisplayProps } from "./credit";
import { apiURL } from "../StockPicker/controller";
import { BlurhashImage } from "./blurhash.image";
import { useOnScreen } from "./observ";

export * from './blurhash.image'

const getCredit = (
  imageId: string,
  callback: (result?: CreditDisplayProps) => void
): (() => void) => {
  const controller = new AbortController();
  const signal = controller.signal;

  fetch(`${apiURL}/file/credit/${imageId}`, {
    method: "get",
    signal,
  })
    .then((res) => res.json())
    .then((result) => {
      callback(result || null);
    })
    .catch((err) => {
      console.log(`Image (${imageId}): ${err.message}`);
    });

  return () => controller.abort();
};

const TransImg = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

interface rootProps {
  ratio?: number;
  hover?: boolean;
}
const Root = styled(Box)<rootProps>(({ ratio, hover }) => ({
  position: "relative",
  backgroundColor: grey[100],
  "&:after": {
    content: "''",
    display: "block",
    paddingTop: `calc(100% * ${ratio || 1})`,
  },
  "&:hover img": {
    objectFit: hover ? "contain" : undefined,
  },
}));

const ImgStyled = styled("img")<{
  pos?: {
    top: string;
    left: string;
  };
}>(({ pos }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: pos ? `${pos?.left} ${pos?.top}` : undefined,
}));

const CheckboxStyled = styled(Checkbox)({
  position: "absolute",
  top: "0.5rem",
  left: "0.5rem",
});

export interface StockDisplayImageTypes {
  blurhash?: string;
  _id: string;
  width?: number;
  height?: number;
  credit?: CreditDisplayProps;
}

export interface StockDisplayProps {
  children?: React.ReactNode;
  image?: StockDisplayImageTypes;
  ratio?: number;
  pos?: {
    top: string;
    left: string;
  };
  checkbox?: boolean;
  checked?: boolean;
  onCheck?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  rootProps?: BoxProps;
  hover?: boolean;
  size?: "small" | "medium" | "large";
  url?: string;
}

export const StockDisplay = ({
  children,
  image,
  pos: posProps,
  checkbox,
  checked,
  onCheck,
  rootProps,
  hover,
  size,
  ...props
}: StockDisplayProps) => {
  const divRef = useRef<HTMLDivElement>();
  const [err, setErr] = useState<boolean>(false);
  const [cstate, setCState] = useState<{
    loading: boolean;
    data?: CreditDisplayProps;
  }>({
    loading: false,
  });

  const isVisible = useOnScreen(divRef);

  const handleError = () => setErr(true);
  const getRatio = useCallback((): number => {
    return (
      props.ratio ||
      (image?.width && image.height && image?.width / image?.height) ||
      1
    );
  }, [props.ratio, image]);
  const getSrc = useCallback(
    (image: StockDisplayImageTypes) => {
      switch (size) {
        case "small":
          return `${apiURL}/file/id/${image._id}/thumbnail`;
        case "large":
          return `${apiURL}/file/id/${image._id}/`;
        default:
          return `${apiURL}/file/id/${image._id}/medium`;
      }
    },
    [size]
  );

  const Wrapper = useCallback(
    (p: HTMLAttributes<HTMLDivElement>) => {
      return props.url ? (
        <a href={props.url} rel="noreferrer" target="_blank">
          {p.children}
        </a>
      ) : (
        <Fragment>{p.children}</Fragment>
      );
    },
    [props.url]
  );

  React.useEffect(() => {
    if (cstate.loading === false && !cstate.data) {
      if (image?.credit) {
        setCState((s) => ({ ...s, loading: false, data: image.credit }));
      } else if (image?._id) {
        setCState((s) => ({ ...s, loading: true }));
        getCredit(image._id, (result) => {
          setCState((s) => ({ ...s, loading: false, data: result }));
        });
      }
    }
    return () => {};
  }, [image, cstate]);

  return (
    <Root ref={divRef} ratio={getRatio()} {...rootProps} hover={hover}>
      <Wrapper>
        {image?.blurhash && (
          <BlurhashImage
            hash={image?.blurhash}
            canvasProps={{
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              },
            }}
          />
        )}
        {isVisible && image?._id && !err && (
          <ImgStyled src={getSrc(image)} pos={posProps} onError={handleError} />
        )}
        {checkbox && <CheckboxStyled checked={checked} onChange={onCheck} />}
        <TransImg src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
      </Wrapper>
      {children}
      {cstate.data && <CreditDisplay isAbsolute {...cstate.data} />}
    </Root>
  );
};
