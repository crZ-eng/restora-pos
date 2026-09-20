import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Button,
    TextField,
    IconButton,
    Divider,
    Avatar,
    Badge,
} from "@mui/material";

import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import { getProductos } from "../../services/productService";

// -----------------------------------------------------------------------
// Datos fijos: no dependen del estado del componente, por eso SÍ pueden
// vivir fuera de él sin problema (a diferencia del useEffect y "categorias"
// que veías antes arriba del componente — esos rompían todo porque usaban
// "productos"/"setProductos", que solo existen DENTRO de Mesero()).
//
// mesasIniciales está hardcodeado por ahora. Si ya tienes un endpoint de
// mesas en el backend Django, lo ideal es reemplazar esto por un fetch
// igual al de productos (ver el useEffect dentro del componente).
// -----------------------------------------------------------------------
const mesasIniciales = [
    { id: 1, personas: 4, estado: "libre" },
    { id: 2, personas: 2, estado: "libre" },
    { id: 3, personas: 6, estado: "ocupada" },
    { id: 4, personas: 4, estado: "libre" },
    { id: 5, personas: 4, estado: "cuenta" },
    { id: 6, personas: 2, estado: "ocupada" },
    { id: 7, personas: 2, estado: "libre" },
    { id: 8, personas: 4, estado: "libre" },
];

const terminos = ["Rojo", "Medio Rojo", "3/4", "Bien Cocido"];

const API_BASE_URL = "http://127.0.0.1:8000";

function formatearPrecio(valor) {
    return `$${valor.toLocaleString("es-CO")}`;
}

