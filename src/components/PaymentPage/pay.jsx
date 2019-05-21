import React from 'react';
import {Store} from "../../Store";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {faHandHoldingUsd, faCoins} from "@fortawesome/free-solid-svg-icons";
import Fab from "@material-ui/core/Fab";


function Pay () {
    library.add(faCoins);

    const { state, dispatch } = React.useContext(Store);
    const { paymentPerUser } = state;
    const [openDialog, setOpen] = React.useState(false);

    return (

        <div>
            <Fab variant="extended" color="primary" onClick={()=>setOpen(true)}>
                {/*<FontAwesomeIcon icon="hand-point-left" />*/}
                <FontAwesomeIcon icon="coins" style={{marginRight: 5+"px"}}/>
                תשלום
            </Fab>
            <Dialog
                open={openDialog}
                onClose={()=>setOpen(false)}
                aria-labelledby="payment-title"
                aria-describedby="payment-description"
                style={{textAlign: 'center', direction: 'rtl'}}>
                <DialogTitle id="payment-title" >{"רוצה לשלם?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="payment-description">
                       המסך הזה בתהליך בנייה...
                        בקרוב תוכל לשלם דרך האפליקציה
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{justifyContent: 'center'}}>
                    <Button onClick={()=>setOpen(false)} color="primary" autoFocus>
                        סגור
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Pay;