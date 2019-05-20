import {React, useEffect } from 'react';
import { Firebase } from '../Firebase/firebase';
import {Store} from "../Store";

const CalculateService = (props) => {

       // const { state, dispatch } = React.useContext(Store);
      //  const {checkedItems} = state;



        const collectionName = 'receipts';
        const firebase = Firebase.initialize();
        var db = firebase.app.firestore();



    // function onDocumentUpdated(groupId) {
    //     db.collection(collectionName).doc(groupId)
    //         .onSnapshot(function (doc) {
    //             if (!doc.exists)
    //                 throw "The receipt doesn't exist";
    //             if (isAllUserFinished(doc.data().users)) {
    //                 var paymentPerUser = calculateBill(doc.data());
    //                 console.log(paymentPerUser);
    //
    //                 useEffect(()=>{
    //
    //                 });
    //                 // dispatch({
    //                 //     type: "FINISHED_CALC",
    //                 //     paymentPerUser: paymentPerUser
    //                 // });
    //                 props.history.push('/payment');
    //             }
    //         });
    // }

    const calculateBill = (receipt) => {
        var users = receipt.users.map((user) => {
            return {'email': user.email, 'sum': 0};
        })

        receipt.items.forEach((item) => {
            var pricePerItem = getPriceAfterSplit(item);

            // Add the price item for each user
            item.users.forEach((user) => {
                var userIndex = findIndex(users, user, 'email');
                users[userIndex].sum += pricePerItem;
            })
        })

        return users;
    }

    const getPriceAfterSplit = (item) => {
        return (item.price / item.users.length)
    }

    const isAllUserFinished = (users) => {

        var isEveryoneFinised = true;

        for (const currentUser of users) {
            if (!currentUser.isFinished)
                isEveryoneFinised = false;
        }
        return isEveryoneFinised;
    }

    const findIndex = (items, itemId, field) => {
        return items.findIndex(item => {
            return item[field] == itemId
        })
    }

    const associateItemsPerUser = (allItems, currentUserId, checkedItems) => {

        checkedItems.forEach((currItem) => {
            var itemIndex = findIndex(allItems, currItem, '_id');

            // If the item exists
            if (itemIndex !== -1) {

                // Add the user to users array of the current item
                allItems[itemIndex].users.push(currentUserId);
            }
        });

        return allItems;
    }

    function finishSelectItems(receiptPinCode, currentUserId, checkedItems) {

        currentUserId = "nave.coheng@gmail.com";
        //   state.user.email;
        // todo: remove

        // Create reference to the receipt doc
        var receiptDocRef = db.collection(collectionName).doc(receiptPinCode);

        return new Promise((resolve, reject) => {
            db.runTransaction((transaction => {
                return transaction.get(receiptDocRef)
                    .then((doc) => {
                        if (!doc.exists)
                            throw "The receipt doesn't exist";
                        if (!isAllUserFinished(doc.data().users)) {

                            const cloneResponse = {...doc.data()};

                            // todo: switch with currentUserId variable
                            cloneResponse.items = associateItemsPerUser(cloneResponse.items, currentUserId, checkedItems);

                            // Change the status of user to 'finished'
                            // todo: switch with currentUserId variable
                            var userIndex = findIndex(cloneResponse.users, currentUserId, 'email');
                            cloneResponse.users[userIndex].isFinished = true;
                            transaction.update(receiptDocRef, cloneResponse);
                        }
                    })
            }))
              // receiptDocRef.get()
              //   .then((doc) => {
              //       console.log("update the items successfully")
              //       var x=1;
              //       x++;
              //
              //       receiptDocRef.set(doc.data())
              //   })
                .catch(err => {
                    console.error('firebase:error saving receipt', err);
                    reject(err);
                });
        });
    };
    //
    return {
        finishSelectItems,
        //onDocumentUpdated,
        calculateBill,
        isAllUserFinished
    }
};

export default CalculateService;