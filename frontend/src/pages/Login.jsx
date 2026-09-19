import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Tabs,
    Tab,
    Alert,
} from "@mui/material";

import {
    loginAdministrador,
    loginMesero,
} from "../services/authService";


export default function Login() {

    const navigate = useNavigate();

    const [tipo, setTipo] = useState(0);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [codigo, setCodigo] = useState("");

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);


    const iniciarSesion = async (e) => {

        e.preventDefault();

        setError("");
        setCargando(true);

        try {

            let response;

            if (tipo === 0) {

                response = await loginAdministrador({
                    username,
                    password,
                });

            } else {

                response = await loginMesero({
                    codigo,
                });

            }

            localStorage.setItem(
                "access_token",
                response.data.access
            );

            localStorage.setItem(
                "refresh_token",
                response.data.refresh
            );

            localStorage.setItem(
                "rol",
                response.data.rol
            );

            localStorage.setItem(
                "usuario",
                response.data.usuario
            );


            if (response.data.rol === "administrador") {

                navigate("/dashboard");

            } else {

                navigate("/mesero");

            }

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "No se pudo iniciar sesión."
            );

        } finally {

            setCargando(false);

        }
    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f1eb",
                padding: 2,
            }}
        >

            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 430,
                    padding: 4,
                    borderRadius: 3,
                }}
            >

                <Typography
                    variant="h3"
                    align="center"
                    fontWeight="bold"
                    sx={{
                        color: "#5D4037",
                        mb: 1,
                    }}
                >
                    RESTORA
                </Typography>


                <Typography
                    align="center"
                    color="text.secondary"
                    mb={3}
                >
                    Sistema de gestión para restaurantes
                </Typography>


                <Tabs
                    value={tipo}
                    onChange={(e, nuevoValor) => {

                        setTipo(nuevoValor);
                        setError("");

                    }}
                    variant="fullWidth"
                    sx={{ mb: 3 }}
                >

                    <Tab label="Administrador" />

                    <Tab label="Mesero" />

                </Tabs>


                <form onSubmit={iniciarSesion}>

                    {tipo === 0 ? (

                        <>

                            <TextField
                                fullWidth
                                label="Usuario"
                                margin="normal"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                            />


                            <TextField
                                fullWidth
                                label="Contraseña"
                                type="password"
                                margin="normal"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </>

                    ) : (

                        <TextField
                            fullWidth
                            label="Código de mesero"
                            margin="normal"
                            value={codigo}
                            onChange={(e) =>
                                setCodigo(
                                    e.target.value.toUpperCase()
                                )
                            }
                            inputProps={{
                                maxLength: 6,
                            }}
                            required
                        />

                    )}


                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mt: 2 }}
                        >
                            {error}
                        </Alert>

                    )}


                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={cargando}
                        sx={{
                            mt: 3,
                            py: 1.5,
                            backgroundColor: "#5D4037",
                            "&:hover": {
                                backgroundColor: "#3E2723",
                            },
                        }}
                    >

                        {cargando
                            ? "Ingresando..."
                            : tipo === 0
                                ? "Iniciar sesión"
                                : "Ingresar como mesero"
                        }

                    </Button>


                    {tipo === 0 && (

                        <Button
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() =>
                                navigate("/registro")
                            }
                        >
                            Crear administrador
                        </Button>

                    )}

                </form>

            </Paper>

        </Box>
    );
}