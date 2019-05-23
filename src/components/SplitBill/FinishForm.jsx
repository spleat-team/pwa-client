import React from 'react';
import {Store} from "../../Store";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from '@material-ui/icons/Navigation';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faHandPointLeft} from "@fortawesome/free-solid-svg-icons";
import CalculateService from '../../Services/calculate.service';

function FinishedForm (props) {
    library.add(faHandPointLeft);

    const { state, dispatch } = React.useContext(Store);
    const { finishedCount,tip } = state;

    const onSomeoneFinished = finishedCount => {
        dispatch({type: 'FINISHED_SELECT_ITEMS', finishedCount: finishedCount});
        //"nave.coheng@gmail.com"
        CalculateService(props).finishSelectItems(props.props.match.params.groupId , state.user.email, state.checkedItems, tip);
        props.props.history.push('/waiting');
    }

    return (

        <div>
            <Fab variant="extended" color="primary" onClick={()=>onSomeoneFinished(finishedCount+1)}>
                <FontAwesomeIcon icon="hand-point-left" style={{marginRight: 5+"px"}}/>
                סיימתי
                {/*state.user.email*/}

            </Fab>
        </div>
    );
}

export default FinishedForm;