export default function Mesero() {
    // ---- Estado del componente (todo lo que useEffect/categorias necesitan) ----
    const [productos, setProductos] = useState([]);
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const [mesas, setMesas] = useState(mesasIniciales);
    const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
    const [categoria, setCategoria] = useState("todas");
    const [busqueda, setBusqueda] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [termino, setTermino] = useState("Medio Rojo");
    const [observaciones, setObservaciones] = useState("");
    const [comanda, setComanda] = useState([]);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState("");

    // ---- Cargar productos desde el backend Django ----
    // Esto SÍ debe estar dentro del componente: es un Hook de React y
    // además usa setProductos/setCargandoProductos.
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setCargandoProductos(true);
                const response = await getProductos();
                const data = response.data;
                setProductos(Array.isArray(data) ? data : data.results || []);
            } catch (error) {
                console.error("Error cargando productos para el mesero:", error);
            } finally {
                setCargandoProductos(false);
            }
        };

        cargarProductos();
    }, []);

    // ---- Categorías derivadas de los productos cargados ----
    // También debe ir aquí adentro: depende de "productos", que es estado
    // del componente y no existe fuera de él.
    const categorias = [
        "todas",
        ...new Set(
            productos
                .filter((producto) => producto.disponible === true)
                .map((producto) => producto.categoria)
        ),
    ];

    const usuario = localStorage.getItem("usuario") || "Mesero";

    const productosFiltrados = productos.filter((producto) => {
        const coincideBusqueda = producto.nombre
            ?.toLowerCase()
            .includes(busqueda.toLowerCase());
        const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
        return producto.disponible === true && coincideBusqueda && coincideCategoria;
    });

    function seleccionarMesa(mesa) {
        setMesaSeleccionada(mesa);
        setCategoria("todas");
        setProductoSeleccionado(null);
        setCantidad(1);
        setObservaciones("");
    }

    function seleccionarProducto(producto) {
        setProductoSeleccionado(producto);
        setCantidad(1);
        setTermino("Medio Rojo");
        setObservaciones("");
    }

    function agregarAComanda() {
        if (!productoSeleccionado) return;

        const nuevoItem = {
            id: Date.now(),
            productoId: productoSeleccionado.id,
            nombre: productoSeleccionado.nombre,
            precio: productoSeleccionado.precio,
            cantidad,
            termino: productoSeleccionado.requiereTermino ? termino : null,
            observaciones,
        };

        setComanda((prev) => [...prev, nuevoItem]);
        setProductoSeleccionado(null);
        setCantidad(1);
        setObservaciones("");
    }

    function eliminarDeComanda(id) {
        setComanda((prev) => prev.filter((item) => item.id !== id));
    }

    const totalComanda = comanda.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    );

    // ---- Enviar comanda a cocina ----
    // NOTA IMPORTANTE: esto solo actualiza el estado local (la mesa pasa a
    // "ocupada" en pantalla), pero todavía NO envía nada al backend. Falta
    // el endpoint de pedidos en Django (algo como PedidoViewSet, similar al
    // ProductoViewSet que ya tienes) y su llamada aquí con fetch/axios.
    // Te lo dejo señalado en vez de inventar un endpoint que no existe.
    async function enviarACocina() {
        if (!mesaSeleccionada || comanda.length === 0) return;

        setErrorEnvio("");

        try {
            // TODO: reemplazar por la llamada real, por ejemplo:
            // await crearPedido({ mesa: mesaSeleccionada.id, items: comanda });

            setMostrarConfirmacion(true);
            setMesas((prev) =>
                prev.map((mesa) =>
                    mesa.id === mesaSeleccionada.id ? { ...mesa, estado: "ocupada" } : mesa
                )
            );
            setComanda([]);

            setTimeout(() => setMostrarConfirmacion(false), 3500);
        } catch (error) {
            console.error("Error enviando la comanda:", error);
            setErrorEnvio("No se pudo enviar la comanda. Intenta de nuevo.");
        }
    }

    function cerrarSesion() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("rol");
        localStorage.removeItem("usuario");
        window.location.href = "/";
    }

    function urlImagen(rutaImagen) {
        if (!rutaImagen) return null;
        // Si el backend ya devuelve una URL completa, la respetamos tal cual.
        return rutaImagen.startsWith("http") ? rutaImagen : `${API_BASE_URL}${rutaImagen}`;
    }

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100%",
                display: "flex",
                overflow: "hidden",
                background: "#12171A",
                color: "#F1EDE6",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* SIDEBAR */}
            <Box
                sx={{
                    width: 180,
                    background: "#171C20",
                    borderRight: "1px solid #2B3237",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        height: 90,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        borderBottom: "1px solid #2B3237",
                    }}
                >
                    <RestaurantIcon sx={{ fontSize: 32, color: "#E8A33D" }} />
                    <Typography sx={{ fontSize: 17, fontWeight: 800, letterSpacing: 1, color: "#F1EDE6" }}>
                        RESTORA
                    </Typography>
                    <Typography sx={{ fontSize: 8, color: "#90989D" }}>RESTAURANTE</Typography>
                </Box>

                <Box sx={{ flex: 1, py: 2 }}>
                    <MenuItem icon={<TableRestaurantIcon />} text="Mesas" active />
                    <MenuItem icon={<AddShoppingCartIcon />} text="Nuevo pedido" />
                    <MenuItem icon={<ReceiptLongIcon />} text="Mis comandas" />
                    <MenuItem icon={<HistoryIcon />} text="Historial" />
                    <MenuItem icon={<PersonIcon />} text="Mi perfil" />
                </Box>

                <Box sx={{ borderTop: "1px solid #2B3237", p: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 13, background: "#E8A33D" }}>
                            {usuario.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 700 }}>{usuario}</Typography>
                            <Typography sx={{ fontSize: 9, color: "#8E969B" }}>Mesero</Typography>
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={cerrarSesion}
                        sx={{ justifyContent: "flex-start", color: "#D76B5D", fontSize: 10, textTransform: "none" }}
                    >
                        Cerrar sesión
                    </Button>
                </Box>
            </Box>

            {/* CONTENIDO PRINCIPAL */}
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        height: 64,
                        borderBottom: "1px solid #2B3237",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 3,
                        flexShrink: 0,
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: 19, fontWeight: 800 }}>Mesas</Typography>
                        <Typography sx={{ fontSize: 11, color: "#858E93" }}>
                            Selecciona una mesa para comenzar un pedido
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Estado color="#3F8F86" text="Libre" />
                            <Estado color="#E8A33D" text="Ocupada" />
                            <Estado color="#4C8FBD" text="Con cuenta" />
                        </Box>

                        <IconButton sx={{ color: "#F1EDE6" }}>
                            <Badge variant="dot" color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, minmax(170px, 1fr))",
                            gap: 2,
                        }}
                    >
                        {mesas.map((mesa) => (
                            <MesaCard
                                key={mesa.id}
                                mesa={mesa}
                                seleccionada={mesaSeleccionada?.id === mesa.id}
                                onClick={() => seleccionarMesa(mesa)}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* PANEL PEDIDO */}
            {mesaSeleccionada && (
                <Box
                    sx={{
                        width: 760,
                        maxWidth: "50vw",
                        background: "#1B2126",
                        borderLeft: "1px solid #30383D",
                        display: "flex",
                        flexDirection: "column",
                        flexShrink: 0,
                    }}
                >
                    <Box
                        sx={{
                            height: 64,
                            px: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #30383D",
                        }}
                    >
                        <Box>
                            <Typography sx={{ fontSize: 16, fontWeight: 800 }}>
                                Tomar pedido - Mesa {mesaSeleccionada.id}
                            </Typography>
                            <Typography sx={{ fontSize: 10, color: "#858E93" }}>
                                {mesaSeleccionada.personas} personas
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setMesaSeleccionada(null)} sx={{ color: "#A8AFB3" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
                        {/* PRODUCTOS */}
                        <Box sx={{ flex: 1, minWidth: 0, p: 2, overflow: "auto", borderRight: "1px solid #30383D" }}>
                            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", mb: 2 }}>
                                {categorias.map((item) => (
                                    <Button
                                        key={item}
                                        onClick={() => setCategoria(item)}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            fontSize: 10,
                                            textTransform: "none",
                                            color: categoria === item ? "#E8A33D" : "#9AA2A6",
                                            borderBottom: categoria === item ? "2px solid #E8A33D" : "2px solid transparent",
                                            borderRadius: 0,
                                        }}
                                    >
                                        {item === "todas" ? "Todos" : item}
                                    </Button>
                                ))}
                            </Box>

                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Buscar plato..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: "#6E777C" }} />,
                                }}
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        background: "#151A1E",
                                        color: "#F1EDE6",
                                        fontSize: 11,
                                        "& fieldset": { borderColor: "#30383D" },
                                    },
                                }}
                            />

                            {cargandoProductos ? (
                                <Typography sx={{ fontSize: 11, color: "#858E93" }}>
                                    Cargando platos...
                                </Typography>
                            ) : productosFiltrados.length === 0 ? (
                                <Typography sx={{ fontSize: 11, color: "#858E93" }}>
                                    No hay platos que coincidan con la búsqueda.
                                </Typography>
                            ) : (
                                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
                                    {productosFiltrados.map((producto) => (
                                        <ProductoCard
                                            key={producto.id}
                                            producto={producto}
                                            urlImagen={urlImagen}
                                            onClick={() => seleccionarProducto(producto)}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {/* COMANDA */}
                        <Box sx={{ width: 270, display: "flex", flexDirection: "column", background: "#151A1E" }}>
                            <Box sx={{ p: 2, borderBottom: "1px solid #30383D" }}>
                                <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                                    Comanda - Mesa {mesaSeleccionada.id}
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, overflow: "auto" }}>
                                {comanda.length === 0 ? (
                                    <Box sx={{ p: 3, textAlign: "center" }}>
                                        <ReceiptLongIcon sx={{ fontSize: 40, color: "#555E63" }} />
                                        <Typography sx={{ mt: 1, fontSize: 11, color: "#777F84" }}>
                                            La comanda está vacía
                                        </Typography>
                                    </Box>
                                ) : (
                                    comanda.map((item) => (
                                        <Box key={item.id} sx={{ p: 1.5, borderBottom: "1px solid #292F33" }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                                                <Typography sx={{ fontSize: 11, fontWeight: 700 }}>
                                                    {item.cantidad} x {item.nombre}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => eliminarDeComanda(item.id)}
                                                    sx={{ color: "#D75F55" }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Box>

                                            {item.termino && (
                                                <Typography sx={{ fontSize: 9, color: "#B4BDC1", mt: 0.5 }}>
                                                    Término: {item.termino}
                                                </Typography>
                                            )}

                                            {item.observaciones && (
                                                <Typography sx={{ fontSize: 9, color: "#B4BDC1" }}>
                                                    {item.observaciones}
                                                </Typography>
                                            )}

                                            <Typography sx={{ fontSize: 10, textAlign: "right", color: "#E8A33D", mt: 0.5 }}>
                                                {formatearPrecio(item.precio * item.cantidad)}
                                            </Typography>
                                        </Box>
                                    ))
                                )}
                            </Box>

                            <Box sx={{ borderTop: "1px solid #30383D", p: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography sx={{ fontSize: 12 }}>Total:</Typography>
                                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#E8A33D" }}>
                                        {formatearPrecio(totalComanda)}
                                    </Typography>
                                </Box>

                                {errorEnvio && (
                                    <Typography sx={{ fontSize: 10, color: "#D75F55", mb: 1 }}>
                                        {errorEnvio}
                                    </Typography>
                                )}

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={enviarACocina}
                                    disabled={comanda.length === 0}
                                    sx={{
                                        background: "#3F8F86",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: 11,
                                        "&:hover": { background: "#34766F" },
                                    }}
                                >
                                    Enviar a cocina
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* DETALLE DEL PRODUCTO */}
            {productoSeleccionado && (
                <Box
                    sx={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.65)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                    }}
                >
                    <Box
                        sx={{
                            width: 440,
                            maxWidth: "90vw",
                            background: "#1B2126",
                            border: "1px solid #3A4348",
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0,0,0,.5)",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                borderBottom: "1px solid #30383D",
                            }}
                        >
                            <Typography sx={{ fontSize: 16, fontWeight: 800 }}>Detalle del plato</Typography>
                            <IconButton onClick={() => setProductoSeleccionado(null)} sx={{ color: "#A8AFB3" }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 80,
                                        borderRadius: 1,
                                        background: "#272F34",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                    }}
                                >
                                    {urlImagen(productoSeleccionado.imagen) ? (
                                        <Box
                                            component="img"
                                            src={urlImagen(productoSeleccionado.imagen)}
                                            alt={productoSeleccionado.nombre}
                                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <RestaurantIcon sx={{ fontSize: 40, color: "#E8A33D" }} />
                                    )}
                                </Box>

                                <Box>
                                    <Typography sx={{ fontWeight: 800, fontSize: 15 }}>
                                        {productoSeleccionado.nombre}
                                    </Typography>
                                    <Typography sx={{ color: "#E8A33D", fontWeight: 700, mt: 0.5 }}>
                                        {formatearPrecio(productoSeleccionado.precio)}
                                    </Typography>
                                    <Typography sx={{ color: "#8D969B", fontSize: 9, mt: 0.5 }}>
                                        Stock disponible: {productoSeleccionado.stock}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography sx={{ fontSize: 11, color: "#AAB1B5", mt: 2, lineHeight: 1.6 }}>
                                {productoSeleccionado.descripcion}
                            </Typography>

                            <Divider sx={{ borderColor: "#30383D", my: 2 }} />

                            <Typography sx={{ fontSize: 11, fontWeight: 700, mb: 1 }}>
                                Especificaciones
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                placeholder="Ej: Sin cebolla, extra papas, salsa aparte..."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        background: "#151A1E",
                                        color: "#F1EDE6",
                                        fontSize: 10,
                                        "& fieldset": { borderColor: "#30383D" },
                                    },
                                }}
                            />

                            {productoSeleccionado.requiereTermino && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography sx={{ fontSize: 11, fontWeight: 700, mb: 1 }}>
                                        Término de la carne
                                    </Typography>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.5 }}>
                                        {terminos.map((item) => (
                                            <Button
                                                key={item}
                                                onClick={() => setTermino(item)}
                                                sx={{
                                                    minWidth: 0,
                                                    fontSize: 8,
                                                    textTransform: "none",
                                                    color: termino === item ? "#FFFFFF" : "#9CA4A8",
                                                    background: termino === item ? "#5D4037" : "#242B2F",
                                                    "&:hover": { background: "#5D4037" },
                                                }}
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography sx={{ fontSize: 11, fontWeight: 700 }}>Cantidad</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                        sx={{ color: "#F1EDE6", background: "#252C30" }}
                                    >
                                        <RemoveIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <Typography sx={{ minWidth: 25, textAlign: "center" }}>{cantidad}</Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() =>
                                            setCantidad(Math.min(productoSeleccionado.stock, cantidad + 1))
                                        }
                                        sx={{ color: "#F1EDE6", background: "#252C30" }}
                                    >
                                        <AddIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={agregarAComanda}
                                sx={{
                                    mt: 2,
                                    py: 1.3,
                                    background: "#5D4037",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    "&:hover": { background: "#3E2723" },
                                }}
                            >
                                Agregar a la comanda
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* CONFIRMACIÓN */}
            {mostrarConfirmacion && (
                <Box
                    sx={{
                        position: "fixed",
                        right: 25,
                        bottom: 25,
                        width: 340,
                        background: "#17231F",
                        border: "1px solid #3F8F86",
                        borderRadius: 2,
                        p: 2,
                        zIndex: 200,
                        boxShadow: "0 15px 40px rgba(0,0,0,.4)",
                    }}
                >
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "#3F8F86",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            ✓
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>¡Comanda enviada!</Typography>
                            <Typography sx={{ fontSize: 9, color: "#9DA8A5", mt: 0.3 }}>
                                La comanda fue enviada a cocina.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

/* =========================================================
   COMPONENTES AUXILIARES
========================================================= */

function MenuItem({ icon, text, active = false }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                px: 1.5,
                py: 1.2,
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                cursor: "pointer",
                background: active ? "#5D4037" : "transparent",
                color: active ? "#FFFFFF" : "#8F989D",
                "&:hover": { background: "#252C30" },
            }}
        >
            {icon}
            <Typography sx={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{text}</Typography>
        </Box>
    );
}

function Estado({ color, text }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
            <Typography sx={{ fontSize: 9, color: "#929A9F" }}>{text}</Typography>
        </Box>
    );
}

