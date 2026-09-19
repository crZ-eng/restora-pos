import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper
} from "@mui/material";

import { registrarAdministrador } from "../../services/authService";


export default function Register() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [error, setError] = useState("");


    const registrar = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response = await registrarAdministrador({

                username,
                password,
                password_confirm: passwordConfirm

            });

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

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.error ||
                "No se pudo registrar el administrador."
            );

        }

    };


    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <Paper
                sx={{
                    p: 4,
                    width: 400
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    mb={3}
                >
                    Crear administrador
                </Typography>


                <form onSubmit={registrar}>

                    <TextField
                        fullWidth
                        label="Usuario"
                        margin="normal"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />


                    <TextField
                        fullWidth
                        type="password"
                        label="Contraseña"
                        margin="normal"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />


                    <TextField
                        fullWidth
                        type="password"
                        label="Confirmar contraseña"
                        margin="normal"
                        value={passwordConfirm}
                        onChange={(e) =>
                            setPasswordConfirm(e.target.value)
                        }
                    />


                    {error && (

                        <Typography
                            color="error"
                            mt={2}
                        >
                            {error}
                        </Typography>

                    )}


                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Crear administrador
                    </Button>

                </form>

            </Paper>

        </Box>

    );

}