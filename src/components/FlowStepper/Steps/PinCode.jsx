import React from 'react';
import { Store } from '../../../Store';
import ReactShare from 'react-share-simplified';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import '../../../App.css';

var classNames = require('classnames');

function PinCode(classes) {
  const { state, dispatch } = React.useContext(Store);

  return (
    <div>
      <Typography style={{ marginBottom: '5px' }}>רוצה לשתף?</Typography>
      <ReactShare
        url="Spleat pin code"
        title="123"
        whatsapp={true}
        whatsappClass="iconStyle"
        facebook={true}
        facebookClass="iconStyle"
        iconSize={48}
        addClass="shareInline"
        googlePlus={true}
        googlePlusClass="iconStyle"
        twitter={true}
        twitterClass="iconStyle"
      />
      {/* TODO: Redirect to receipt page with pin code */}
      <Button variant="contained" color="primary">
        יאללה לקבלה
      </Button>
    </div>
  );
}

export default PinCode;
