import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PeopleIcon from "@mui/icons-material/People";

import StatsCard from "../../components/cards/StatsCard";
import SalesChart from "../../components/cards/SalesChart";
import RecentOrders from "../../components/cards/RecentOrders";

export default function Dashboard(){

    return(

        <>

            <Typography
            variant="h4"
            fontWeight="bold"
            mb={4}
            >

                Dashboard

            </Typography>

            <Grid container spacing={3}>

                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard
                    title="Ventas"
                    value="$0"
                    color="#4CAF50"
                    icon={<AttachMoneyIcon/>}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard
                    title="Pedidos"
                    value="0"
                    color="#2196F3"
                    icon={<ReceiptLongIcon/>}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard
                    title="Mesas"
                    value="0"
                    color="#FF9800"
                    icon={<TableRestaurantIcon/>}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <StatsCard
                    title="Meseros"
                    value="0"
                    color="#9C27B0"
                    icon={<PeopleIcon/>}
                    />
                </Grid>

                <Grid item xs={12} lg={8}>
                    <SalesChart/>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <RecentOrders/>
                </Grid>

            </Grid>

        </>

    );

}