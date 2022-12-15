import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DataGridEditorData } from "./context";

export const DGETable = (props: DataGridEditorData) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow hover>
            {props.columns.map((column) => (
              <TableCell
                key={column.field}
                width={column.width || "auto"}
                align={column.align ?? "left"}
              >
                <Typography variant="body2" fontWeight="bold">
                  {column.headerName}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow hover key={row.id}>
              {props.columns.map((column) => (
                <TableCell
                  align={column.align || "left"}
                  key={`${row.id}-${column.field}`}
                >
                  <Typography variant="body2" color="textSecondary">
                    {row?.[column.field] || ""}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
