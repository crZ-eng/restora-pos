import { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

import SalesChart from "../../components/cards/SalesChart";
import RecentOrders from "../../components/cards/RecentOrders";

// ---------------------------------------------------------------------------
// Rediseño completo: "tablero de operación en vivo", inspirado en las
// pantallas de expedición de cocina (KDS) — fondo oscuro tipo acero,
// números grandes legibles a distancia, colores de estado en vez del
// arcoíris Material, y un reloj en vivo real en el encabezado. Es una
// dirección deliberadamente distinta a la de Productos (que usa una
// identidad tipo "carta impresa" clara y serif): aquí la personalidad es
// "sala de control", con tipografía geométrica (Space Grotesk + Inter) en
// vez de serif.
//
// Los datos de las estadísticas se generan aquí mismo con componentes
// propios (en vez del StatsCard genérico) para poder darles el tratamiento
// visual — anillo de ocupación, pulso de urgencia en cocina, número
// principal en cifra grande — sin depender de un componente externo que no
// está pensado para un fondo oscuro. SalesChart y RecentOrders sí siguen
// siendo los componentes existentes, enmarcados como si fueran pantallas
// dentro de la consola.
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

function useRelojEnVivo() {
    const [ahora, setAhora] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setAhora(new Date()), 1000);
        return () => clearInterval(id);
    }, []);
    return ahora;
}

function useCountUp(target, durationMs = 700, start = false) {
    const [value, setValue] = useState(0);
    const startRef = useRef(null);

    useEffect(() => {
        if (!start || target === null) return;
        startRef.current = null;

        let frame;
        const step = (timestamp) => {
            if (startRef.current === null) startRef.current = timestamp;
            const progress = Math.min(1, (timestamp - startRef.current) / durationMs);
            setValue(Math.round(progress * target));
            if (progress < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, start]);

    return value;
}

function parseValor(raw) {
    const texto = String(raw);
    const m = texto.match(/^([^\d-]*)(-?[\d.,]+)([\s\S]*)$/);
    if (!m) return { prefijo: "", numero: null, sufijo: texto };
    const [, prefijo, numStr, sufijo] = m;
    return { prefijo, numero: parseFloat(numStr.replace(/,/g, "")), sufijo };
}

const pulso = keyframes`
    0%   { transform: scale(1); opacity: 0.55; }
    70%  { transform: scale(2.4); opacity: 0; }
    100% { transform: scale(2.4); opacity: 0; }
`;

const subir = keyframes`
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
`;

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

function NumeroAnimado({ valor, iniciar, size = "1.9rem" }) {
    const { prefijo, numero, sufijo } = parseValor(valor);
    const animado = useCountUp(numero ?? 0, 750, iniciar && numero !== null);
    const texto = numero !== null ? `${prefijo}${animado}${sufijo}` : valor;

    return (
        <Typography
            sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: size,
                color: COLOR.texto,
                lineHeight: 1
            }}
        >
            {texto}
        </Typography>
    );
}

function Ticket({ titulo, valor, color, icon, delay = 0, urgente = false }) {
    return (
        <Box
            sx={{
                position: "relative",
                backgroundColor: COLOR.superficie,
                border: `1px solid ${COLOR.borde}`,
                borderRadius: "14px",
                p: 2.25,
                overflow: "hidden",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
                <Box sx={{ position: "relative", width: 34, height: 34 }}>
                    {urgente && (
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: "9px",
                                backgroundColor: color,
                                animation: `${pulso} 1.8s ease-out infinite`
                            }}
                        />
                    )}
                    <Box
                        sx={{
                            position: "relative",
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
                </Box>

                <Typography
                    sx={{ color: COLOR.textoSuave, fontSize: "0.82rem", fontWeight: 500 }}
                >
                    {titulo}
                </Typography>
            </Box>

            <NumeroAnimado valor={valor} iniciar size="1.6rem" />
        </Box>
    );
}

function AnilloOcupacion({ ocupadas, total, color, delay = 0 }) {
    const size = 92;
    const grosor = 9;
    const radio = (size - grosor) / 2;
    const circunferencia = 2 * Math.PI * radio;
    const pct = total ? ocupadas / total : 0;
    const offsetFinal = circunferencia * (1 - pct);

    const dibujarAnillo = keyframes`
        from { stroke-dashoffset: ${circunferencia}; }
        to   { stroke-dashoffset: ${offsetFinal}; }
    `;

    return (
        <Box
            sx={{
                backgroundColor: COLOR.superficie,
                border: `1px solid ${COLOR.borde}`,
                borderRadius: "14px",
                p: 2.25,
                display: "flex",
                alignItems: "center",
                gap: 2,
                animation: `${subir} 480ms ${delay}ms cubic-bezier(0.4,0,0.2,1) both`,
                position: "relative",
                overflow: "hidden",
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
            <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
                <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radio}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={grosor}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radio}
                        fill="none"
                        stroke={color}
                        strokeWidth={grosor}
                        strokeLinecap="round"
                        strokeDasharray={circunferencia}
                        style={{
                            animation: `${dibujarAnillo} 900ms ${delay + 250}ms cubic-bezier(0.4,0,0.2,1) both`
                        }}
                    />
                </svg>
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            color: COLOR.texto,
                            lineHeight: 1
                        }}
                    >
                        {ocupadas}/{total}
                    </Typography>
                </Box>
            </Box>

            <Box>
                <TableRestaurantIcon sx={{ color, fontSize: 20, mb: 0.5 }} />
                <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.82rem" }}>
                    Mesas ocupadas
                </Typography>
                <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.75rem", mt: 0.25 }}>
                    {total - ocupadas} libres ahora
                </Typography>
            </Box>
        </Box>
    );
}

