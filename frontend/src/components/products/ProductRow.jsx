import {
    TableRow,
    TableCell,
    IconButton
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductRow({
    producto,
    onEdit,
    onDelete
}) {

    return (

        <TableRow>

            <TableCell>{producto.id}</TableCell>

            <TableCell>{producto.nombre}</TableCell>

            <TableCell>{producto.categoria}</TableCell>

            <TableCell>${producto.precio}</TableCell>

            <TableCell>{producto.stock}</TableCell>

            <TableCell>

                <IconButton
                    color="primary"
                    onClick={() => onEdit(producto)}
                >
                    <EditIcon />
                </IconButton>

                <IconButton
                    color="error"
                    onClick={() => onDelete(producto.id)}
                >
                    <DeleteIcon />
                </IconButton>

            </TableCell>

        </TableRow>

    );

}