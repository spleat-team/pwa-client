import React from 'react';
import {Store} from "../../Store";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from '@material-ui/icons/Navigation';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faHandPointLeft} from "@fortawesome/free-solid-svg-icons";

function FinishedForm () {
    library.add(faHandPointLeft);

    const { state, dispatch } = React.useContext(Store);
    const finishedCount = state.finishedCount;

    const onSomeoneFinished = finishedCount => dispatch({type: 'FINISHED_SELECT_ITEMS', finishedCount: finishedCount});

    return (

        <div>
            <Fab variant="extended" color="primary" onClick={()=>onSomeoneFinished(finishedCount+1)}>
                <FontAwesomeIcon icon="hand-point-left" style={{marginRight: 5+"px"}}/>
                סיימתי
            </Fab>
        </div>
    );
}

export default FinishedForm;