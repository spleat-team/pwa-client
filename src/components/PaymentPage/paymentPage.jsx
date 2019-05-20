import React from 'react';
import {Store} from "../../Store";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faShekelSign} from "@fortawesome/free-solid-svg-icons";

function PaymentPage () {
    library.add(faShekelSign);

    const { state, dispatch } = React.useContext(Store);
    const { paymentPerUser } = state;

    const currentUserId = state.user.email;
        //"nave.coheng@gmail.com";
        //

    //const [tip, setTip] = React.useState(10);

    var currentUserObject = paymentPerUser.find((user) => {
        return user.email == currentUserId
    });
    var otherUser = paymentPerUser.slice();

    otherUser.splice(currentUserObject, 1);
    return (

        <div>
            <h1>החשבון שלך </h1>
            <h1 dir={"rtl"}>

                {paymentPerUser.find((currItem) => {
                    return (currItem.email == currentUserId)
                }).sum}
                <ListItemIcon style={{marginRight: 7 + 'px'}}>
                    <FontAwesomeIcon icon="shekel-sign" />
                </ListItemIcon>
            </h1>

                {otherUser.map((curr) => {
                    return  <h3 dir={"rtl"} key={curr._id}>
                        {curr.price + "-" + curr._id}
                        <ListItemIcon style={{marginRight: 7 + 'px'}}>
                            <FontAwesomeIcon icon="shekel-sign" />
                        </ListItemIcon>
                    </h3>
                })}
        </div>
    );
}

export default PaymentPage;