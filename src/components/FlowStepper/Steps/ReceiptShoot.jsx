import React from 'react';
import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import ReceiptLifecycle from '../../../ReceiptLifecycle';
import { Store } from '../../../Store';

function ReceiptShootForm(classes, nextCallback) {
  const { state, dispatch } = React.useContext(Store);

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      // dispatch({ type: ReceiptLifecycle.NO_FILE });
      const img = e.target.files[0];
      dispatch({ type: ReceiptLifecycle.FILE_CHOOSED, photo: img });
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        dispatch({
          type: ReceiptLifecycle.FILE_LOADED,
          src: reader.result,
        });
      });
      reader.readAsDataURL(img);
    }
  };

  // Moved the nextCallback back to the FlowStepper's index.
  // Thats because only there we know if there is a receipt in the image and all these stuff...
  // React.useEffect(() => {
    // if (state.photo && state.src) {
      // nextCallback(); 
  //   }
  // }, [state.photo, state.src]);

  return (
    <div>
      <input
        multiple={false}
        accept="image/*"
        className={classes.input}
        id="raised-button-file"
        type="file"
        onChange={onSelectFile}
      />
      <label htmlFor="raised-button-file">
        <Fab
          color="secondary"
          aria-label="צלם"
          type="file"
          component="span"
          className={classes.button}
        >
          <FontAwesomeIcon icon={faCamera} />
        </Fab>
      </label>
    </div>
  );
}

export default ReceiptShootForm;