function MesaCard({ mesa, seleccionada, onClick }) {
    const configuracion = {
        libre: { color: "#3F8F86", background: "#182925", texto: "Libre" },
        ocupada: { color: "#E8A33D", background: "#30291D", texto: "Ocupada" },
        cuenta: { color: "#4C8FBD", background: "#1B2934", texto: "Con cuenta" },
    };

    const estado = configuracion[mesa.estado];

    return (
        <Box
            onClick={onClick}
            sx={{
                minHeight: 155,
                border: seleccionada ? `2px solid ${estado.color}` : "1px solid #30383D",
                borderRadius: 2,
                background: estado.background,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .2s ease",
                "&:hover": { transform: "translateY(-2px)", borderColor: estado.color },
            }}
        >
            <TableRestaurantIcon sx={{ fontSize: 42, color: estado.color, mb: 1 }} />
            <Typography sx={{ fontSize: 15, fontWeight: 800 }}>Mesa {mesa.id}</Typography>
            <Typography sx={{ fontSize: 10, color: "#929A9F", mb: 1 }}>{mesa.personas} personas</Typography>
            <Box sx={{ px: 2, py: 0.5, borderRadius: 1, background: estado.color }}>
                <Typography sx={{ fontSize: 9, color: "#FFFFFF", fontWeight: 700 }}>{estado.texto}</Typography>
            </Box>
        </Box>
    );
}

