import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";

import {
    getMeseros,
    crearMesero,
    actualizarMesero,
    eliminarMesero,
} from "../../services/meseroService";


const COLOR = {
    fondo: "#12171A",
    superficie: "#1B2126",
    superficieAlta: "#212A2F",
    borde: "rgba(255,255,255,0.08)",

    texto: "#F1EDE6",
    textoSuave: "#8C949A",

    cobre: "#E8A33D",
};


export default function Meseros() {

    const [meseros, setMeseros] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [open, setOpen] = useState(false);

    const [meseroEditar, setMeseroEditar] = useState(null);

    const [nombre, setNombre] = useState("");

    const cargarMeseros = async () => {

        try {

            setCargando(true);

            const response = await getMeseros();

            setMeseros(response.data);

        } catch (error) {

            console.error(
                "Error cargando meseros:",
                error
            );

        } finally {

            setCargando(false);

        }
    };


    useEffect(() => {

        cargarMeseros();

    }, []);


    const abrirNuevo = () => {

        setMeseroEditar(null);

        setNombre("");

        setOpen(true);

    };


    const abrirEditar = (mesero) => {

        setMeseroEditar(mesero);

        setNombre(mesero.nombre);

        setOpen(true);

    };


    const cerrarModal = () => {

        setOpen(false);

        setMeseroEditar(null);

        setNombre("");

    };


    const guardar = async () => {

        if (!nombre.trim()) {

            alert("El nombre es obligatorio.");

            return;

        }

        try {

            if (meseroEditar) {

                await actualizarMesero(
                    meseroEditar.id,
                    {
                        nombre: nombre.trim()
                    }
                );

                alert(
                    "Mesero actualizado correctamente."
                );

            } else {

                await crearMesero({
                    nombre: nombre.trim()
                });

                alert(
                    "Mesero creado correctamente."
                );

            }

            cerrarModal();

            await cargarMeseros();

        } catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.error ||
                "No fue posible guardar el mesero."
            );

        }

    };


    const eliminar = async (mesero) => {

        const confirmar = window.confirm(
            `¿Deseas eliminar al mesero "${mesero.nombre}"?`
        );

        if (!confirmar) {
            return;
        }

        try {

            await eliminarMesero(mesero.id);

            await cargarMeseros();

        } catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.error ||
                "No fue posible eliminar el mesero."
            );

        }

    };


    return (

        <Box
            sx={{
                backgroundColor: COLOR.fondo,
                color: COLOR.texto,
                minHeight: "100%",
                borderRadius: "24px",
                p: {
                    xs: 2.5,
                    sm: 3.5
                }
            }}
        >

            {/* ENCABEZADO */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        sx={{
                            fontFamily:
                                "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: {
                                xs: "1.9rem",
                                sm: "2.3rem"
                            }
                        }}
                    >
                        Gestión de meseros
                    </Typography>

                    <Typography
                        sx={{
                            color: COLOR.textoSuave,
                            mt: 0.75
                        }}
                    >
                        Administra los meseros y sus códigos
                        de acceso.
                    </Typography>

                </Box>


                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={abrirNuevo}
                    sx={{
                        backgroundColor: COLOR.cobre,
                        color: "#17130E",
                        borderRadius: 999,
                        px: 2.5,
                        py: 1.15,
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "none",

                        "&:hover": {
                            backgroundColor: "#F0B35A",
                            boxShadow:
                                "0 6px 18px rgba(232,163,61,0.25)"
                        }
                    }}
                >
                    Nuevo mesero
                </Button>

            </Box>


            {/* RESUMEN */}

            <Box
                sx={{
                    backgroundColor: COLOR.superficie,
                    border:
                        `1px solid ${COLOR.borde}`,
                    borderRadius: "16px",
                    p: 2.5,
                    mb: 3
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >

                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "10px",
                            backgroundColor:
                                `${COLOR.cobre}20`,
                            color: COLOR.cobre,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <PeopleIcon />
                    </Box>

                    <Box>

                        <Typography
                            sx={{
                                color:
                                    COLOR.textoSuave,
                                fontSize:
                                    "0.82rem"
                            }}
                        >
                            Meseros registrados
                        </Typography>

                        <Typography
                            sx={{
                                fontFamily:
                                    "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: "1.6rem"
                            }}
                        >
                            {meseros.length}
                        </Typography>

                    </Box>

                </Box>

            </Box>


            {/* TABLA */}

            <TableContainer
                component={Paper}
                sx={{
                    backgroundColor:
                        COLOR.superficie,
                    border:
                        `1px solid ${COLOR.borde}`,
                    borderRadius: "16px",
                    boxShadow: "none"
                }}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    borderColor:
                                        COLOR.borde,
                                    fontWeight: 600
                                }}
                            >
                                ID
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    borderColor:
                                        COLOR.borde,
                                    fontWeight: 600
                                }}
                            >
                                Nombre
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    borderColor:
                                        COLOR.borde,
                                    fontWeight: 600
                                }}
                            >
                                Código
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    borderColor:
                                        COLOR.borde,
                                    fontWeight: 600
                                }}
                            >
                                Estado
                            </TableCell>

                            <TableCell
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    borderColor:
                                        COLOR.borde,
                                    fontWeight: 600
                                    }}
                            >
                                Creado
                            </TableCell>

                            <TableCell
                                align="center"
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    borderColor:
                                        COLOR.borde,
                                    fontWeight: 600
                                }}
                            >
                                Acciones
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {cargando ? (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={{
                                        color:
                                            COLOR.textoSuave,
                                        borderColor:
                                            COLOR.borde,
                                        py: 5
                                    }}
                                >
                                    Cargando meseros...
                                </TableCell>

                            </TableRow>

                        ) : meseros.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                    sx={{
                                        color:
                                            COLOR.textoSuave,
                                        borderColor:
                                            COLOR.borde,
                                        py: 5
                                    }}
                                >
                                    No hay meseros registrados.
                                </TableCell>

                            </TableRow>

                        ) : (

                            meseros.map((mesero) => (

                                <TableRow
                                    key={mesero.id}
                                    hover
                                >

                                    <TableCell
                                        sx={{
                                            color:
                                                COLOR.texto,
                                            borderColor:
                                                COLOR.borde
                                        }}
                                    >
                                        {mesero.id}
                                    </TableCell>


                                    <TableCell
                                        sx={{
                                            color:
                                                COLOR.texto,
                                            borderColor:
                                                COLOR.borde,
                                            fontWeight: 600
                                        }}
                                    >
                                        {mesero.nombre}
                                    </TableCell>


                                    <TableCell
                                        sx={{
                                            borderColor:
                                                COLOR.borde
                                        }}
                                    >

                                        <Chip
                                            label={
                                                mesero.codigo
                                            }
                                            sx={{
                                                fontFamily:
                                                    "monospace",
                                                fontWeight: 700,
                                                letterSpacing:
                                                    "0.12em",
                                                backgroundColor:
                                                    `${COLOR.cobre}18`,
                                                color:
                                                    COLOR.cobre,
                                                border:
                                                    `1px solid ${COLOR.cobre}40`
                                            }}
                                        />

                                    </TableCell>


                                    <TableCell
                                        sx={{
                                            borderColor:
                                                COLOR.borde
                                        }}
                                    >

                                        <Chip
                                            label={
                                                mesero.activo
                                                    ? "Activo"
                                                    : "Inactivo"
                                            }
                                            size="small"
                                            sx={{
                                                backgroundColor:
                                                    mesero.activo
                                                        ? "#3F8F8620"
                                                        : "#E2572B20",
                                                color:
                                                    mesero.activo
                                                        ? "#5B9279"
                                                        : "#E2572B",
                                                fontWeight: 600
                                            }}
                                        />

                                    </TableCell>


                                    <TableCell
                                        sx={{
                                            color:
                                                COLOR.textoSuave,
                                            borderColor:
                                                COLOR.borde
                                        }}
                                    >
                                        {new Date(
                                            mesero.creado
                                        ).toLocaleDateString(
                                            "es-CO"
                                        )}
                                    </TableCell>


                                    <TableCell
                                        align="center"
                                        sx={{
                                            borderColor:
                                                COLOR.borde
                                        }}
                                    >

                                        <IconButton
                                            onClick={() =>
                                                abrirEditar(
                                                    mesero
                                                )
                                            }
                                            sx={{
                                                color:
                                                    COLOR.cobre
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>


                                        <IconButton
                                            onClick={() =>
                                                eliminar(
                                                    mesero
                                                )
                                            }
                                            sx={{
                                                color:
                                                    "#E2572B"
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                    </TableCell>

                                </TableRow>

                            ))

                        )}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* MODAL */}

            <Dialog
                open={open}
                onClose={cerrarModal}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    {meseroEditar
                        ? "Editar mesero"
                        : "Nuevo mesero"}
                </DialogTitle>


                <DialogContent>

                    <TextField
                        autoFocus
                        fullWidth
                        label="Nombre del mesero"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        sx={{ mt: 1 }}
                    />


                    {meseroEditar && (

                        <Box sx={{ mt: 2 }}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Código de acceso
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        "monospace",
                                    fontWeight: 700,
                                    letterSpacing:
                                        "0.15em",
                                    fontSize: "1.2rem"
                                }}
                            >
                                {meseroEditar.codigo}
                            </Typography>

                        </Box>

                    )}

                    {!meseroEditar && (

                        <Typography
                            sx={{
                                mt: 2,
                                color:
                                    "text.secondary",
                                fontSize:
                                    "0.85rem"
                            }}
                        >
                            Se generará automáticamente
                            un código único de 4 caracteres.
                        </Typography>

                    )}

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={cerrarModal}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={guardar}
                        sx={{
                            backgroundColor:
                                COLOR.cobre,
                            color: "#17130E",
                            fontWeight: 700,

                            "&:hover": {
                                backgroundColor:
                                    "#F0B35A"
                            }
                        }}
                    >
                        {meseroEditar
                            ? "Guardar cambios"
                            : "Crear mesero"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );
}