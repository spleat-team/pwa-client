import React from 'react';
import {Store} from "../../Store";
import AlreadyFinishedStatus from "../SplitBill/AlreadyFinishedStatus";

function WaitingPage () {

    const { state, dispatch } = React.useContext(Store);
    const {sharersCount}=state;

    React.useEffect(() => {
        dispatch({type: 'TOGGLE_LOADING'});
     }
    , sharersCount);

    return (

        <div>
          מחכים לשאר החבר'ה
            <AlreadyFinishedStatus sharersCount={sharersCount} message={"סיימו"}/>
        </div>
    );
}

export default WaitingPage;