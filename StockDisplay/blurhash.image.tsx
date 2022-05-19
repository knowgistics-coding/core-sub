import { decode } from "blurhash";
import { HTMLProps, useEffect, useRef } from "react";

interface BlurhashImageProps {
  hash: string;
  canvasProps?: HTMLProps<HTMLCanvasElement>;
}

export const BlurhashImage = ({ hash, canvasProps }: BlurhashImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (hash) {
      const pixels = decode(hash, 32, 32);
      const ctx = canvasRef?.current?.getContext("2d");
      if (ctx) {
        const imageData = ctx?.createImageData(32, 32);
        if (imageData) {
          imageData.data.set(pixels);
          ctx?.putImageData(imageData, 0, 0);
        }
      }
    }
  }, [hash]);

  return <canvas {...canvasProps} ref={canvasRef} width={32} height={32} />;
};
