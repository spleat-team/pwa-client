import React from 'react';
import {Store} from "../../Store";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from '@material-ui/icons/Navigation';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faHandPointLeft} from "@fortawesome/free-solid-svg-icons";
import AlreadyFinishedStatus from "../SplitBill/AlreadyFinishedStatus";

function WaitingPage (props) {

    const { state, dispatch } = React.useContext(Store);
    const {sharersCount}=state;
  //  const { finishedCount,tip } = state;
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