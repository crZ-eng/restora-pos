import { Outlet, Link } from "react-router-dom";

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

const drawerWidth = 260;

const menu = [
  {
    nombre: "Dashboard",
    icono: <DashboardIcon />,
    ruta: "/dashboard",
  },
  {
    nombre: "Meseros",
    icono: <PeopleIcon />,
    ruta: "/meseros",
  },
  {
    nombre: "Mesas",
    icono: <TableRestaurantIcon />,
    ruta: "/mesas",
  },
  {
    nombre: "Productos",
    icono: <RestaurantMenuIcon />,
    ruta: "/productos",
  },
  {
    nombre: "Pedidos",
    icono: <ReceiptLongIcon />,
    ruta: "/pedidos",
  },
  {
    nombre: "Cocina",
    icono: <KitchenIcon />,
    ruta: "/cocina",
  },
  {
    nombre: "Inventario",
    icono: <InventoryIcon />,
    ruta: "/inventario",
  },
  {
    nombre: "Caja",
    icono: <PaymentsIcon />,
    ruta: "/caja",
  },
  {
    nombre: "Reportes",
    icono: <BarChartIcon />,
    ruta: "/reportes",
  },
  {
    nombre: "Configuración",
    icono: <SettingsIcon />,
    ruta: "/configuracion",
  },
];

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          background: "#5D4037",
          zIndex: 1201,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold">
            RESTORA
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Administrador</Typography>

            <Avatar sx={{ bgcolor: "#C8A97E" }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: "64px",
            background: "#FFF",
            borderRight: "1px solid #ECECEC",
          },
        }}
      >
        <List>
          {menu.map((item) => (
            <ListItemButton
              key={item.nombre}
              component={Link}
              to={item.ruta}
            >
              <ListItemIcon>{item.icono}</ListItemIcon>

              <ListItemText primary={item.nombre} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          background: "#F7F5F2",
          p: 4,
          ml: "260px",
          mt: "64px",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}