import React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {faShekelSign}  from '@fortawesome/free-solid-svg-icons'
import {Store} from "../../Store";
import {calculateService} from "../../Services/receipt.service";

function SelectingItem (props) {

    library.add(faShekelSign);
    const { dispatch } = React.useContext(Store);
    const [checked, setChecked ] = React.useState(false);

    const Dish = ({ data }) => <img style={{height: 40+ 'px'}} src={`data:image/jpeg;base64,${data}`} />
        return (

            <div>
                <ListItem dir={"rtl"}>
                    <Checkbox
                        id={props.item._id}
                        color="primary"
                        onClick={()=>props.handle(props.item._id)}
                        checked={props.checked !== -1}
                    />
                    <ListItemAvatar>
                        <Dish data={props.item.dish} />
                    </ListItemAvatar>
                    <ListItemText>{props.item.price}
                        <ListItemIcon style={{marginRight: 7 + 'px'}}>
                            <FontAwesomeIcon icon="shekel-sign" />
                        </ListItemIcon>
                    </ListItemText>
                </ListItem>
            </div>

        );
}

export default SelectingItem;