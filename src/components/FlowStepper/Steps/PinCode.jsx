import React from 'react';
import { Store } from '../../../Store';
import ReactShare from 'react-share-simplified';
import Button from '@material-ui/core/Button';
import '../../../App.css';
import { Link } from 'react-router-dom';

function PinCode(classes, backCallback) {
  const { state } = React.useContext(Store);

  return (
    <div>
      <p style={{ direction: 'rtl' }}>מזהה הקבוצה : {state.pincode}</p>
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
