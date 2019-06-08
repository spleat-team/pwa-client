import React from 'react';
import { Store } from '../../Store';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';

function SelectTip() {
  const { state, dispatch } = React.useContext(Store);
  const { tip } = state;
  const onTipSelected = tip => dispatch({ type: 'TIP_SELECTED', tip: tip });

  return (
    <Grid container dir={'rtl'} justify={"center"}>
      <Grid item xs={9}>
        <TextField
          autoFocus
          id="tip"
          value={tip}
          //onChange={(event) => setTip(event.target.value)}
          onChange={event => onTipSelected(event.target.value)}
          type="number"
          min={0}
          InputProps={{
            min: 0,
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
          }}
          variant="outlined"
          label="כמה טיפ תרצה לשלם?"
        />
      </Grid>
    </Grid>
  );
}

export default SelectTip;
