import { styled, TextField } from "@mui/material";

export const TextFieldSmall = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    fontSize: 16,
    padding: theme.spacing(0.5, 1.5),
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 18,
  },
}));
