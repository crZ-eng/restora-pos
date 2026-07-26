import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductTable({
    productos,
    onEdit,
    onDelete,
}) {
    return (
        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>ID</TableCell>

                        <TableCell>Nombre</TableCell>

                        <TableCell>Categoría</TableCell>

                        <TableCell>Precio</TableCell>

                        <TableCell>Stock</TableCell>

                        <TableCell align="center">
                            Acciones
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {productos.map((producto) => (

                        <TableRow key={producto.id}>

                            <TableCell>
                                {producto.id}
                            </TableCell>

                            <TableCell>
                                {producto.nombre}
                            </TableCell>

                            <TableCell>
                                {producto.categoria}
                            </TableCell>

                            <TableCell>
                                ${producto.precio}
                            </TableCell>

                            <TableCell>
                                {producto.stock}
                            </TableCell>

                            <TableCell align="center">

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

                    ))}

                </TableBody>

            </Table>

        </TableContainer>
    );
}