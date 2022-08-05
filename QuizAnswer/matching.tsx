import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Fragment, useEffect, useState } from "react";
import { useCore } from "../context";
import { arrayShuffle } from "../func";
import { QDImgDisplay } from "../QuizEditor/img";
import { useQD } from "./context";
import { QDParagraph } from "./paragraph";

const Item = styled(Box, { shouldForwardProp: (prop) => prop !== "correct" })<{
  correct?: boolean;
}>(({ theme, correct }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${correct ? grey[300] : red[300]}`,
  color: correct ? theme.palette.success.contrastText : red[300],
  backgroundColor: correct ? theme.palette.success.main : undefined,
  "& .MuiInputLabel-root": {
    color: correct ? theme.palette.success.contrastText : undefined,
  },
  "& .MuiSelect-select": {
    color: correct ? theme.palette.success.contrastText : undefined,
  },
}));

export const QDMatching = () => {
  const { t } = useCore();
  const { quiz, answer } = useQD();
  const [options, setOptions] = useState<(string | undefined)[]>([]);

  const getValue = (key: number) => {
    const value = answer?.matching?.[key] || "";
    return options.includes(value) ? value : "";
  };

  useEffect(() => {
    if (quiz?.type === "matching" && quiz?.matching?.options?.length) {
      const options = arrayShuffle(
        quiz.matching.options.map((opt) => opt.value)
      );
      setOptions(options);
    }
  }, [quiz]);

  return (
    <Fragment>
      <Grid container spacing={1}>
        {quiz?.matching?.options?.map((option) => (
          <Grid item xs={12} key={option.key}>
            <Item correct={option.value === answer?.matching?.[option.key]}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={8}>
                  {(() => {
                    switch (option.type) {
                      case "image":
                        return option?.image?._id ? (
                          <QDImgDisplay id={option.image._id} />
                        ) : null;
                      case "paragraph":
                        return (
                          <QDParagraph
                            color="inherit"
                            value={option.paragraph}
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                </Grid>
                <Grid item xs={4}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>{t("Answer")}</InputLabel>
                    <Select
                      label={t("Answer")}
                      value={getValue(option.key)}
                      readOnly
                    >
                      <MenuItem value="" disabled>
                        -- {t("Select Answer")} --
                      </MenuItem>
                      {options.map((value) => (
                        <MenuItem value={value} key={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* {option.value !== answer?.matching?.[option.key] && (
                      <Typography variant="caption" sx={{ mt: 0.5 }}>
                        {option.value}
                      </Typography>
                    )} */}
                  </FormControl>
                </Grid>
              </Grid>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};
