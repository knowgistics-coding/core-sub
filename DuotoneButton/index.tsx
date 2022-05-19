
import { Button, ButtonProps, styled } from '@mui/material'

export interface DuotoneButtonProps extends ButtonProps {}
export const DuotoneButton = styled((props: DuotoneButtonProps) => (
  <Button {...props} />
))(({ theme }) => theme.palette.duotone)
