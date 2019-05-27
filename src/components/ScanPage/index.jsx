import React, { useContext } from 'react';
import './ScanPage.css';
import VerticalStepper from '../FlowStepper/index';
import { Store } from '../../Store';
import useLogger from '../../Utils/useLogger';
import Fab from '@material-ui/core/Fab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Typography, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

const ScanPage = props => {

  const { state } = useContext(Store);
  const [pincodeText, setPincodeText] = React.useState('');

  useLogger('ScanPage');

  return (
    <React.Fragment>
    <div style={{ marginTop: '5px', marginBottom: '5px', display: 'inline-flex', direction: 'rtl' }}>      
      כבר פתחתם קבוצה?
    </div>
      <div style={{ marginTop: '15px', direction: 'rtl' }}>
        <TextField
          id="pincode_text"
          variant="outlined"
          label="מספר קבוצה"
          type="text"
          value={pincodeText}
          onChange={e => setPincodeText(e.target.value)}
        />
        { pincodeText && (
        <Link to={`/itemsList/${pincodeText}`}>
          <Fab
            color="secondary"
            aria-label="צלם"
            type="file"
            component="span"
            style={{ marginRight: '15px' }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Fab>
        </Link>
        )}
      </div>
      <div style={{ marginTop: '15px', display: 'inline-flex', direction: 'rtl' }}>
      אחרת - פתחו קבוצה חדשה :
    </div>
      <VerticalStepper />
    </React.Fragment>
  );
};

export default ScanPage;
