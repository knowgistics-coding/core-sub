import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { forwardRef, Fragment, useEffect, useState } from "react";
import update from "react-addons-update";

export interface HeadingTypes {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align: "left" | "right" | "center";
  text: string;
}
export interface HeadingProps {
  editOnly?: boolean;
  editable?: boolean;
  value?: HeadingTypes;
  onChange?: (value: any) => void;
}
export const Heading = forwardRef<HTMLInputElement, HeadingProps>(
  ({ editOnly, editable, value, onChange }, ref) => {
    const [edit, setEdit] = useState(false);
    const [editValue, setEditValue] = useState<HeadingTypes>({
      variant: "h5",
      align: "left",
      text: "",
    });

    const handleEdit = () => {
      if (editable) {
        setEdit(true);
      }
    };
    const handleClose = () => setEdit(false);
    const handleChangeEvent =
      (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newValue = update(editValue, { [key]: { $set: value } });
        setEditValue(newValue);
        if (onChange) {
          onChange(newValue);
        }
      };
    const handleSelectChangeEvent =
      (key: string) => (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        const newValue = update(editValue, { [key]: { $set: value } });
        setEditValue(newValue);
        if (onChange) {
          onChange(newValue);
        }
      };
    const handleChangeAlign = (
      _e: React.MouseEvent<HTMLElement, MouseEvent>,
      value: string
    ) => {
      const newValue = update(editValue, { align: { $set: value } });
      setEditValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    useEffect(() => {
      if (value) {
        setEditValue(value);
      }
    }, [value]);

    return (
      <Fragment>
        {(edit || editOnly) && (
          <Box mb={2}>
            <Box display="flex" alignItems="center" mb={2} py={1}>
              <FormControl>
                <InputLabel id="variant-select-label">Size</InputLabel>
                <Select
                  label="Size"
                  labelId="variant-select-label"
                  id="variant-select"
                  value={editValue.variant || "h5"}
                  onChange={handleSelectChangeEvent("variant")}
                  size="small"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <MenuItem key={num} value={`h${num}`}>
                      H{num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box mr={2} />
              <ToggleButtonGroup
                value={editValue.align}
                onChange={handleChangeAlign}
                exclusive
              >
                <ToggleButton value="left">
                  <FontAwesomeIcon icon={["fad", "align-left"]} />
                </ToggleButton>
                <ToggleButton value="center">
                  <FontAwesomeIcon icon={["fad", "align-center"]} />
                </ToggleButton>
                <ToggleButton value="right">
                  <FontAwesomeIcon icon={["fad", "align-right"]} />
                </ToggleButton>
              </ToggleButtonGroup>
              <Box flex={1} />
            </Box>
            <TextField
              inputRef={ref}
              autoFocus
              fullWidth
              label="Heading"
              variant="outlined"
              value={editValue.text || ""}
              onChange={handleChangeEvent("text")}
            />
          </Box>
        )}
        <Box textAlign={editValue.align || "left"}>
          <Typography
            variant={editValue.variant || "h5"}
            color={editValue.text ? "textPrimary" : "textSecondary"}
            onClick={handleEdit}
          >
            {editValue.text || "[Heading]"}
          </Typography>
        </Box>
        {edit && (
          <Box textAlign="right" mt={1} pb={1}>
            <Button variant="outlined" size="small" onClick={handleClose}>
              Close
            </Button>
          </Box>
        )}
      </Fragment>
    );
  }
);
