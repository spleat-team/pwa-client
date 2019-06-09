import React from 'react';
import SelectingItem from './components/SplitBill/SelectingItem';
import GroupNumber from "./components/GroupNumber";
import SelectTip from './components/SplitBill/Tip';
import { Store } from './Store';
import AlreadyFinishedStatus from './components/SplitBill/AlreadyFinishedStatus';
import FinishedForm from './components/SplitBill/FinishForm';
import Grid from '@material-ui/core/Grid';
import CalculateService from './Services/calculate.service.js';
import { Firebase } from './Firebase/firebase';
import { Promise as reject } from 'q';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

function ItemsList(props) {
  const { state, dispatch } = React.useContext(Store);
  const { checkedItems } = state;
  const [items, setItems] = React.useState([]);
  const [openDialog, setOpen] = React.useState(false);

  var handleToggle = {};

  const firebase = Firebase.initialize();
  var db = firebase.app.firestore();
  const collectionName = 'receipts';

  const resetUserSelection = (userId, allItem) => {
    allItem.forEach(item => {
      var index = CalculateService(props).findIndex(item.users, userId);
      if (index != -1) item.users.splice(index, 1);
    });

    return allItem;
  };

  // Add the user to users array and reset his selections
  // If all users are finished - move to payment page
  const addUserIfDoesntExist = data => {
    var isSomethingChanged = true;
    var usersInReceipt = data.users;

    var userToInsert = {
      email: state.user.email,
      name: state.user.displayName,
      isFinished: false,
      tip: 10,
    };

    var updateItems = data.items;

    // If the user doesn't exist in users array in receipt add it
    // This is the first time the user enter to this page
    if (
      usersInReceipt != undefined &&
      CalculateService(props).getUserDetails(
        usersInReceipt,
        state.user.email
      ) == undefined
    ) {
      // If the users amount is equal to number of people - all users are connected and the list is full
      // Alert the user that we got the max number of people
      if (data.numberOfPeople == usersInReceipt.length) {
        isSomethingChanged = false;
        setOpen(true);
      }
      else {
        // Add the user to users list
        usersInReceipt.push(userToInsert);
      }
    }
    // The user is exist
    // The user came back from waiting page (he finished to select items, and than regret)
    else {
      var index = CalculateService(props).findIndex(
        usersInReceipt,
        state.user.email,
        'email'
      );

      // Reset the user details
      usersInReceipt[index] = userToInsert;

      // Reset the user selection items
      updateItems = resetUserSelection(state.user.email, data.items);
    }

    if (isSomethingChanged) {
      // Update the user in receipt
      db.collection(collectionName)
          .doc(props.match.params.groupId)
          .update({users: usersInReceipt, items: updateItems})
          .then(function () {
            console.log('Users successfully updated!');

            onDocumentUpdated(props.match.params.groupId);
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error('Error updating document: ', error);
          });
    }

    return { usersInReceipt };
  };

  const onDocumentUpdated = groupId => {
    db.collection(collectionName)
      .doc(groupId)
      .onSnapshot(function(doc) {
        if (!doc.exists) throw "The receipt doesn't exist";

        // Set amount of users who finished selected items
        dispatch({
          type: 'FINISHED_SELECT_ITEMS',
          finishedCount: CalculateService(props).getFinishedUsersAmount(
            doc.data().users
          ),
        });

        // If all the users are done
        if (
          CalculateService(props).areAllUsersFinished(
            doc.data().users,
            doc.data().numberOfPeople
          )
        ) {
          var paymentPerUser = CalculateService(props).calculateBill(
            doc.data()
          );

          // set the payment per user
          dispatch({
            type: 'FINISHED_CALC',
            paymentPerUser: paymentPerUser,
          });

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
    db.collection(collectionName)
      .doc(props.match.params.groupId)
      .get()
      .then(doc => {
        setItems(doc.data().items);
        dispatch({
          type: 'SHARERS_COUNT',
          sharersCount: doc.data().numberOfPeople,
        });

        // Set pincode of group
        dispatch({
            type: 'SET_PINCODE',
            payload: props.match.params.groupId,
        });

        // Add the user to users array and reset his selections
        var { usersInReceipt } = addUserIfDoesntExist(doc.data());

        // If we are here, not all users are finished
        //  Check if the current user is already finished
        var useDetails = CalculateService(props).getUserDetails(
          usersInReceipt,
          state.user.email
        );
        if (useDetails != undefined && useDetails.isFinished) {
          props.history.push('/waiting');
        }
        dispatch({ type: 'TOGGLE_LOADING' });
      })
      .catch(err => {
        console.error('firebase:error saving receipt', err);
        reject(err);
      });
  }, [props.match.params.groupId]);

  if (!props.match.params.groupId) {
    // todo: redirect to insert pin code page
    console.log('redirect');
    props.history.push(`/login`);
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
      dispatch({ type: 'CHECKED_ITEMS', checkedItems: newChecked });
    };
  }

  return (
    <div>
      {state.loading ? (
        <Grid> טוען את פרטי הקבלה</Grid>
      ) : (

        <Grid>
          <GroupNumber/>
          בחר את הפריטים שהזמנת
          {items.map(currItem => (
            <SelectingItem
              key={currItem._id.toString()}
              item={currItem}
              handle={value => {
                handleToggle(value);
              }}
              checked={checkedItems.indexOf(currItem._id.toString())}
            />
          ))}
          <Grid container justify={"center"} alignItems={"center"} dir={"rtl"}>
            <Grid item xs={6}>
            <SelectTip />
            </Grid>
            <Grid item xs={6}>
            <AlreadyFinishedStatus message={'מחכים לך'} />
            </Grid>
          </Grid>
          <FinishedForm props={props} />

          <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={openDialog}
              onClose={()=>setOpen(false)}
              aria-labelledby="error-title"
              aria-describedby="error-description"
              style={{textAlign: 'center', direction: 'rtl'}}>
            <DialogTitle id="error-title" >{"בעיית התחברות"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="error-description">
                בקבלה זו נמצאת כמות מקסימלית של אנשים.
                אנא הזן קוד חדש
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{justifyContent: 'center'}}>
              <Button onClick={()=> {setOpen(false); props.history.push(`/login`);}} color="primary" autoFocus>
                קוד חדש
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}
    </div>
  );
}

export default ItemsList;
