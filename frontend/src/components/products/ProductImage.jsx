import { Box, Button, Grid, Typography } from "@mui/material";

export default function ProductImage({
    imagen,
    setImagen
}) {

    return (

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
                    mb: 2
                }}
            >

                {
                    imagen ?

                        <img
                            src={URL.createObjectURL(imagen)}
                            alt="producto"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />

                        :

                        <Typography color="gray">

                            Sin imagen

                        </Typography>

                }

            </Box>

            <Button
                component="label"
                variant="outlined"
            >

                Seleccionar Imagen

                <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setImagen(e.target.files[0])
                    }
                />

            </Button>

        </Grid>

    );

}