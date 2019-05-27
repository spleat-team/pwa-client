import React from 'react';
import { Store } from '../../Store';

function AlreadyFinishedStatus(props) {
  const { state } = React.useContext(Store);
  const { finishedCount, sharersCount } = state;

  return (
    <div style={{ direction: 'rtl', fontWeight: 'bold' }}>
      <span>{finishedCount + '/' + sharersCount + ' '}</span>
      <span>{props.message}</span>
    </div>
  );
}

export default AlreadyFinishedStatus;
