import React from 'react';
import Button from '@material-ui/core/Button';
import { Store } from '../../../Store';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import receiptService from '../../../Services/receipt.service';
import ReceiptLifecycle from '../../../ReceiptLifecycle';

var classNames = require('classnames');

function SharersCountForm(classes, backCallback, nextCallback) {
  const { state, dispatch } = React.useContext(Store);
  const [isDone, setIsDone] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [sharersCountDirty, setSharersCountDirty] = React.useState(false);
  const onSharersCountChange = newSharersCount =>
    dispatch({ type: 'SHARERS_COUNT', sharersCount: newSharersCount });

  // const [sharersCount, setSharersCount] = React.useState(0);
  // const [sharersCountDirty, setSharersCountDirty] = React.useState(false);

  // TODO : This causes problem because sanduri needs the sharersCount and it may be still 0 here when being sent.
  // React.useEffect(() => {
  //   if (state.receiptItems && state.receiptItems.length) {
  //     const items = state.receiptItems.map((item, index) => {
  //       return {
  //         _id: index,
  //         image: item.dish,
  //         price: item.price,
  //         users: [],
  //       };
  //     });

  //     // Generate pin code
  //     const pincode = generatePinCode();
  //     dispatch({ type: 'SET_PINCODE', payload: pincode });

  //     // Save to firebase
  //     receiptService
  //       .createReceipt(
  //         { pincode, items, numberOfPeople: state.sharersCount },
  //         {
  //           email: state.user.email,
  //           name: state.user.displayName,
  //           isFinished: false,
  //         }
  //       )
  //       .then(data => {
  //         setIsReady(true);
  //       })
  //       .catch(err => {
  //         console.log('Error while creating the receipt in the server..', err);
  //       });
  //   }
  // }, [state.receiptItems]);

  const createReceipt = () => {
    const { receiptItems, sharersCount, user } = state;

    if (receiptItems && receiptItems.length && sharersCount > 0) {
      const items = receiptItems.map((item, index) => {
        return {
          _id: index,
          image: item.dish,
          price: item.price,
          users: [],
        };
      });

      // Generate pin code
      const pincode = generatePinCode();
      dispatch({ type: 'SET_PINCODE', payload: pincode });

      // Save to firebase
      receiptService
        .createReceipt(
          { pincode, items, numberOfPeople: sharersCount },
          {
            email: user.email,
            name: user.displayName,
            isFinished: false,
          }
        )
        .then(data => {
          console.log('created the receipt with data : ', data);
          dispatch({ type: 'STOP_LOADING' });
          nextCallback();
        })
        .catch(err => {
          console.log('Error while creating the receipt in the server..', err);
        });
    }
  };

  let inputProps =
    state.sharersCount > 1
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
    const sharersDispatch = {
      type: 'SET_NUM_OF_PEOPLE',
      payload: state.sharersCount,
    };
    const loadingDispatch = {
      type: 'SET_LOADING_MESSAGE',
      message: 'רק עוד רגע..',
    };
    [sharersDispatch, loadingDispatch].forEach(curr => {
      console.log('dispatching curr : ', curr);
      dispatch(curr);
    });
  };

  React.useEffect(() => {
    if (state.sharersCount > 0) {
      createReceipt();
    }
  }, [state.sharersCount]);

  return (
    <div>
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
          onSharersCountChange(parseInt(event.target.value));
        }}
        value={sharersCountDirty ? state.sharersCount : ''}
        helperText={
          sharersCountDirty && state.sharersCount === 0 ? 'אחי.....' : ''
        }
        error={sharersCountDirty && state.sharersCount === 0}
      />
      <div>
        <Button
          variant="outlined"
          onClick={backCallback}
          style={{ width: '20px', marginTop: '10px' }}
          className={classes.backButton}
        >
          חזרה
        </Button>
        {
          <Button
            disabled={
              !sharersCountDirty ||
              state.sharersCount < 1 ||
              state.errorMessage != ''
            }
            color="primary"
            variant="contained"
            style={{ width: '90px', marginRight: '15px', marginTop: '10px' }}
            type="submit"
            className={classes.button}
            onClick={onFinished}
          >
            סיימתי!
          </Button>
        }
      </div>
    </div>
  );
}

export default SharersCountForm;
