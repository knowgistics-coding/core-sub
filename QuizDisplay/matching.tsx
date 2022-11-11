import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Fragment, useEffect, useState } from "react";
import { useCore } from "../context";
import { arrayShuffle } from "../func";
import { QDImgDisplay } from "../QuizEditor/img";
import { useQD } from "./context";
import { QDParagraph } from "./paragraph";

const Item = styled(Box)(({ theme }) => ({
  border: `solid 1px ${grey[300]}`,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
}));

export const QDMatching = () => {
  const { t } = useCore();
  const { quiz, value, onChange } = useQD();
  const [options, setOptions] = useState<(string | undefined)[]>([]);

  const getValue = (key: string) => {
    const newValue = value?.matching?.[key] || "";
    return options.includes(newValue) ? newValue : "";
  };
  const handleChange =
    (key: string) =>
    ({ target: { value } }: SelectChangeEvent<string>) => {
      onChange((answer) => answer.setMatching(key, value));
    };

  useEffect(() => {
    if (quiz.type === "matching" && quiz.options.length) {
      const options = arrayShuffle(quiz.options.map((opt) => opt.value));
      setOptions(options);
    }
  }, [quiz]);

  return (
    <Fragment>
      <Grid container spacing={1}>
        {quiz.options.map((option) => (
          <Grid item xs={12} key={option.key}>
            <Item>
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
                          <Typography color="textSecondary" component="div">
                            <QDParagraph value={option.paragraph} />
                          </Typography>
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
                      onChange={handleChange(option.key)}
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
