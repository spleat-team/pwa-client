import React from 'react';
import {Store} from "../../Store";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faShekelSign} from "@fortawesome/free-solid-svg-icons";
import Pay from "./pay";

function PaymentPage () {
    library.add(faShekelSign);

    const { state, dispatch } = React.useContext(Store);
    const { paymentPerUser } = state;

    var currentUserId =
        //todo: state.user.email;
        "nave.coheng@gmail.com";
        //

    //const [tip, setTip] = React.useState(10);

    // var currentUserObject = paymentPerUser.find((user) => {
    //     return user.email == currentUserId
    // });
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
                {currentUserObject.sum}
                <ListItemIcon style={{marginRight: 7 + 'px'}}>
                    <FontAwesomeIcon icon="shekel-sign" />
                </ListItemIcon>
            </h1>

                {otherUsers.map((curr) => {
                    return  <h3 key={curr.email}>
                        {curr.name + " - " + curr.sum}
                        <ListItemIcon style={{marginRight: 7 + 'px'}}>
                            <FontAwesomeIcon icon="shekel-sign" />
                        </ListItemIcon>
                    </h3>
                })}
                <Pay/>
        </div>
    );
}

export default PaymentPage;