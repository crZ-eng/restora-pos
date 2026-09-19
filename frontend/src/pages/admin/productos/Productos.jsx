import { useEffect, useMemo, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import {
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Skeleton,
    TextField,
    Typography,
    Fade,
    Grow,
    Divider
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategoryIcon from "@mui/icons-material/Category";
import FilterListIcon from "@mui/icons-material/FilterList";

import ProductTable from "../../../components/products/ProductTable";
import ProductModal from "../../../components/products/ProductModal";

import {
    getProductos,
    deleteProducto
} from "../../../services/productService";

// ---------------------------------------------------------------------------
// Identidad visual
// Misma línea visual del Dashboard:
// fondo oscuro tipo consola, Space Grotesk para cifras/títulos,
// Inter para interfaz, acentos de estado y tarjetas con líneas superiores.
// ---------------------------------------------------------------------------

const FONT_LINK_ID = "restora-fonts-grotesk-inter";

function useGoogleFonts() {
    useEffect(() => {
        if (document.getElementById(FONT_LINK_ID)) return;

        const link = document.createElement("link");

        link.id = FONT_LINK_ID;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";

        document.head.appendChild(link);
    }, []);
}

const subir = keyframes`
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const pulso = keyframes`
    0% {
        transform: scale(1);
        opacity: 0.55;
    }

    70% {
        transform: scale(2.3);
        opacity: 0;
    }

    100% {
        transform: scale(2.3);
        opacity: 0;
    }
`;

const drawLine = keyframes`
    from {
        transform: scaleX(0);
    }

    to {
        transform: scaleX(1);
    }
`;

function useCountUp(target, durationMs = 700, start = false) {
    const [value, setValue] = useState(0);
    const startRef = useRef(null);

    useEffect(() => {
        if (!start) return;

        startRef.current = null;

        let frame;

        const step = (timestamp) => {
            if (startRef.current === null) {
                startRef.current = timestamp;
            }

            const progress = Math.min(
                1,
                (timestamp - startRef.current) / durationMs
            );

            setValue(Math.round(progress * target));

            if (progress < 1) {
                frame = requestAnimationFrame(step);
            }
        };

        frame = requestAnimationFrame(step);

        return () => cancelAnimationFrame(frame);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, start]);

    return value;
}

const COLOR = {
    fondo: "#12171A",
    superficie: "#1B2126",
    superficieAlta: "#212A2F",
    borde: "rgba(255,255,255,0.08)",

    texto: "#F1EDE6",
    textoSuave: "#8C949A",

    cobre: "#E8A33D",
    acero: "#4C8FBD",
    ciruela: "#A6597A",
    verdemar: "#3F8F86",
    salvia: "#5B9279",
    brasa: "#E2572B"
};

const OPCIONES_ORDEN = [
    {
        valor: "reciente",
        etiqueta: "Más recientes"
    },
    {
        valor: "nombre_asc",
        etiqueta: "Nombre (A–Z)"
    },
    {
        valor: "nombre_desc",
        etiqueta: "Nombre (Z–A)"
    },
    {
        valor: "precio_asc",
        etiqueta: "Precio menor → mayor"
    },
    {
        valor: "precio_desc",
        etiqueta: "Precio mayor → menor"
    }
];

function descargarCSV(productos) {
    if (!productos.length) return;

    const columnas = Array.from(
        productos.reduce((set, p) => {
            Object.keys(p).forEach((k) => set.add(k));
            return set;
        }, new Set())
    );

    const filas = productos.map((p) =>
        columnas
            .map((c) =>
                `"${String(p[c] ?? "").replace(/"/g, '""')}"`
            )
            .join(",")
    );

    const csv = [columnas.join(","), ...filas].join("\n");

    const blob = new Blob(
        ["\uFEFF" + csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "productos-restora.csv";
    a.click();

    URL.revokeObjectURL(url);
}

function NumeroAnimado({
    valor,
    color = COLOR.texto,
    size = "1.8rem"
}) {
    const numero = Number(valor) || 0;

    const animado = useCountUp(
        numero,
        700,
        true
    );

    return (
        <Typography
            sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: size,
                color,
                lineHeight: 1
            }}
        >
            {animado}
        </Typography>
    );
}

