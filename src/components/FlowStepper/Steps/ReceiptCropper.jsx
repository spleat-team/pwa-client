import React from 'react';
import Button from '@material-ui/core/Button';
import { Store } from '../../../Store';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ReceiptCropper(classes, backCallback, nextCallback, message) {
  const { state, dispatch } = React.useContext(Store);
  const { loading, crop, src, errorMessage, cropperMessage } = state;

  const onCropChange = crop => {
    console.log('cropped changed..... : ', crop);
    dispatch({ type: 'NEW_CROP', payload: crop });
  };

  return (
    <form onSubmit={nextCallback}>
      <p style={{ direction: 'rtl', marginLeft: '10%', marginRight: '10%' }}>
        {cropperMessage}
      </p>
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onComplete={onCropChange}
          onChange={onCropChange}
        />
      )}
      <Button
        variant="outlined"
        onClick={backCallback}
        style={{ width: '20px' }}
        className={classes.backButton}
      >
        חזרה
      </Button>
      <Button
        type="submit"
        variant="contained"
        style={{ width: '60px', marginRight: '10px' }}
        color="primary"
        className={classes.button}
        disabled={loading || errorMessage != ''}
      >
        הבא
      </Button>
    </form>
  );
}

export default ReceiptCropper;
