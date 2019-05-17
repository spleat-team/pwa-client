import React from 'react';
import Button from '@material-ui/core/Button';
import { Store } from '../../../Store';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

var classNames = require('classnames');

function SharersCountForm(classes, backCallback, nextCallback) {
    const { state, dispatch } = React.useContext(Store);

    const sharersCount = state.sharersCount;
    const [sharersCountDirty, setSharersCountDirty ] = React.useState(false);
    const onSharersCountChange = sharersCount => dispatch({type: 'SHARERS_COUNT', count: sharersCount});

    let inputProps = sharersCount > 1 ? {endAdornment: <InputAdornment position="end">סועדים</InputAdornment>}: {};
    let inputState = classNames({
      'classes.margin': true, 
      'classes.textField': true, 
      'classes.textField_success': true
    });

    return (
      <form onSubmit={nextCallback}>
        <TextField
          autoFocus
          style={{marginTop: '15px'}}
          id="outlined-simple-start-adornment"
          className={inputState}
          variant="outlined"
          label="כמות סועדים בארוחה"
          type="number"
          InputProps={inputProps}
          onChange={(event) => {
            setSharersCountDirty(true)
            onSharersCountChange(event.target.value) }
          }
          value={sharersCountDirty ? sharersCount: ''}
          helperText={sharersCountDirty && sharersCount == 0 ? 'אחי.....':'' }
          error={sharersCountDirty && sharersCount == 0}
        />
        { (sharersCountDirty && sharersCount > 0) &&
          (<Button
            type='submit'
            variant="contained"
            color="primary"
            style={{width: '90px', marginTop: '15px'}}
            onClick={ nextCallback }
            className={classes.button}>
            סיימתי!
          </Button>)
        }
      </form>
    );
}

export default SharersCountForm