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
import { useEffect, useState } from "react";
import ProductImage from "./ProductImage";
import ProductExtras from "./ProductExtras";
import { createProducto, updateProducto } from "../../services/productService";

// -----------------------------------------------------------------------
// NOTA: este modal ahora sirve tanto para crear como para editar.
// `updateProducto` se importa de productService.js — si ese archivo no
// tiene todavía esa función, agrégale algo como:
//
//   export const updateProducto = (id, data) =>
//       axiosInstance.put(`/productos/${id}`, data);
//
// (ajusta el método/endpoint al que realmente use tu backend; lo hice
// simétrico a como ya usan `deleteProducto(id)` y `createProducto(data)`).
// -----------------------------------------------------------------------

const VALORES_INICIALES = {
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
    requiereTermino: false,
    permiteObservaciones: false,
};

export default function ProductModal({
    open,
    handleClose,
    producto,
    onSuccess,
}) {

    const esEdicion = Boolean(producto?.id);

    const [requiereTermino, setRequiereTermino] = useState(false);
    const [permiteObservaciones, setPermiteObservaciones] = useState(false);
    const [imagen, setImagen] = useState(null);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");

    const [guardando, setGuardando] = useState(false);

    // Cada vez que se abre el modal, precarga los datos del producto a
    // editar (o limpia el formulario si es uno nuevo).
    useEffect(() => {

        if (!open) return;

        if (producto) {

            setNombre(producto.nombre ?? "");
            setDescripcion(producto.descripcion ?? "");
            setCategoria(producto.categoria ?? "");
            setPrecio(producto.precio ?? "");
            setStock(producto.stock ?? "");
            setRequiereTermino(Boolean(producto.requiere_termino));
            setPermiteObservaciones(Boolean(producto.permite_observaciones));

        } else {

            setNombre(VALORES_INICIALES.nombre);
            setDescripcion(VALORES_INICIALES.descripcion);
            setCategoria(VALORES_INICIALES.categoria);
            setPrecio(VALORES_INICIALES.precio);
            setStock(VALORES_INICIALES.stock);
            setRequiereTermino(VALORES_INICIALES.requiereTermino);
            setPermiteObservaciones(VALORES_INICIALES.permiteObservaciones);

        }

        setImagen(null);

    }, [open, producto]);

    // Imagen ya guardada en el backend (si el producto trae alguno de
    // estos campos). No sé cómo se llama exactamente el campo en tu API,
    // así que reviso los nombres más comunes — dime cuál es el correcto
    // si ninguno aplica.
    const imagenExistenteUrl =
        producto?.imagen_url ??
        producto?.imagenUrl ??
        producto?.imagen ??
        producto?.foto ??
        null;

    const guardarProducto = async () => {

        try {

            setGuardando(true);

            const payload = {
                nombre,
                descripcion,
                categoria,
                precio,
                stock,
                tiempo_preparacion: producto?.tiempo_preparacion ?? 15,
                requiere_termino: requiereTermino,
                permite_observaciones: permiteObservaciones,
                disponible: producto?.disponible ?? true,
            };

            if (esEdicion) {
                await updateProducto(producto.id, payload);
            } else {
                await createProducto(payload);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                handleClose();
            }

        } catch (error) {

            console.error(error);
            alert(esEdicion ? "Error al actualizar" : "Error al guardar");

        } finally {

            setGuardando(false);

        }

    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>

            <DialogTitle>
                {esEdicion ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>

            <DialogContent>

                <Grid container spacing={2} mt={1}>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </Grid>

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

                    <Divider sx={{ my: 2, width: "100%" }} />

                    <Grid size={{ xs: 12 }}>

                        <Typography variant="h6" mb={2}>
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

                            {imagen ? (

                                <img
                                    src={URL.createObjectURL(imagen)}
                                    alt="Producto"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />

                            ) : imagenExistenteUrl ? (

                                <img
                                    src={imagenExistenteUrl}
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

                            )}

                        </Box>

                        Seleccionar Imagen

                        <ProductImage
                            imagen={imagen}
                            setImagen={setImagen}
                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Configuración del Producto
                        </Typography>
                    </Grid>

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

                    {permiteObservaciones && (

                        <Grid size={{ xs: 12 }}>

                            <Typography fontWeight="bold" mb={2}>
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

                    )}

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
                            <Typography fontWeight="bold" mb={2}>
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

                <Button onClick={handleClose} disabled={guardando}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={guardarProducto}
                    disabled={guardando}
                >
                    {guardando
                        ? "Guardando…"
                        : esEdicion
                            ? "Guardar cambios"
                            : "Guardar"}
                </Button>

            </DialogActions>

        </Dialog>
    );
}
