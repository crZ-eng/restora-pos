import {
    Grid,
    Typography,
    TextField,
    Button,
    Stack
} from "@mui/material";

import { useState } from "react";

export default function ProductExtras() {

    const [extras, setExtras] = useState([]);

    const agregarExtra = () => {

        setExtras([
            ...extras,
            {
                nombre: "",
                precio: 0
            }
        ]);

    };

    return (

        <Grid size={{ xs: 12 }}>

            <Typography
                variant="h6"
                mb={2}
            >
                Extras
            </Typography>

            <Stack spacing={2}>

                {

                    extras.map((extra, index) => (

                        <Grid
                            container
                            spacing={2}
                            key={index}
                        >

                            <Grid size={{ xs: 7 }}>

                                <TextField
                                    fullWidth
                                    label="Nombre"
                                />

                            </Grid>

                            <Grid size={{ xs: 5 }}>

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Precio"
                                />

                            </Grid>

                        </Grid>

                    ))

                }

            </Stack>

            <Button
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={agregarExtra}
            >

                + Agregar Extra

            </Button>

        </Grid>

    );

}