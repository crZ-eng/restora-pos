import { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fade,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import KitchenIcon from "@mui/icons-material/Kitchen";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentsIcon from "@mui/icons-material/Payments";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import logoRestora from "../assets/logo/logonom.png";

const drawerWidth = 260;

// ---------------------------------------------------------------------------
// Mismo lenguaje visual que "Tablero en vivo" (Dashboard.jsx): canvas y
// cromo comparten la familia de oscuros de la consola, así el panel del
// dashboard deja de verse como una isla oscura flotando sobre una barra
// marrón y un fondo crema — ahora todo es una sola consola continua.
//
//   fondo         #12171A  → mismo color que el panel del Dashboard, así
//                             el contenido se funde con el lienzo principal
//   cromo         #1B2126  → barra superior y menú lateral, un tono más
//                             claro que el lienzo para marcar que son
//                             "chrome" de la app, no contenido
//   borde         rgba(255,255,255,0.08)
//   texto         #F1EDE6
//   texto_suave   #8C949A
//   cobre         #E8A33D  → mismo acento que "Ventas de hoy": es el color
//                             de marca en toda la consola (logo, ítem
//                             activo del menú, avatar)
//
// Tipografía: Space Grotesk (marca, títulos) + Inter (menú, cuerpo) — las
// mismas dos familias que ya carga el Dashboard.
// ---------------------------------------------------------------------------

const FONT_LINK_ID = "restora-fonts-grotesk-inter";

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const COLOR = {
  fondo: "#12171A",
  cromo: "#1B2126",
  borde: "rgba(255,255,255,0.08)",
  texto: "#F1EDE6",
  textoSuave: "#8C949A",
  cobre: "#E8A33D",
};

const menu = [
  { nombre: "Dashboard", icono: <DashboardIcon />, ruta: "/dashboard" },
  { nombre: "Meseros", icono: <PeopleIcon />, ruta: "/meseros" },
  { nombre: "Mesas", icono: <TableRestaurantIcon />, ruta: "/mesas" },
  { nombre: "Productos", icono: <RestaurantMenuIcon />, ruta: "/productos" },
  { nombre: "Pedidos", icono: <ReceiptLongIcon />, ruta: "/pedidos" },
  { nombre: "Cocina", icono: <KitchenIcon />, ruta: "/cocina" },
  { nombre: "Inventario", icono: <InventoryIcon />, ruta: "/inventario" },
  { nombre: "Caja", icono: <PaymentsIcon />, ruta: "/caja" },
  { nombre: "Reportes", icono: <BarChartIcon />, ruta: "/reportes" },
  { nombre: "Configuración", icono: <SettingsIcon />, ruta: "/configuracion" },
];

export default function AdminLayout() {

  useGoogleFonts();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", fontFamily: "'Inter', sans-serif" }}>

      {/* BARRA SUPERIOR */}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: COLOR.cromo,
          borderBottom: `1px solid ${COLOR.borde}`,
          zIndex: 1201,
        }}
      >
        <Fade in timeout={450}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

            <Box
              component="img"
              src={logoRestora}
              alt="Restora"
              sx={{
                height: 42,
                width: "auto",
                objectFit: "contain",
                display: "block"
              }}
            />

            <Box display="flex" alignItems="center" gap={1.5}>
              <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.9rem" }}>
                Administrador
              </Typography>

              <Avatar
                sx={{
                  bgcolor: COLOR.cobre,
                  color: COLOR.fondo,
                  fontWeight: 700,
                  width: 36,
                  height: 36,
                }}
              >
                A
              </Avatar>
            </Box>

          </Toolbar>
        </Fade>
      </AppBar>

      {/* MENÚ LATERAL */}

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: "64px",
            backgroundColor: COLOR.cromo,
            borderRight: `1px solid ${COLOR.borde}`,
          },
        }}
      >
        <Fade in timeout={550}>
          <List sx={{ px: 1.5, py: 2 }}>
            {menu.map((item) => {

              const activo =
                location.pathname === item.ruta ||
                location.pathname.startsWith(`${item.ruta}/`);

              return (
                <ListItemButton
                  key={item.nombre}
                  component={Link}
                  to={item.ruta}
                  sx={{
                    borderRadius: "10px",
                    mb: 0.5,
                    py: 1,
                    color: activo ? COLOR.texto : COLOR.textoSuave,
                    backgroundColor: activo ? "rgba(232,163,61,0.14)" : "transparent",
                    borderLeft: activo
                      ? `3px solid ${COLOR.cobre}`
                      : "3px solid transparent",
                    transition: "background-color 150ms ease, color 150ms ease",
                    "&:hover": {
                      backgroundColor: activo
                        ? "rgba(232,163,61,0.18)"
                        : "rgba(255,255,255,0.04)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: activo ? COLOR.cobre : COLOR.textoSuave,
                    }}
                  >
                    {item.icono}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.nombre}
                    primaryTypographyProps={{
                      fontSize: "0.92rem",
                      fontWeight: activo ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              );

            })}
          </List>
        </Fade>
      </Drawer>

      {/* CONTENIDO */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: COLOR.fondo,
          p: { xs: 2, sm: 3 },
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Box>

    </Box>
  );
}
