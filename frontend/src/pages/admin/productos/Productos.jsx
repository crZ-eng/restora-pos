import { useEffect, useState } from "react";
import {
    Button,
    Paper,
    Typography
} from "@mui/material";

import ProductTable from "../../../components/products/ProductTable";
import ProductModal from "../../../components/products/ProductModal";

import { getProductos } from "../../../services/productService";

export default function Productos() {

    const [productos, setProductos] = useState([]);

    const [open, setOpen] = useState(false);

    const cargarProductos = async () => {

        try {

            const response = await getProductos();

            setProductos(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        cargarProductos();

    }, []);

    return (

        <>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >

                Productos

            </Typography>

            <Paper sx={{ p: 3 }}>

                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{ mb: 3 }}
                >

                    Nuevo Producto

                </Button>

                <ProductTable productos={productos} />

            </Paper>

            <ProductModal
                open={open}
                handleClose={() => setOpen(false)}
            />

        </>

    );


    const eliminarProducto = async (id) => {

        if (!window.confirm("¿Desea eliminar este producto?")) return;

        await deleteProducto(id);

        cargarProductos();

    };

    const editarProducto = (producto) => {

    console.log(producto);

};
}