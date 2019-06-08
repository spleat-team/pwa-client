import React from 'react';
import { Store } from '../../Store';
import TextField from "@material-ui/core/TextField";

function AlreadyFinishedStatus(props) {
  const { state } = React.useContext(Store);
  const { finishedCount, sharersCount } = state;

  return (
    <div style={{ direction: 'rtl', fontWeight: 'bold'}}>
      <p style={{fontFamily: "Luckiest Guy", fontSize: 20+'px', marginBottom: '0px'}}>{finishedCount + '/' + sharersCount + ' '}</p>
      <p style={{marginTop: '0px'}}>{props.message}</p>
    </div>
  );
}

export default AlreadyFinishedStatus;
