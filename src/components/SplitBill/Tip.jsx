import React from 'react';
import {Store} from "../../Store";
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";

function SelectTip () {

    const { dispatch } = React.useContext(Store);
    const [tip, setTip ] = React.useState(10);

    return (

        <Grid container dir={"rtl"}>
            <Grid item xs={5} >
            <TextField
                autoFocus
                style={{marginTop: '15px', marginRight: '30px'}}
                id="tip"
                value={tip}
                onChange={(event) => setTip(event.target.value)}
                type="number"
                min={0}
                InputProps={{min: 0, startAdornment: <InputAdornment position="start">%</InputAdornment>}}
                variant="outlined"
                label="כמה טיפ תרצה לשלם?"

            />
            </Grid>
        </Grid>

    );
}

export default SelectTip;