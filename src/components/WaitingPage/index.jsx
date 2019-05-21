import React from 'react';
import {Store} from "../../Store";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from '@material-ui/icons/Navigation';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faHandPointLeft} from "@fortawesome/free-solid-svg-icons";

function WaitingPage (props) {

    const { state, dispatch } = React.useContext(Store);
  //  const { finishedCount,tip } = state;


    return (

        <div>
            מסך המתנה יפה יפה
        </div>
    );
}

export default WaitingPage;