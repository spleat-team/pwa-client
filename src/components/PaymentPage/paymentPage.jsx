import React from 'react';
import {Store} from "../../Store";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faShekelSign, faQrcode} from "@fortawesome/free-solid-svg-icons";
import Pay from "./pay";
import GroupNumber from "../GroupNumber";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";

function PaymentPage (props) {
    library.add(faShekelSign);
    library.add(faQrcode);

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
            <GroupNumber/>
            <h1>החשבון שלך </h1>
            <h1 dir={"rtl"}>
                {currentUserObject.sum.toFixed(2)}
                <ListItemIcon style={{marginRight: '3%'}}>
                    <FontAwesomeIcon icon="shekel-sign" />
                </ListItemIcon>
            </h1>
            <h5>(כולל טיפ)</h5>
            <div style={{marginTop: 20 + 'px', marginBottom: 40 + 'px'}}>
                {otherUsers.map((curr) => {
                    return  <h3 key={curr.email}>
                        {curr.name + " - " + curr.sum.toFixed(2)}
                        <ListItemIcon style={{marginRight: '3%'}}>
                            <FontAwesomeIcon icon="shekel-sign" />
                        </ListItemIcon>
                    </h3>
                })}
            </div>

            <Grid container justify={"center"} alignItems={"center"}>
                <Grid item xs={6}>
                    <Fab variant="extended" color="primary" onClick={()=> props.history.push(`/login`)}>
                        <FontAwesomeIcon icon="qrcode" style={{marginRight: 5+"px"}}/>
                        קבלה חדשה
                    </Fab>
                </Grid>
                <Grid item xs={4}>
                    <Pay/>
                </Grid>
            </Grid>
        </div>
    );
}

export default PaymentPage;