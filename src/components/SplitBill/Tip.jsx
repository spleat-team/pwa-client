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
        {/*<div dir={"rtl"}>*/}
            <Grid item xs={5}>
            כמה טיפ תרצה לשלם?
            </Grid>
            <Grid item xs={2} dir={"ltr"}>
            <Input
                id="tip"
                label="טיפ"
                value={tip}
                onChange={(event) => setTip(event.target.value)}
                type="number"
                min={0}
                inputProps={{min: 0}}
                //style={{textAlign: 'right'}}
               // style={{width: 40 + 'px', marginRight: 10 + 'px'}}
                endAdornment={<InputAdornment position="start">%</InputAdornment>}
            />
            </Grid>
        {/*</div>*/}
        </Grid>

    );
}

export default SelectTip;