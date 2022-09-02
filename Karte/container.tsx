import { Grid, GridProps, styled } from "@mui/material";
import { Karte } from "./main";

export type KarteContainerProps = GridProps & {
  loading?: boolean;
  length: number;
};
export const KarteContainer = styled(
  ({ children, loading, length, ...props }: KarteContainerProps) => (
    <Grid {...props}>
      {loading ? <Karte loading /> : length === 0 ? <Karte empty /> : children}
    </Grid>
  )
)({});
KarteContainer.defaultProps = {
  container: true,
  spacing: 2,
};
