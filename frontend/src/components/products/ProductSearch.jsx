import SearchIcon from "@mui/icons-material/Search";

import {
    TextField,
    InputAdornment
} from "@mui/material";

export default function ProductSearch() {

    return (

        <TextField

            placeholder="Buscar producto..."

            size="small"

            InputProps={{

                startAdornment:(

                    <InputAdornment position="start">

                        <SearchIcon/>

                    </InputAdornment>

                )

            }}

        />

    );

}