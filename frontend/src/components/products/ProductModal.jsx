import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Divider,
    Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import { useState } from "react";
import ProductImage from "./ProductImage";
import ProductExtras from "./ProductExtras";
import { createProducto } from "../../services/productService";

export default function ProductModal({
    open,
    handleClose,
}) {

    const [requiereTermino, setRequiereTermino] = useState(false);
    const [permiteObservaciones, setPermiteObservaciones] = useState(false);
    const [imagen, setImagen] = useState(null);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");


    const guardarProducto = async () => {

        try {

            await createProducto({

                nombre,
                descripcion,
                categoria,
                precio,
                stock,

                tiempo_preparacion: 15,

                requiere_termino: requiereTermino,

                permite_observaciones: permiteObservaciones,

                disponible: true

            });

            alert("Producto creado correctamente");

            handleClose();

        } catch (error) {

            console.error(error);

            alert("Error al guardar");

        }

    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>

            <DialogTitle>

                Nuevo Producto

            </DialogTitle>

            <DialogContent>

                <Grid container spacing={2} mt={1}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select
                            label="Categoría"
                            fullWidth
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <MenuItem value="Carnes">Carnes</MenuItem>
                            <MenuItem value="Hamburguesas">Hamburguesas</MenuItem>
                            <MenuItem value="Pastas">Pastas</MenuItem>
                            <MenuItem value="Bebidas">Bebidas</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Precio"
                            type="number"
                            fullWidth
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Stock"
                            type="number"
                            fullWidth
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </Grid>

                    {/* <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            label="Tiempo de preparación (min)"
                            type="number"
                            fullWidth
                        />
                    </Grid> */}

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            multiline
                            rows={4}
                            label="Descripción"
                            fullWidth
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </Grid>
                    <Divider sx={{ my: 2 }} />

                    <Grid size={{ xs: 12 }}>

                        <Typography
                            variant="h6"
                            mb={2}
                        >
                            Imagen del Producto
                        </Typography>

                        <Box
                            sx={{
                                width: 220,
                                height: 220,
                                border: "2px dashed #bdbdbd",
                                borderRadius: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                                mb: 2,
                            }}
                        >

                            {
                                imagen ? (

                                    <img
                                        src={URL.createObjectURL(imagen)}
                                        alt="Producto"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />

                                ) : (

                                    <Typography color="gray">

                                        Sin imagen

                                    </Typography>

                                )
                            }

                        </Box>


                            Seleccionar Imagen

                            <ProductImage
                                imagen={imagen}
                                setImagen={setImagen}
                            />


                    </Grid>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Configuración del Producto
                    </Typography>

                    <Grid size={{ xs: 12 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={permiteObservaciones}
                                    onChange={(e) => setPermiteObservaciones(e.target.checked)}
                                />
                            }
                            label="Permitir observaciones"
                        />
                    </Grid>

                    {
                        permiteObservaciones && (

                            <Grid size={{ xs: 12 }}>

                                <Typography
                                    fontWeight="bold"
                                    mb={2}
                                >
                                    Ejemplos de observaciones
                                </Typography>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder={`Sin cebolla
Extra queso
Sin tomate
Poco picante`}
                                />

                            </Grid>

                        )
                    }
                    <Grid size={{ xs: 12 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={requiereTermino}
                                    onChange={(e) => setRequiereTermino(e.target.checked)}
                                />
                            }
                            label="Requiere término de cocción"
                        />
                    </Grid>

                    {requiereTermino && (
                        <Grid size={{ xs: 12 }}>
                            <Typography
                                fontWeight="bold"
                                mb={2}
                            >
                                Términos disponibles
                            </Typography>

                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Azul"
                            />

                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Medio"
                            />

                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Tres Cuartos"
                            />

                            <FormControlLabel
                                control={<Checkbox defaultChecked />}
                                label="Bien Cocido"
                            />
                        </Grid>
                    )}

                </Grid>

            </DialogContent>

            <ProductExtras />

            <DialogActions>

                <Button onClick={handleClose}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={guardarProducto}
                >
                    Guardar
                </Button>

            </DialogActions>

        </Dialog>
    );
}

