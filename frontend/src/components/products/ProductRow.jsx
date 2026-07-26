import {

TableRow,
TableCell,
Chip,
IconButton

} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductRow({producto}){

return(

<TableRow hover>

<TableCell>

{producto.nombre}

</TableCell>

<TableCell>

<Chip

label={producto.categoria}

color="primary"

/>

</TableCell>

<TableCell>

${producto.precio.toLocaleString("es-CO")}

</TableCell>

<TableCell>

{producto.stock}

</TableCell>

<TableCell align="center">

<IconButton>

<EditIcon color="warning"/>

</IconButton>

<IconButton>

<DeleteIcon color="error"/>

</IconButton>

</TableCell>

</TableRow>

);

}