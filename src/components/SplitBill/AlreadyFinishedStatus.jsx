import React from 'react';
import {Store} from "../../Store";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';

function AlreadyFinishedStatus () {

    const { state, dispatch } = React.useContext(Store);
    const sharersCount = state.sharersCount;
    const finishedCount = state.finishedCount;

   // const onSomeoneFinished = finishedCount => dispatch({type: 'FINISHED_SELECT_ITEMS', finishedCount: finishedCount});

    return (

        <div>
            <h3> { finishedCount } / {sharersCount}</h3>
            <h4>מחכים לך</h4>
        </div>

    );
}

export default AlreadyFinishedStatus;