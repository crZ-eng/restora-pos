import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

const pedidos = [

    {
        mesa:4,
        estado:"Preparando"
    },

    {
        mesa:8,
        estado:"Listo"
    },

    {
        mesa:2,
        estado:"Pendiente"
    }

];

export default function RecentOrders(){

    return(

        <Paper
        sx={{
            p:3,
            borderRadius:3,
            height:"100%"
        }}
        >

            <Typography
            variant="h6"
            mb={2}
            >

                Pedidos Recientes

            </Typography>

            <List>

                {

                    pedidos.map((pedido,index)=>(

                        <ListItem
                        key={index}
                        divider
                        >

                            <ListItemText

                                primary={`Mesa ${pedido.mesa}`}

                            />

                            <Chip

                            label={pedido.estado}

                            color={
                                pedido.estado==="Listo"
                                ?"success"
                                :
                                pedido.estado==="Preparando"
                                ?"warning"
                                :"default"
                            }

                            />

                        </ListItem>

                    ))

                }

            </List>

        </Paper>

    );

}