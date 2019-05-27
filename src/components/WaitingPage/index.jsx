import React from 'react';
import { Store } from '../../Store';
import AlreadyFinishedStatus from '../SplitBill/AlreadyFinishedStatus';

function WaitingPage() {
  const { state, dispatch } = React.useContext(Store);
  const { sharersCount } = state;

  React.useEffect(() => {
    dispatch({ type: 'TOGGLE_LOADING' });
  }, sharersCount);

  return (
    <div>
      <p>{"מחכים לשאר החבר'ה"}</p>
      <AlreadyFinishedStatus sharersCount={sharersCount} message={'סיימו'} />
    </div>
  );
}

export default WaitingPage;
