import { Paper, Typography } from "@mui/material";

export default function SalesChart() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: 350,
      }}
    >
      <Typography variant="h6" mb={2}>
        Ventas de la Semana
      </Typography>

      <Typography>
        Aquí irá la gráfica de ventas.
      </Typography>
    </Paper>
  );
}