function SeccionLabel({ children }) {
    return (
        <Typography
            sx={{
                color: COLOR.textoSuave,
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                mb: 1.5,
                mt: 0.5
            }}
        >
            {children}
        </Typography>
    );
}

function PanelConsola({ etiqueta, color, children, delay = 0 }) {
    return (
        <Fade in timeout={500 + delay}>
            <Box
                sx={{
                    backgroundColor: COLOR.superficie,
                    border: `1px solid ${COLOR.borde}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "100%"
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
                        sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }}
                    />
                    <Typography
                        sx={{ color: COLOR.textoSuave, fontSize: "0.85rem", fontWeight: 600 }}
                    >
                        {etiqueta}
                    </Typography>
                </Box>

                <Box sx={{ p: 2 }}>{children}</Box>
            </Box>
        </Fade>
    );
}

export default function Dashboard() {

    useGoogleFonts();
    const ahora = useRelojEnVivo();

    const horaTexto = ahora.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return (
        <Box
            sx={{
                fontFamily: "'Inter', sans-serif",
                backgroundColor: COLOR.fondo,
                color: COLOR.texto,
                borderRadius: "24px",
                p: { xs: 2.5, sm: 3.5 }
            }}
        >

            {/* ENCABEZADO */}

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
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: { xs: "1.9rem", sm: "2.3rem" },
                                lineHeight: 1.05
                            }}
                        >
                            Tablero en vivo
                        </Typography>
                        <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.92rem", mt: 0.75 }}>
                            El pulso de tu restaurante, actualizado al segundo.
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                        <Box sx={{ textAlign: "right" }}>
                            <Typography
                                sx={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "1.3rem",
                                    fontVariantNumeric: "tabular-nums"
                                }}
                            >
                                {horaTexto}
                            </Typography>
                            <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.72rem" }}>
                                hora actual
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                backgroundColor: "rgba(91,146,121,0.14)",
                                border: `1px solid rgba(91,146,121,0.35)`,
                                borderRadius: 999,
                                px: 1.75,
                                py: 0.9
                            }}
                        >
                            <Box sx={{ position: "relative", width: 8, height: 8 }}>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "50%",
                                        backgroundColor: COLOR.salvia
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "50%",
                                        backgroundColor: COLOR.salvia,
                                        animation: `${pulso} 2s ease-out infinite`
                                    }}
                                />
                            </Box>
                            <Typography sx={{ color: COLOR.salvia, fontWeight: 600, fontSize: "0.85rem" }}>
                                En servicio
                            </Typography>
                        </Box>

                    </Box>
                </Box>
            </Fade>

            {/* ACTIVIDAD DE HOY: cifra principal + rieles de tickets */}

            <SeccionLabel>Actividad de hoy</SeccionLabel>

            <Grid container spacing={2} sx={{ mb: 3.5 }}>

                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "100%",
                            backgroundColor: COLOR.superficieAlta,
                            border: `1px solid ${COLOR.borde}`,
                            borderRadius: "16px",
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            overflow: "hidden",
                            animation: `${subir} 480ms 60ms cubic-bezier(0.4,0,0.2,1) both`,
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: "3px",
                                backgroundColor: COLOR.cobre
                            }
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: "10px",
                                    backgroundColor: `${COLOR.cobre}26`,
                                    color: COLOR.cobre,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <AttachMoneyIcon />
                            </Box>
                            <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.88rem" }}>
                                Ventas de hoy
                            </Typography>
                        </Box>

                        <NumeroAnimado valor="$0" iniciar size="3rem" />
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                        <Grid item xs={12} sm={4}>
                            <Ticket
                                titulo="Pedidos de hoy"
                                valor="2"
                                color={COLOR.acero}
                                icon={<ReceiptLongIcon fontSize="small" />}
                                delay={120}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Ticket
                                titulo="Ticket promedio"
                                valor="$0"
                                color={COLOR.ciruela}
                                icon={<TrendingUpIcon fontSize="small" />}
                                delay={180}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Ticket
                                titulo="Productos vendidos"
                                valor="0"
                                color={COLOR.verdemar}
                                icon={<ShoppingBasketIcon fontSize="small" />}
                                delay={240}
                            />
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

            {/* AHORA MISMO: estado en vivo del salón y la cocina */}

            <SeccionLabel>Ahora mismo</SeccionLabel>

            <Grid container spacing={2} sx={{ mb: 3.5 }}>

                <Grid item xs={12} sm={6} lg={3}>
                    <AnilloOcupacion ocupadas={0} total={12} color={COLOR.salvia} delay={80} />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <Ticket
                        titulo="En cocina"
                        valor="3"
                        color={COLOR.brasa}
                        icon={<LocalFireDepartmentIcon fontSize="small" />}
                        delay={140}
                        urgente
                    />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <Ticket
                        titulo="Meseros activos"
                        valor="0"
                        color={COLOR.acero}
                        icon={<PeopleIcon fontSize="small" />}
                        delay={200}
                    />
                </Grid>

                <Grid item xs={12} sm={6} lg={3}>
                    <Ticket
                        titulo="Reservas"
                        valor="5"
                        color={COLOR.ciruela}
                        icon={<RestaurantIcon fontSize="small" />}
                        delay={260}
                    />
                </Grid>

            </Grid>

            {/* PANTALLAS: ventas y pedidos recientes, enmarcadas como parte de la consola */}

            <Grid container spacing={2} sx={{ mb: 3.5 }}>

                <Grid item xs={12} lg={8}>
                    <PanelConsola etiqueta="Ventas de la semana" color={COLOR.cobre} delay={0}>
                        <SalesChart />
                    </PanelConsola>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <PanelConsola etiqueta="Pedidos recientes" color={COLOR.acero} delay={80}>
                        <RecentOrders />
                    </PanelConsola>
                </Grid>

            </Grid>

            {/* ESTADO DEL RESTAURANTE Y PRODUCTOS DESTACADOS */}

            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                    <PanelConsola etiqueta="Estado del restaurante" color={COLOR.salvia} delay={0}>

                        {[
                            {
                                titulo: "Mesas",
                                detalle: "Disponibilidad actual",
                                valor: "12 disponibles",
                                color: COLOR.salvia
                            },
                            {
                                titulo: "Cocina",
                                detalle: "Pedidos pendientes",
                                valor: "3 pedidos",
                                color: COLOR.brasa
                            },
                            {
                                titulo: "Personal",
                                detalle: "Meseros conectados",
                                valor: "0 activos",
                                color: COLOR.acero
                            }
                        ].map((fila, i, arr) => (
                            <Box key={fila.titulo}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 1.5
                                    }}
                                >
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: "0.92rem" }}>
                                            {fila.titulo}
                                        </Typography>
                                        <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.8rem" }}>
                                            {fila.detalle}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            backgroundColor: `${fila.color}22`,
                                            color: fila.color,
                                            fontWeight: 700,
                                            fontSize: "0.78rem",
                                            borderRadius: 999,
                                            px: 1.5,
                                            py: 0.5
                                        }}
                                    >
                                        {fila.valor}
                                    </Box>
                                </Box>
                                {i < arr.length - 1 && <Divider sx={{ borderColor: COLOR.borde }} />}
                            </Box>
                        ))}

                    </PanelConsola>
                </Grid>

                <Grid item xs={12} md={6}>
                    <PanelConsola etiqueta="Productos destacados" color={COLOR.cobre} delay={80}>

                        {[
                            { nombre: "Hamburguesas", ventas: "0 vendidos" },
                            { nombre: "Carnes", ventas: "0 vendidos" },
                            { nombre: "Pastas", ventas: "0 vendidos" }
                        ].map((producto, i, arr) => (
                            <Box key={producto.nombre}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 1.5
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Box
                                            sx={{
                                                width: 34,
                                                height: 34,
                                                borderRadius: "9px",
                                                backgroundColor: `${COLOR.cobre}22`,
                                                color: COLOR.cobre,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <RestaurantIcon fontSize="small" />
                                        </Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: "0.92rem" }}>
                                            {producto.nombre}
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ color: COLOR.textoSuave, fontSize: "0.85rem" }}>
                                        {producto.ventas}
                                    </Typography>
                                </Box>
                                {i < arr.length - 1 && <Divider sx={{ borderColor: COLOR.borde }} />}
                            </Box>
                        ))}

                    </PanelConsola>
                </Grid>

            </Grid>

        </Box>
    );
}
