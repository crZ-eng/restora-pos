import { useState } from "react";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import ProductSearch from "./ProductSearch";
import ProductModal from "./ProductModal";

export default function ProductToolbar() {

  const [open, setOpen] = useState(false);

  return (

    <>

      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Productos
          </Typography>

          <Typography color="gray">
            Administra el menú del restaurante
          </Typography>

        </Box>

        <Box display="flex" gap={2}>

          <ProductSearch />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              background: "#5D4037",
            }}
          >
            Nuevo Producto
          </Button>

        </Box>

      </Box>

      <ProductModal
        open={open}
        handleClose={() => setOpen(false)}
      />

    </>

  );
}