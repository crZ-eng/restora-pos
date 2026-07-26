import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatsCard({
    title,
    value,
    icon,
    color = "#5D4037"
}) {

    return (

        <Card
            sx={{
                borderRadius:3,
                boxShadow:3
            }}
        >

            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            color="text.secondary"
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {value}
                        </Typography>

                    </Box>

                    <Box
                        sx={{
                            width:60,
                            height:60,
                            borderRadius:"50%",
                            background:color,
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            color:"white"
                        }}
                    >

                        {icon}

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

}