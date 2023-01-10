import {
  Box,
  Dialog,
  Divider,
  Rating,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/css";
import { BlurhashImage } from "../StockDisplay";
import { useEffect, useState } from "react";
import { SlideItem } from "./slide.item";
import { CloseButton } from "./close.button";
import { InfoBox } from "./info.box";
import { RealmImage } from "../Controller/realm.image";
import { useCore } from "../context";
import { Time } from "../Controller/time";
import { MekFile } from "../Controller/file";

export class ImageViewer {
  _id: string;
  thumbnail: string;
  blurhash: string;

  constructor(data?: Partial<ImageViewer>) {
    this._id = data?._id ?? "";
    this.thumbnail = data?.thumbnail ?? "";
    this.blurhash = data?.blurhash ?? "";
  }
}

export type DialogImageViewerProps = {
  open: boolean;
  onClose: () => void;
  data?: { prev?: ImageViewer; current: ImageViewer; next?: ImageViewer };
  onSlideChange?: (action: "next" | "prev") => void;
};
export const DialogImageViewer = (props: DialogImageViewerProps) => {
  const { t, user } = useCore();
  const [state, setState] = useState<{
    activeIndex: number;
    swiper: SwiperCore | null;
    loading: boolean;
    data: null | RealmImage;
  }>({
    activeIndex: 0,
    swiper: null,
    loading: true,
    data: null,
  });

  const params: SwiperProps = {
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    observer: true,
    spaceBetween: 50,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    onSlideChangeTransitionEnd: (swiper) => {
      setState((s) => ({ ...s, activeIndex: swiper.activeIndex }));
      setTimeout(() => {
        if (props.onSlideChange) {
          if (props.data?.prev) {
            if (swiper.activeIndex === 2) {
              props.onSlideChange("next");
            } else if (swiper.activeIndex === 0) {
              props.onSlideChange("prev");
            }
          } else {
            if (swiper.activeIndex === 1) {
              props.onSlideChange("next");
            }
          }
        }
      }, 250);
    },
    onInit: (swiper) => setState((s) => ({ ...s, swiper })),
  };

  useEffect(() => {
    if (state.swiper && props.data) {
      if (props.data.prev) {
        state.swiper.slideTo(1, 0);
      } else {
        state.swiper.slideTo(0, 0);
      }
    }
  }, [state.swiper, props.data]);

  useEffect(() => {
    if (props.data?.current._id && user.data) {
      setState((s) => ({ ...s, loading: true, data: null }));
      user.data.getIdToken().then(async (token) => {
        if (props.data?.current._id) {
          const docs = await RealmImage.queryPrivate(token, [
            props.data.current._id,
          ]);
          setState((s) => ({
            ...s,
            loading: false,
            data: docs?.[props.data?.current._id ?? ""],
          }));
        }
      });
    }
  }, [user.data, props.data]);

  return (
    <>
      <Dialog
        fullScreen
        open={props.open}
        sx={{ zIndex: 1400 }}
        TransitionComponent={Slide}
      >
        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <Swiper {...params}>
            {props.data?.prev && (
              <SwiperSlide>
                <SlideItem className="Slide-item">
                  <Box className="image">
                    {props.data.prev.blurhash && (
                      <BlurhashImage hash={props.data.prev.blurhash} />
                    )}
                    <img
                      src={props.data.prev.thumbnail}
                      alt={props.data.prev._id}
                    />
                  </Box>
                  <InfoBox loading />
                </SlideItem>
              </SwiperSlide>
            )}
            {props.data?.current && (
              <SwiperSlide>
                <SlideItem className="Slide-item">
                  <Box className="image">
                    {props.data.current.blurhash && (
                      <BlurhashImage hash={props.data.current.blurhash} />
                    )}
                    <img
                      src={props.data.current.thumbnail}
                      alt={props.data.current._id}
                    />
                  </Box>
                  <InfoBox loading={state.loading}>
                    <Stack spacing={2}>
                      <Typography variant="h5">
                        {t("$Name Information", { name: t("Image") })}
                      </Typography>
                      <Divider />
                      <div>
                        <Typography>{state.data?.name}</Typography>
                        <Typography>
                          {new Time(
                            state.data?.datecreate ?? Date.now()
                          ).toString()}
                        </Typography>
                        <Typography>
                          {MekFile.fileSize(state.data?.size ?? 0)}
                        </Typography>
                      </div>
                      <Divider />
                      <div>
                        <Typography>
                          {t("Width")} {state.data?.width ?? 0}px
                        </Typography>
                        <Typography>
                          {t("Height")} {state.data?.height ?? 0}px
                        </Typography>
                      </div>
                      <Divider />
                      <div>
                        <Typography>
                          {t("Type")} {state.data?.mimetype}
                        </Typography>
                        {state.data?.getModel() && (
                          <Typography>
                            Model {state.data?.getModel()}
                          </Typography>
                        )}
                        {state.data?.getFNumber() && (
                          <Typography>
                            F-stop {state.data?.getFNumber()}
                          </Typography>
                        )}
                        {state.data?.getISO() && (
                          <Typography>
                            ISO Speed {state.data?.getISO()}
                          </Typography>
                        )}
                        {state.data?.getFocalLength() && (
                          <Typography>
                            Focal length {state.data?.getFocalLength()}
                          </Typography>
                        )}
                        {state.data?.getLensModel() && (
                          <Typography>
                            Lens {state.data.getLensModel()}
                          </Typography>
                        )}
                      </div>
                      <Divider />
                      <div>
                        <Rating />
                      </div>
                      <Divider />
                    </Stack>
                  </InfoBox>
                </SlideItem>
              </SwiperSlide>
            )}
            {props.data?.next && (
              <SwiperSlide>
                <SlideItem className="Slide-item">
                  <Box className="image">
                    {props.data.next.blurhash && (
                      <BlurhashImage hash={props.data.next.blurhash} />
                    )}
                    <img
                      src={props.data.next.thumbnail}
                      alt={props.data.next._id}
                    />
                  </Box>
                  <InfoBox loading />
                </SlideItem>
              </SwiperSlide>
            )}
          </Swiper>
        </Box>
        <CloseButton icon="xmark" onClick={props.onClose} />
      </Dialog>
    </>
  );
};
