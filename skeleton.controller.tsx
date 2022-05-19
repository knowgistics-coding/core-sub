import { CoreContextTypes } from "./context";
import { encode } from "blurhash";
import { User } from "firebase/auth";
import axios from "axios";

export interface ImageDataMongoTypes {
  _id: string;
  blurhash: string;
  content: {
    _id: string;
    ext: string;
    large: string;
    medium: string;
    mime: string;
    name: string;
    original: string;
    size: number;
    thumbnail: string;
  };
  datecreate: string;
  datemodified: string;
  md5: string;
  type: "image";
  user: string;
}

export class SkeletonController {
  fb: CoreContextTypes["fb"];
  nestURL: string = "https://pi-nest.mek.network";
  nestURLLocal: string = "http://localhost:8084";
  constructor(fb: CoreContextTypes["fb"]) {
    this.fb = fb;
  }

  genKey = (): string => Math.floor(Math.random() * 1000000).toString();
  encodeBlurhash = (file: File) => {
    return new Promise((resolved) => {
      try {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const width = Math.floor(img.width / 10);
          const height = Math.floor(img.height / 10);
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(img, 0, 0, width, height);
            const data = context.getImageData(0, 0, width, height);
            const hash = encode(data.data, width, height, 4, 4);
            resolved(hash);
          } else {
            resolved(null);
          }
        };
      } catch (err) {
        console.log(err);
        resolved(null);
      }
    });
  };

  upload = async (
    user: User,
    file: File,
    callback?: (progress: number) => any
  ) => {
    if (/image/.test(file.type) === false) {
      throw new Error(`"${file.name}" is not an image.`);
    }
    if (!user) {
      throw new Error(`Please sign in.`);
    }

    const data = new FormData();
    data.append("file", file);
    data.append("token", await user?.getIdToken());

    const config = {
      onUploadProgress: (progressEvent: { loaded: number; total: number }) => {
        let progress = (progressEvent.loaded / progressEvent.total) * 100;
        progress = Math.floor(progress * 1);
        // eslint-disable-next-line no-unused-expressions
        callback?.(progress);
      },
    };
    const result = await axios
      .put(`${this.nestURL}/pi/kgcore/image`, data, config)
      .catch((err) => {
        throw new Error(err.message);
      });
    if (result.data?.error) {
      throw new Error(result.data?.message);
    }
    return result.data;
  };
}
