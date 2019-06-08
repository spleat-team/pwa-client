import React from 'react';
import { Store } from '../../Store';
import 'typeface-luckiest-guy';

function GroupNumber() {
    const { state } = React.useContext(Store);
    const { pincode } = state;

    console.log(pincode)

    return (
        <div dir={"rtl"}>
            <h6 style={{marginBottom: 0 + "px"}}>מספר קבוצה:</h6>
            <p style={{fontFamily: "Luckiest Guy", fontSize:"25px", marginTop: 0 + "px"}}>{pincode}</p>
        </div>
    );
}

export default GroupNumber;