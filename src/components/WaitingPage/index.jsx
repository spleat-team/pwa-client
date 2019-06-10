import React from 'react';
import { Store } from '../../Store';
import AlreadyFinishedStatus from '../SplitBill/AlreadyFinishedStatus';
import CircularDeterminate from "../LoadingCircular";
import GroupNumber from "../GroupNumber";
import Grid from "@material-ui/core/Grid";

function WaitingPage() {
  const { state } = React.useContext(Store);
  const { sharersCount } = state;

  return (
    <div>
        <GroupNumber/>
        <CircularDeterminate />
        <p>{"מחכים לשאר החבר'ה"}</p>
        <AlreadyFinishedStatus sharersCount={sharersCount} message={'סיימו'} />
    </div>
  );
}

export default WaitingPage;
