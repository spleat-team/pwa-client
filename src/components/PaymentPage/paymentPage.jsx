import React from 'react';
import {Store} from "../../Store";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faShekelSign} from "@fortawesome/free-solid-svg-icons";
import Pay from "./pay";

function PaymentPage () {
    library.add(faShekelSign);

    const { state } = React.useContext(Store);
    const { paymentPerUser } = state;

    var currentUserId =
         state.user.email;


    var userIndex = paymentPerUser.findIndex((user)=>{
        return user.email==currentUserId
    });

    var currentUserObject = paymentPerUser[userIndex];
    var otherUsers = paymentPerUser.slice();

    otherUsers.splice(userIndex, 1);
    return (
        <div>
            <h1>החשבון שלך </h1>
            <h1 dir={"rtl"}>
                {currentUserObject.sum.toFixed(2)}
                <ListItemIcon style={{marginRight: 7 + 'px'}}>
                    <FontAwesomeIcon icon="shekel-sign" />
                </ListItemIcon>
            </h1>
            <h5>(כולל טיפ)</h5>
            <div style={{marginTop: 20 + 'px', marginBottom: 40 + 'px'}}>
                {otherUsers.map((curr) => {
                    return  <h3 key={curr.email}>
                        {curr.name + " - " + curr.sum.toFixed(2)}
                        <ListItemIcon style={{marginRight: 7 + 'px'}}>
                            <FontAwesomeIcon icon="shekel-sign" />
                        </ListItemIcon>
                    </h3>
                })}
            </div>
                <Pay/>
        </div>
    );
}

export default PaymentPage;