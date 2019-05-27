import React from 'react';
import Button from '@material-ui/core/Button';
import { Store } from '../../../Store';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ReceiptCropper(classes, backCallback, nextCallback, message) {
  const { state, dispatch } = React.useContext(Store);
  const { loading, crop, src, errorMessage } = state;

  const onCropChange = crop => dispatch({ type: 'NEW_CROP', payload: crop });

  return (
    <div>
      <p style={{ direction: 'rtl', marginLeft: '10%', marginRight: '10%' }}>
        {
          //errorMessage ? errorMessage : preMessage ? preMessage : postMessage
        }
      </p>
      {src && (
        <ReactCrop
          src={src}
          crop={crop}
          onComplete={onCropChange}
          onChange={onCropChange}
        />
      )}
      <div>
        <Button
          variant="outlined"
          onClick={backCallback}
          style={{ width: '20px' }}
          className={classes.backButton}
        >
          חזרה
        </Button>
        <Button
          variant="contained"
          onClick={nextCallback}
          style={{ width: '60px', marginRight: '10px' }}
          color="primary"
          className={classes.button}
          disabled={loading || errorMessage != ''}
        >
          הבא
        </Button>
      </div>
    </div>
  );
}

export default ReceiptCropper;
