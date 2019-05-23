import React from 'react';
import Button from '@material-ui/core/Button';
import { Store } from '../../../Store';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import receiptService from '../../../Services/receipt.service';

var classNames = require('classnames');

function SharersCountForm(classes, backCallback, nextCallback) {
  const { state, dispatch } = React.useContext(Store);

  const sharersCount = state.sharersCount;
  const [sharersCountDirty, setSharersCountDirty] = React.useState(false);
  const onSharersCountChange = sharersCount =>
    dispatch({ type: 'SHARERS_COUNT', sharersCount: sharersCount });

  // const [sharersCount, setSharersCount] = React.useState(0);
  // const [sharersCountDirty, setSharersCountDirty] = React.useState(false);

  let inputProps =
    sharersCount > 1
      ? { endAdornment: <InputAdornment position="end">סועדים</InputAdornment> }
      : {};
  let inputState = classNames({
    'classes.margin': true,
    'classes.textField': true,
    'classes.textField_success': true,
  });

  const generatePinCode = () => {
    const chars = '0123456789abcdefghiklmnopqrstuvwxyz';
    const string_length = 4;
    let randomstring = '';
    for (var i = 0; i < string_length; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  };

  const onFinished = e => {
    // Save on store
    dispatch({ type: 'SET_NUM_OF_PEOPLE', payload: sharersCount });
    // Generate pin code
    const pincode = generatePinCode();
    dispatch({ type: 'SET_PINCODE', payload: pincode });

    const items = state.receiptItems.map((item, index) => {
      return {
        _id: index,
        image: item.dish,
        price: item.price,
        users: [],
      };
    });

    // Save to firebase
    receiptService
      .createReceipt(
        { pincode, items, numberOfPeople: sharersCount },
        {
          email: state.user.email,
          name: state.user.displayName,
          isFinished: false,
        }
      )
      .then(() => {
        nextCallback();
      })
      .catch(err => {
        // Add error message
      });
  };

  return (
    <form>
      <TextField
        autoFocus
        style={{ marginTop: '15px' }}
        id="outlined-simple-start-adornment"
        className={inputState}
        variant="outlined"
        label="כמות סועדים בארוחה"
        type="number"
        InputProps={inputProps}
        onChange={event => {
          setSharersCountDirty(true);
          onSharersCountChange(event.target.value);
        }}
        value={sharersCountDirty ? sharersCount : ''}
        helperText={sharersCountDirty && sharersCount == 0 ? 'אחי.....' : ''}
        error={sharersCountDirty && sharersCount == 0}
      />
      {sharersCountDirty && sharersCount > 0 && (
        <Button
          variant="contained"
          color="primary"
          style={{ width: '90px', marginTop: '15px' }}
          onClick={onFinished}
          className={classes.button}
        >
          סיימתי!
        </Button>
      )}
    </form>
  );
}

export default SharersCountForm;
