import {

Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Paper

} from "@mui/material";

import ProductRow from "./ProductRow";

const productos=[

{

id:1,
nombre:"Hamburguesa Clásica",
categoria:"Hamburguesas",
precio:18000,
stock:25

},

{

id:2,
nombre:"Lomo a la Parrilla",
categoria:"Carnes",
precio:42000,
stock:12

},

{

id:3,
nombre:"Pasta Alfredo",
categoria:"Pastas",
precio:27000,
stock:8

}

];

export default function ProductTable(){

return(

<TableContainer component={Paper}>

<Table>

<TableHead>

<TableRow>

<TableCell>Producto</TableCell>

<TableCell>Categoría</TableCell>

<TableCell>Precio</TableCell>

<TableCell>Stock</TableCell>

<TableCell align="center">

Acciones

</TableCell>

</TableRow>

</TableHead>

<TableBody>

{

productos.map(producto=>(

<ProductRow

key={producto.id}

producto={producto}

/>

))

}

</TableBody>

</Table>

</TableContainer>

);

}