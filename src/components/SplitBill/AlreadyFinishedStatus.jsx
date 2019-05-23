import React from 'react';
import {Store} from "../../Store";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {Firebase} from "../../Firebase/firebase";
import {Promise as reject} from "q";
import Grid from "@material-ui/core/Grid";

function AlreadyFinishedStatus (props) {

    const { state, dispatch } = React.useContext(Store);
    const {finishedCount,sharersCount} = state;

    const collectionName = 'receipts';
    const firebase = Firebase.initialize();
    var db = firebase.app.firestore();

   // const onSomeoneFinished = finishedCount => dispatch({type: 'FINISHED_SELECT_ITEMS', finishedCount: finishedCount});

    return (

        <div>
            <h3> { finishedCount } / {sharersCount}</h3>
            <h4>{props.message}</h4>
        </div>

    );
}

export default AlreadyFinishedStatus;