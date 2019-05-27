import React from 'react';
import { Store } from '../../Store';

function AlreadyFinishedStatus(props) {
  const { state } = React.useContext(Store);
  const { finishedCount, sharersCount } = state;

  // const onSomeoneFinished = finishedCount => dispatch({type: 'FINISHED_SELECT_ITEMS', finishedCount: finishedCount});

  return (
    <div>
      <h3>
        {' '}
        {finishedCount} / {sharersCount}
      </h3>
      <h4>{props.message}</h4>
    </div>
  );
}

export default AlreadyFinishedStatus;