function ProductoCard({ producto, urlImagen, onClick }) {
    const imagen = urlImagen(producto.imagen);

    return (
        <Box
            sx={{
                background: "#1B2126",
                border: "1px solid #30383D",
                borderRadius: 1.5,
                p: 1,
                cursor: "pointer",
                position: "relative",
                "&:hover": { borderColor: "#E8A33D" },
            }}
        >
            <Box onClick={onClick} sx={{ display: "flex", gap: 1 }}>
                <Box
                    sx={{
                        width: 55,
                        height: 55,
                        borderRadius: 1,
                        background: "#282F34",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        flexShrink: 0,
                    }}
                >
                    {imagen ? (
                        <Box
                            component="img"
                            src={imagen}
                            alt={producto.nombre}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <RestaurantIcon sx={{ fontSize: 28, color: "#E8A33D" }} />
                    )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700 }}>{producto.nombre}</Typography>
                    <Typography sx={{ fontSize: 10, color: "#E8A33D", fontWeight: 700 }}>
                        {formatearPrecio(producto.precio)}
                    </Typography>
                    <Typography sx={{ fontSize: 8, color: "#7F898E" }}>Stock: {producto.stock}</Typography>
                </Box>
            </Box>

            <IconButton
                size="small"
                onClick={onClick}
                sx={{
                    position: "absolute",
                    right: 4,
                    bottom: 4,
                    width: 25,
                    height: 25,
                    background: "#5D4037",
                    color: "#FFFFFF",
                    "&:hover": { background: "#3E2723" },
                }}
            >
                <AddIcon sx={{ fontSize: 15 }} />
            </IconButton>
        </Box>
    );
}