function Ticket({
    titulo,
    valor,
    color,
    icon,
    delay = 0
}) {
    return (
        <Box
            sx={{
                position: "relative",
                backgroundColor: COLOR.superficie,
                border: `1px solid ${COLOR.borde}`,
                borderRadius: "14px",
                p: 2.25,
                overflow: "hidden",
                height: "100%",
                animation: `${subir} 480ms ${delay}ms cubic-bezier(0.4,0,0.2,1) both`,

                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    backgroundColor: color
                }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    mb: 1.5
                }}
            >
                <Box
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "9px",
                        backgroundColor: `${color}26`,
                        color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {icon}
                </Box>

                <Typography
                    sx={{
                        color: COLOR.textoSuave,
                        fontSize: "0.82rem",
                        fontWeight: 500
                    }}
                >
                    {titulo}
                </Typography>
            </Box>

            <NumeroAnimado
                valor={valor}
                color={COLOR.texto}
                size="1.65rem"
            />
        </Box>
    );
}

function PanelConsola({
    etiqueta,
    color,
    children,
    delay = 0
}) {
    return (
        <Fade in timeout={500 + delay}>
            <Box
                sx={{
                    backgroundColor: COLOR.superficie,
                    border: `1px solid ${COLOR.borde}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    animation: `${subir} 480ms ${delay}ms cubic-bezier(0.4,0,0.2,1) both`
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2.5,
                        py: 1.5,
                        borderBottom: `1px solid ${COLOR.borde}`
                    }}
                >
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: color
                        }}
                    />

                    <Typography
                        sx={{
                            color: COLOR.textoSuave,
                            fontSize: "0.85rem",
                            fontWeight: 600
                        }}
                    >
                        {etiqueta}
                    </Typography>
                </Box>

                <Box sx={{ p: 2 }}>
                    {children}
                </Box>
            </Box>
        </Fade>
    );
}

export default function Productos() {

    useGoogleFonts();

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("todas");
    const [disponibilidad, setDisponibilidad] = useState("todas");
    const [orden, setOrden] = useState("reciente");

    const [open, setOpen] = useState(false);
    const [productoEditar, setProductoEditar] = useState(null);

    const cargarProductos = async () => {

        try {

            setCargando(true);

            const response = await getProductos();

            setProductos(response.data);

        } catch (error) {

            console.error(
                "Error cargando productos:",
                error
            );

        } finally {

            setCargando(false);

        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const abrirNuevoProducto = () => {
        setProductoEditar(null);
        setOpen(true);
    };

    const editarProducto = (producto) => {
        setProductoEditar(producto);
        setOpen(true);
    };

    const eliminarProducto = async (id) => {

        if (
            !window.confirm(
                "¿Desea eliminar este producto?"
            )
        ) {
            return;
        }

        try {

            await deleteProducto(id);

            await cargarProductos();

        } catch (error) {

            console.error(
                "Error eliminando producto:",
                error
            );

        }
    };

    const cerrarModal = () => {
        setOpen(false);
        setProductoEditar(null);
    };

    // -----------------------------------------------------------------------
    // FILTROS DINÁMICOS
    // -----------------------------------------------------------------------

    const tieneCategoria = productos.some(
        (p) => p?.categoria
    );

    const tieneDisponibilidad = productos.some(
        (p) =>
            typeof p?.disponible === "boolean"
    );

    const categorias = useMemo(() => {

        if (!tieneCategoria) {
            return [];
        }

        return Array.from(
            new Set(
                productos
                    .map((p) => p.categoria)
                    .filter(Boolean)
            )
        ).sort();

    }, [productos, tieneCategoria]);

    const productosFiltrados = useMemo(() => {

        const termino =
            busqueda
                .trim()
                .toLowerCase();

        let lista = productos;

        if (termino) {

            lista = lista.filter(
                (producto) =>
                    Object.values(producto)
                        .join(" ")
                        .toLowerCase()
                        .includes(termino)
            );
        }

        if (
            tieneCategoria &&
            categoria !== "todas"
        ) {

            lista = lista.filter(
                (p) =>
                    p.categoria === categoria
            );
        }

        if (
            tieneDisponibilidad &&
            disponibilidad !== "todas"
        ) {

            const buscaDisponible =
                disponibilidad === "disponible";

            lista = lista.filter(
                (p) =>
                    Boolean(p.disponible) ===
                    buscaDisponible
            );
        }

        const ordenada = [...lista];

        switch (orden) {

            case "nombre_asc":

                ordenada.sort(
                    (a, b) =>
                        String(
                            a.nombre ?? ""
                        ).localeCompare(
                            String(
                                b.nombre ?? ""
                            )
                        )
                );

                break;

            case "nombre_desc":

                ordenada.sort(
                    (a, b) =>
                        String(
                            b.nombre ?? ""
                        ).localeCompare(
                            String(
                                a.nombre ?? ""
                            )
                        )
                );

                break;

            case "precio_asc":

                ordenada.sort(
                    (a, b) =>
                        Number(
                            a.precio ?? 0
                        ) -
                        Number(
                            b.precio ?? 0
                        )
                );

                break;

            case "precio_desc":

                ordenada.sort(
                    (a, b) =>
                        Number(
                            b.precio ?? 0
                        ) -
                        Number(
                            a.precio ?? 0
                        )
                );

                break;

            default:
                break;
        }

        return ordenada;

    }, [
        productos,
        busqueda,
        categoria,
        disponibilidad,
        orden,
        tieneCategoria,
        tieneDisponibilidad
    ]);

    const total = useCountUp(
        productos.length,
        650,
        !cargando
    );

    const disponibles = useMemo(
        () =>
            productos.filter(
                (p) =>
                    p?.disponible === true
            ).length,
        [productos]
    );

    const categoriasRegistradas =
        categorias.length;

    const hayFiltrosActivos =
        Boolean(busqueda) ||
        categoria !== "todas" ||
        disponibilidad !== "todas";

    const limpiarFiltros = () => {

        setBusqueda("");
        setCategoria("todas");
        setDisponibilidad("todas");

    };

    return (

        <Box
            sx={{
                fontFamily: "'Inter', sans-serif",
                backgroundColor: COLOR.fondo,
                color: COLOR.texto,
                borderRadius: "24px",
                p: {
                    xs: 2.5,
                    sm: 3.5
                }
            }}
        >

            {/* =============================================================
                ENCABEZADO
            ============================================================= */}

            <Fade in timeout={450}>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3.5
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
                                },
                                lineHeight: 1.05
                            }}
                        >
                            Gestión del menú
                        </Typography>

                        <Typography
                            sx={{
                                color: COLOR.textoSuave,
                                fontSize: "0.92rem",
                                mt: 0.75
                            }}
                        >
                            Controla los productos que aparecen
                            en la carta de Restora.
                        </Typography>

                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.25,
                            flexWrap: "wrap"
                        }}
                    >

                        <Button
                            variant="outlined"
                            startIcon={
                                <FileDownloadIcon />
                            }
                            onClick={() =>
                                descargarCSV(
                                    productosFiltrados
                                )
                            }
                            disabled={
                                !productosFiltrados.length
                            }
                            sx={{
                                borderRadius: 999,
                                px: 2.2,
                                color: COLOR.textoSuave,
                                borderColor:
                                    COLOR.borde,
                                textTransform:
                                    "none",
                                fontWeight: 600,

                                "&:hover": {
                                    borderColor:
                                        COLOR.cobre,
                                    backgroundColor:
                                        `${COLOR.cobre}12`
                                }
                            }}
                        >
                            Exportar
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={
                                abrirNuevoProducto
                            }
                            sx={{
                                backgroundColor:
                                    COLOR.cobre,
                                color: "#17130E",
                                borderRadius: 999,
                                px: 2.5,
                                py: 1.15,
                                fontWeight: 700,
                                textTransform:
                                    "none",
                                boxShadow: "none",

                                "&:hover": {
                                    backgroundColor:
                                        "#F0B35A",
                                    boxShadow:
                                        "0 6px 18px rgba(232,163,61,0.25)"
                                }
                            }}
                        >
                            Añadir producto
                        </Button>

                    </Box>

                </Box>

            </Fade>


            {/* =============================================================
                RESUMEN
            ============================================================= */}

            <Typography
                sx={{
                    color: COLOR.textoSuave,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    mb: 1.5
                }}
            >
                RESUMEN DEL CATÁLOGO
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)"
                    },
                    gap: 2,
                    mb: 3.5
                }}
            >

                <Ticket
                    titulo="Productos registrados"
                    valor={total}
                    color={COLOR.cobre}
                    icon={
                        <Inventory2Icon
                            fontSize="small"
                        />
                    }
                    delay={80}
                />

                <Ticket
                    titulo="Productos disponibles"
                    valor={disponibles}
                    color={COLOR.salvia}
                    icon={
                        <CheckCircleIcon
                            fontSize="small"
                        />
                    }
                    delay={140}
                />

                <Ticket
                    titulo="Categorías"
                    valor={categoriasRegistradas}
                    color={COLOR.acero}
                    icon={
                        <CategoryIcon
                            fontSize="small"
                        />
                    }
                    delay={200}
                />

                <Ticket
                    titulo="Visibles ahora"
                    valor={
                        cargando
                            ? 0
                            : productosFiltrados.length
                    }
                    color={COLOR.verdemar}
                    icon={
                        <FilterListIcon
                            fontSize="small"
                        />
                    }
                    delay={260}
                />

            </Box>


            {/* =============================================================
                HERRAMIENTAS
            ============================================================= */}

            <PanelConsola
                etiqueta="Herramientas del catálogo"
                color={COLOR.cobre}
                delay={0}
            >

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >

                    <TextField
                        placeholder="Buscar producto, categoría o precio…"
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(
                                e.target.value
                            )
                        }
                        size="small"
                        sx={{
                            flex:
                                "1 1 260px",
                            maxWidth: 420,

                            "& .MuiOutlinedInput-root":
                            {
                                color:
                                    COLOR.texto,
                                backgroundColor:
                                    COLOR.superficieAlta,
                                borderRadius: 999,

                                "& fieldset": {
                                    borderColor:
                                        COLOR.borde
                                },

                                "&:hover fieldset":
                                {
                                    borderColor:
                                        "rgba(232,163,61,0.45)"
                                },

                                "&.Mui-focused fieldset":
                                {
                                    borderColor:
                                        COLOR.cobre
                                }
                            },

                            "& input::placeholder":
                            {
                                color:
                                    COLOR.textoSuave,
                                opacity: 1
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{
                                            color:
                                                COLOR.textoSuave,
                                            fontSize: 20
                                        }}
                                    />
                                </InputAdornment>
                            ),

                            endAdornment:
                                busqueda ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                setBusqueda(
                                                    ""
                                                )
                                            }
                                        >
                                            <ClearIcon
                                                sx={{
                                                    fontSize: 18,
                                                    color:
                                                        COLOR.textoSuave
                                                }}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                        }}
                    />

                    <Select
                        value={orden}
                        onChange={(e) =>
                            setOrden(
                                e.target.value
                            )
                        }
                        size="small"
                        IconComponent={
                            SwapVertIcon
                        }
                        sx={{
                            minWidth: 210,
                            color: COLOR.texto,
                            borderRadius: 999,
                            backgroundColor:
                                COLOR.superficieAlta,

                            ".MuiOutlinedInput-notchedOutline":
                            {
                                borderColor:
                                    COLOR.borde
                            },

                            "&:hover .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor:
                                    "rgba(232,163,61,0.45)"
                            },

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor:
                                    COLOR.cobre
                            },

                            ".MuiSvgIcon-root": {
                                color:
                                    COLOR.textoSuave
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor:
                                        COLOR.superficie,
                                    color:
                                        COLOR.texto,
                                    border:
                                        `1px solid ${COLOR.borde}`
                                }
                            }
                        }}
                    >

                        {OPCIONES_ORDEN.map(
                            (op) => (
                                <MenuItem
                                    key={op.valor}
                                    value={op.valor}
                                >
                                    {op.etiqueta}
                                </MenuItem>
                            )
                        )}

                    </Select>

                    {hayFiltrosActivos && (

                        <Button
                            onClick={
                                limpiarFiltros
                            }
                            size="small"
                            sx={{
                                color:
                                    COLOR.textoSuave,
                                textTransform:
                                    "none",
                                fontWeight: 600,

                                "&:hover": {
                                    color:
                                        COLOR.texto,
                                    backgroundColor:
                                        "rgba(255,255,255,0.04)"
                                }
                            }}
                        >
                            Limpiar filtros
                        </Button>

                    )}

                </Box>

            </PanelConsola>


            {/* =============================================================
                FILTROS
            ============================================================= */}

            {(categorias.length > 0 ||
                tieneDisponibilidad) && (

                    <Box
                        sx={{
                            mt: 2,
                            mb: 3.5,
                            backgroundColor:
                                COLOR.superficie,
                            border:
                                `1px solid ${COLOR.borde}`,
                            borderRadius: "14px",
                            p: 2
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1.25
                            }}
                        >

                            <FilterListIcon
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    fontSize: 18
                                }}
                            />

                            <Typography
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    fontSize:
                                        "0.78rem",
                                    fontWeight: 600
                                }}
                            >
                                Filtros activos del catálogo
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                gap: 1
                            }}
                        >

                            {tieneDisponibilidad && (
                                <>
                                    {[
                                        {
                                            valor:
                                                "todas",
                                            etiqueta:
                                                "Todos"
                                        },
                                        {
                                            valor:
                                                "disponible",
                                            etiqueta:
                                                "Disponibles"
                                        },
                                        {
                                            valor:
                                                "agotado",
                                            etiqueta:
                                                "Agotados"
                                        }
                                    ].map((op) => (

                                        <Chip
                                            key={
                                                op.valor
                                            }
                                            label={
                                                op.etiqueta
                                            }
                                            onClick={() =>
                                                setDisponibilidad(
                                                    op.valor
                                                )
                                            }
                                            sx={{
                                                borderRadius:
                                                    999,
                                                fontWeight:
                                                    600,

                                                backgroundColor:
                                                    disponibilidad ===
                                                        op.valor
                                                        ? COLOR.salvia
                                                        : COLOR.superficieAlta,

                                                color:
                                                    disponibilidad ===
                                                        op.valor
                                                        ? "#FFFFFF"
                                                        : COLOR.textoSuave,

                                                border:
                                                    `1px solid ${disponibilidad ===
                                                        op.valor
                                                        ? COLOR.salvia
                                                        : COLOR.borde
                                                    }`,

                                                "&:hover":
                                                {
                                                    backgroundColor:
                                                        disponibilidad ===
                                                            op.valor
                                                            ? "#4C7D68"
                                                            : "#273136"
                                                }
                                            }}
                                        />

                                    ))}

                                    {categorias.length >
                                        0 && (
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                sx={{
                                                    borderColor:
                                                        COLOR.borde,
                                                    mx: 0.5
                                                }}
                                            />
                                        )}
                                </>
                            )}

                            {categorias.length >
                                0 && (
                                    <>
                                        <Chip
                                            label="Todas"
                                            onClick={() =>
                                                setCategoria(
                                                    "todas"
                                                )
                                            }
                                            sx={{
                                                borderRadius:
                                                    999,
                                                fontWeight:
                                                    600,
                                                backgroundColor:
                                                    categoria ===
                                                        "todas"
                                                        ? COLOR.cobre
                                                        : COLOR.superficieAlta,
                                                color:
                                                    categoria ===
                                                        "todas"
                                                        ? "#17130E"
                                                        : COLOR.textoSuave,
                                                border:
                                                    `1px solid ${categoria ===
                                                        "todas"
                                                        ? COLOR.cobre
                                                        : COLOR.borde
                                                    }`
                                            }}
                                        />

                                        {categorias.map(
                                            (cat) => (

                                                <Chip
                                                    key={
                                                        cat
                                                    }
                                                    label={
                                                        cat
                                                    }
                                                    onClick={() =>
                                                        setCategoria(
                                                            cat
                                                        )
                                                    }
                                                    sx={{
                                                        borderRadius:
                                                            999,
                                                        fontWeight:
                                                            600,
                                                        backgroundColor:
                                                            categoria ===
                                                                cat
                                                                ? COLOR.acero
                                                                : COLOR.superficieAlta,
                                                        color:
                                                            categoria ===
                                                                cat
                                                                ? "#FFFFFF"
                                                                : COLOR.textoSuave,
                                                        border:
                                                            `1px solid ${categoria ===
                                                                cat
                                                                ? COLOR.acero
                                                                : COLOR.borde
                                                            }`
                                                    }}
                                                />

                                            )
                                        )}
                                    </>
                                )}

                        </Box>

                    </Box>

                )}


            {/* =============================================================
                TABLA
            ============================================================= */}

            <PanelConsola
                etiqueta={
                    hayFiltrosActivos
                        ? `Resultados filtrados · ${productosFiltrados.length}`
                        : "Catálogo de productos"
                }
                color={COLOR.acero}
                delay={80}
            >

                {cargando ? (

                    <Box sx={{ p: 1 }}>

                        {[...Array(5)].map(
                            (_, i) => (

                                <Skeleton
                                    key={i}
                                    variant="rounded"
                                    height={54}
                                    sx={{
                                        mb: 1.25,
                                        borderRadius:
                                            2,
                                        backgroundColor:
                                            "rgba(255,255,255,0.05)"
                                    }}
                                />

                            )
                        )}

                    </Box>

                ) : productosFiltrados.length ===
                    0 ? (

                    <Fade in timeout={400}>

                        <Box
                            sx={{
                                py: 8,
                                px: 3,
                                textAlign:
                                    "center"
                            }}
                        >

                            <Box
                                sx={{
                                    width: 58,
                                    height: 58,
                                    borderRadius:
                                        "14px",
                                    margin:
                                        "0 auto 16px",
                                    backgroundColor:
                                        `${COLOR.cobre}18`,
                                    color:
                                        COLOR.cobre,
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center"
                                }}
                            >
                                <RestaurantMenuIcon
                                    sx={{
                                        fontSize: 30
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontFamily:
                                        "'Space Grotesk', sans-serif",
                                    fontWeight: 700,
                                    fontSize:
                                        "1.2rem",
                                    color:
                                        COLOR.texto
                                }}
                            >
                                {hayFiltrosActivos
                                    ? "Nada coincide con estos filtros"
                                    : "Todavía no hay productos"}
                            </Typography>

                            <Typography
                                sx={{
                                    color:
                                        COLOR.textoSuave,
                                    mt: 0.75,
                                    fontSize:
                                        "0.9rem"
                                }}
                            >
                                {hayFiltrosActivos
                                    ? "Prueba con otra categoría, disponibilidad o búsqueda."
                                    : "Agrega el primer producto para comenzar a construir la carta."}
                            </Typography>

                            {hayFiltrosActivos ? (

                                <Button
                                    onClick={
                                        limpiarFiltros
                                    }
                                    sx={{
                                        mt: 2.5,
                                        color:
                                            COLOR.cobre,
                                        fontWeight:
                                            600,
                                        textTransform:
                                            "none"
                                    }}
                                >
                                    Limpiar filtros
                                </Button>

                            ) : (

                                <Button
                                    onClick={
                                        abrirNuevoProducto
                                    }
                                    startIcon={
                                        <AddIcon />
                                    }
                                    sx={{
                                        mt: 2.5,
                                        color:
                                            COLOR.cobre,
                                        fontWeight:
                                            700,
                                        textTransform:
                                            "none"
                                    }}
                                >
                                    Añadir producto
                                </Button>

                            )}

                        </Box>

                    </Fade>

                ) : (

                    <Grow in timeout={350}>

                        <Box
                            sx={{
                                animation:
                                    `${subir} 420ms cubic-bezier(0.4,0,0.2,1) both`,

                                "& tbody tr": {
                                    transition:
                                        "background-color 150ms ease"
                                },

                                "& tbody tr:hover": {
                                    backgroundColor:
                                        "rgba(232,163,61,0.06) !important"
                                },

                                "& table": {
                                    color:
                                        COLOR.texto
                                },

                                "& th": {
                                    color:
                                        COLOR.textoSuave,
                                    borderColor:
                                        COLOR.borde
                                },

                                "& td": {
                                    color:
                                        COLOR.texto,
                                    borderColor:
                                        COLOR.borde
                                }
                            }}
                        >

                            <ProductTable
                                productos={
                                    productosFiltrados
                                }
                                onEdit={
                                    editarProducto
                                }
                                onDelete={
                                    eliminarProducto
                                }
                            />

                        </Box>

                    </Grow>

                )}

            </PanelConsola>


            {/* =============================================================
                MODAL
            ============================================================= */}

            <ProductModal
                open={open}
                handleClose={cerrarModal}
                producto={
                    productoEditar
                }
                onSuccess={() => {

                    cerrarModal();

                    cargarProductos();

                }}
            />

        </Box>
    );
}