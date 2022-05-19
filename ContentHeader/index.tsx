import {
  Box,
  BoxProps,
  BreadcrumbsProps,
  Link as MLink,
  Typography,
} from "@mui/material";
import { Container } from "./container";
import { BreadcrumbsStyled } from "./breadcrumbs.styled";
import { useCore } from "../context";
import React from "react";

export interface ContentHeaderProps {
  label?: React.ReactNode;
  breadcrumbs?: {
    label: React.ReactNode;
    to?: string;
    component?: React.ReactElement;
  }[];
  actions?: React.ReactNode;
  secondary?: React.ReactNode;
  containerProps?: BoxProps;
  breadcrumbsProps?: BreadcrumbsProps;
}

export const ContentHeader = ({
  label,
  breadcrumbs,
  actions,
  secondary,
  containerProps,
  breadcrumbsProps,
}: ContentHeaderProps) => {
  const { Link } = useCore();

  return (
    <Container mb={4} {...containerProps}>
      <Box flex={1}>
        {breadcrumbs && (
          <Box mb={1}>
            <BreadcrumbsStyled separator="|" {...breadcrumbsProps}>
              {breadcrumbs.map((item, index) => {
                if (item.component) {
                  return React.cloneElement(item.component, {
                    key: index,
                  });
                } else if (item.to) {
                  return (
                    <MLink component={Link} to={item.to} key={index}>
                      <Typography
                        variant="caption"
                        color="inherit"
                        style={{ fontWeight: "bold" }}
                      >
                        {item.label}
                      </Typography>
                    </MLink>
                  );
                } else {
                  return (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      key={index}
                    >
                      {item.label}
                    </Typography>
                  );
                }
              })}
            </BreadcrumbsStyled>
          </Box>
        )}
        <Typography
          variant="h3"
          color={label ? "textPrimary" : "textSecondary"}
        >
          {label || "No title"}
        </Typography>
        {secondary && (
          <Typography
            variant="caption"
            color="textSecondary"
            component="div"
            style={{ paddingTop: 8 }}
          >
            {secondary}
          </Typography>
        )}
      </Box>
      {Boolean(actions) && <div>{actions}</div>}
    </Container>
  );
};
