import React from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {faShekelSign}  from '@fortawesome/free-solid-svg-icons'


library.add(faShekelSign);


export default class SelectingItem extends React.Component {
    state = {
        checked: false,
        currItem: this.props.item
    };

    render() {
        return (

            <div>
                <ListItem dir={"rtl"}>
                    <Checkbox
                        // key={currItem.name}
                        key={"item"}
                        //onChange={function() {!this.state.checked}}
                        />
                    <ListItemText>{this.props.name}</ListItemText>
                    <ListItemText>12

                        <ListItemIcon>
                            <FontAwesomeIcon icon="shekel-sign"/>
                        </ListItemIcon>
                    </ListItemText>
                </ListItem>
            </div>

        );
    }
}