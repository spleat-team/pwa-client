import React from 'react';
import { Store } from '../../../Store';
import ReactShare from 'react-share-simplified';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import '../../../App.css';
import { Link } from 'react-router-dom';

var classNames = require('classnames');

function PinCode(classes) {
  const { state, dispatch } = React.useContext(Store);

  return (
    <div>
      <ReactShare
        url={`${window.location.href}itemsList/${state.pincode}`}
        whatsappClass="iconStyle"
        whatsapp={true}
        iconSize={48}
        addClass="shareInline"
      />
      <Link to={`/itemsList/${state.pincode}`}>
        <Button variant="contained" color="primary">
          יאללה לקבלה
        </Button>
      </Link>
      <Button
        variant="outlined"
        onClick={backCallback}
        style={{ width: '20px' }}
        className={classes.backButton}
      >
        חזרה
      </Button>
    </div>
  );
}

export default PinCode;
