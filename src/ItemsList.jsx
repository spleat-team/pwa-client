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
    //
    // const isCurrentUserAlreadyFinished = (users, userId) => {
    //     return CalculateService(props).getUserDetails(users, userId).isFinished;
    // }

    // const isUserExistInReceipt = (users, userId) => {
    //     return CalculateService(props).getUserDetails(users, userId);
    // }

    const resetUserSelection = (userId, allItem) => {

        allItem.forEach((item) => {
            var index = CalculateService(props).findIndex(item.users, userId);
            if (index != -1)
                item.users.splice(index, 1)
        })

        return allItem;
    }

    // Add the user to users array and reset his selections
    // If all users are finished - move to payment page
    const addUserIfDoesntExist = (data) => {

        var usersInReceipt = data.users;

        var userToInsert = {
            email: state.user.email,
            name: state.user.displayName,
            isFinished: false,
            tip: 10
        };

        var updateItems = data.items;

        // If the user doesn't exist in users array in receipt add it
        // This is the first time the user enter to this page
        if (usersInReceipt != undefined &&
            CalculateService(props).getUserDetails(usersInReceipt, state.user.email) == undefined) {

            // If the user exist or not, we need to reset his details
            usersInReceipt.push(userToInsert);
        }
        // The user is exist
        // The user came back from waiting page (he finished to select items, and than regret)
        else {
            var index = CalculateService(props).findIndex(usersInReceipt, state.user.email, 'email');

            // Reset the user details
            usersInReceipt[index] = userToInsert;

            // Reset the user selection items
            updateItems = resetUserSelection(state.user.email, data.items)
        }

        // Update the user in receipt
        db.collection(collectionName).doc(props.match.params.groupId)
            .update({users: usersInReceipt, items: updateItems})
            .then(function() {
                console.log("Users successfully updated!");

                onDocumentUpdated(props.match.params.groupId);
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

         return {usersInReceipt};
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

    // When page is created - the user can get in to this page in two cases:
    // 1. The user got a link with a pincode
    // 2. The user came back from waiting page( he finished to select items, and than regret)
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

                // Add the user to users array and reset his selections
                var {usersInReceipt} = addUserIfDoesntExist(doc.data());

                // If we are here, not all users are finished
                //  Check if the current user is already finished
                var useDetails = CalculateService(props).getUserDetails(usersInReceipt, state.user.email);
                if (useDetails != undefined && useDetails.isFinished) {
                    props.history.push('/waiting');
                }
                dispatch({type: 'TOGGLE_LOADING'});
            })
            .catch(err => {
                console.error('firebase:error saving receipt', err);
                reject(err);
            });

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