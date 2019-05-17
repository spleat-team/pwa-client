import React from 'react';
import {Store} from "../Store";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faShekelSign} from "@fortawesome/free-solid-svg-icons";

function PaymentPage () {
    library.add(faShekelSign);

    const { dispatch } = React.useContext(Store);
    const props = {
        items:
            [{_id: '1111', price: 11},
                {_id: '2222', price: 15},
                {_id: '3333', price: 22},
                {_id: '4444', price: 17}]
        //state.paymentDetails
    };
    //const [tip, setTip ] = React.useState(10);

    var currentUserID = '1111';// get the id from firebase
    var otherUser = props.items.find((currItem) => {
            return (currItem._id != currentUserID)
        });
    return (

        <div>
            <h1>החשבון שלך </h1>
            <h1 dir={"rtl"}>

                {props.items.find((currItem) => {
                    return (currItem._id == currentUserID)
                }).price}
                <ListItemIcon style={{marginRight: 7 + 'px'}}>
                    <FontAwesomeIcon icon="shekel-sign" />
                </ListItemIcon>
            </h1>
            <h3 dir={"rtl"}>
                {otherUser._id} - {otherUser.price}
                <ListItemIcon style={{marginRight: 7 + 'px'}}>
                    <FontAwesomeIcon icon="shekel-sign" />
                </ListItemIcon>

            </h3>
        </div>
    );
}

export default PaymentPage;