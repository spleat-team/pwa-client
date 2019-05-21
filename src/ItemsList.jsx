import React from 'react';
import SelectingItem from './components/SplitBill/SelectingItem';
import SelectTip from './components/SplitBill/Tip';
import { Store } from './Store';
import AlreadyFinishedStatus from './components/SplitBill/AlreadyFinishedStatus';
import FinishedForm from './components/SplitBill/FinishForm';
import Grid from '@material-ui/core/Grid';
import LoginPage from './components/LoginPage';
import { Route } from 'react-router-dom';
import CalculateService from "./Services/calculate.service.js";
import {Firebase} from "./Firebase/firebase";
import {Promise as reject} from "q";
import {SyncLoader} from "react-spinners";

function ItemsList (props){
    const { state, dispatch } = React.useContext(Store);
    const {checkedItems} = state;
    //const [isLoaded, setIsLoaded ] = React.useState(false);
    const [items, setItems] = React.useState([]);
    //const [sharersCount, setSharersCount] = React.useState(0);

    var handleToggle = {};
    var hasGroupNumber = true;

    const firebase = Firebase.initialize();
    var db = firebase.app.firestore();
    const collectionName = 'receipts';

    const isCurrentUserAlreadyFinished = (users, userId) => {
        return CalculateService(props).getUserDetails(users, userId).isFinished;
    }

    // const [checkedItems, setItemsChecked] = React.useState([]);
    const onDocumentUpdated = (groupId) => {

        db.collection(collectionName).doc(groupId)
            .onSnapshot(function (doc) {
                if (!doc.exists)
                    throw "The receipt doesn't exist";

                // Set amount of users who finished selected items
                dispatch({
                    type: "FINISHED_SELECT_ITEMS",
                    finishedCount: CalculateService(props).getUserFinishedAmount(doc.data().users)
                });

                // If all the users are done
                if (CalculateService(props).areAllUsersFinished(doc.data().users, doc.data().numberOfPeople)) {
                    var paymentPerUser = CalculateService(props).calculateBill(doc.data());
                    console.log(paymentPerUser);

                    // set the payment per user
                    dispatch({
                        type: "FINISHED_CALC",
                        paymentPerUser: paymentPerUser
                    });

                    dispatch({type: 'TOGGLE_LOADING'});

                    // move to payment page
                    props.history.push('/payment');
                }
            });
    };

    React.useEffect(() => {

        dispatch({
            type: 'TOGGLE_LOADING',
        });

        // When the user get in at the first time - set the variables
        db.collection(collectionName).doc(props.match.params.groupId)
            .get()
            .then((doc)=>{

                setItems(doc.data().items);
                dispatch({type: 'SHARERS_COUNT', sharersCount: doc.data().numberOfPeople});

                if (isCurrentUserAlreadyFinished(doc.data().users, state.user.email)) {
                    props.history.push('/waiting');
                }

                dispatch({type: 'TOGGLE_LOADING'});
            })
            .catch(err => {
                console.error('firebase:error saving receipt', err);
                reject(err);
            });

        onDocumentUpdated(props.match.params.groupId);
    }, [props.match.params.groupId]);

    if (!props.match.params.groupId) {
        hasGroupNumber = false;

        // todo: redirect to insert pin code page
        console.log("redirect");
        props.history.push(`/login`)
    }
    // Continue
    else {
        handleToggle = value => {
            //const { checked } = checkedItems;
            const currentIndex = checkedItems.indexOf(value);
            const newChecked = [...checkedItems];

            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }
//            setItemsChecked(newChecked);
            dispatch({type: 'CHECKED_ITEMS', checkedItems: newChecked});
        };
    }

// In this component you will have the items list that come back from the ML server, 
// because i take th em in the main window to validate the receipt (for example - if there are 0 items its an error)

// This is how to take items from the state
// state.WhatEverYouWant

  // This is how to do setState using the reducers inside Store.js
  // dispatch({
  //     type: "Reducer's-Type, according to the cases in the main reducer",
  //     payload: the data to transfer into the reducer
  // });

  return (
      <div>
          {!hasGroupNumber ?
              // TODO: Change url to pin code page
              <Route path="/login" component={LoginPage}/>
              :
              (state.loading ?
                  <Grid> טוען את פרטי הקבלה</Grid> :
              <Grid>
                  בחר את הפריטים שהזמנת
                  {items.map(currItem => (
                      <SelectingItem key={currItem._id.toString()}
                                     item={currItem}
                                     handle={(value) => {
                                         handleToggle(value)
                                     }}
                                     checked={checkedItems.indexOf(currItem._id.toString())}/>
                  ))}
                  <div>
                      <SelectTip/>
                      <AlreadyFinishedStatus message={"מחכים לך"}/>
                  </div>
                  <FinishedForm props={props}/>
              </Grid>)
          }
       </div>
  );
}

export default ItemsList;