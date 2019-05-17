import React from 'react';
import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import ReceiptLifecycle from '../../../ReceiptLifecycle';
import { Store } from '../../../Store';

function ReceiptShootForm(classes, nextCallback) {
    const {state, dispatch} = React.useContext(Store);

    const onFormSubmit = e => {
        // TODO : Navigate to sanduri's page with the router
        console.log("onFormSubmit", e);
        e.preventDefault()
    }

    const onSelectFile = (e) => {
        nextCallback();
    
        console.log("file loaded......", e.target);
        if (e.target.files && e.target.files.length > 0) {
        dispatch({type: ReceiptLifecycle.NO_FILE});
        const img = e.target.files[0];
        dispatch({type: ReceiptLifecycle.FILE_CHOOSED, payload: img})
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            dispatch({
                type: ReceiptLifecycle.FILE_LOADED,
                payload: reader.result
            });
        });
        reader.readAsDataURL(img);
        }
    }

    return (
      <form onSubmit={onFormSubmit}>
          <input 
            accept="image/*" 
            className={classes.input} 
            id="raised-button-file" 
            multiple 
            type="file"
            onChange={onSelectFile}
          /> 
          <label htmlFor="raised-button-file"> 
            <Fab color="primary" aria-label="צלם" type="file" component="span" className={classes.button}>
              <FontAwesomeIcon icon={faCamera} />
            </Fab> 
          </label> 
      </form>
    );
}

export default ReceiptShootForm