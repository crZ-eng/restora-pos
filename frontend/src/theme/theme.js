import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette:{

        primary:{
            main:"#5D4037"
        },

        secondary:{
            main:"#C8A97E"
        },

        success:{
            main:"#4CAF50"
        },

        background:{
            default:"#F8F5F2",
            paper:"#FFFFFF"
        }

    },

    typography:{
        fontFamily:"Roboto, sans-serif"
    },

    shape:{
        borderRadius:12
    }

});

export default theme;