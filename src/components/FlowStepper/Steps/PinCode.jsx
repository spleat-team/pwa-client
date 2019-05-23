import React from 'react';
import { Store } from '../../../Store';
import ReactShare from 'react-share-simplified';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import '../../../App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

var classNames = require('classnames');

function PinCode(classes) {
  const { state, dispatch } = React.useContext(Store);

  return (
    <div>
      <Typography style={{ marginBottom: '5px' }}>רוצה לשתף?</Typography>
      <ReactShare
        url={`${window.location.href}itemsList/${state.pincode}`}
        whatsapp={true}
        whatsappClass="iconStyle"
        iconSize={48}
        addClass="shareInline"
      />
      <Link to={`/itemsList/${state.pincode}`}>
        <Button variant="contained" color="primary">
          יאללה לקבלה
        </Button>
      </Link>
    </div>
  );
}

export default PinCode;
