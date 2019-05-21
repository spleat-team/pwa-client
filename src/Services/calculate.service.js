import {React, useEffect } from 'react';
import { Firebase } from '../Firebase/firebase';
import {Store} from "../Store";

const CalculateService = () => {

       // const { state, dispatch } = React.useContext(Store);
      //  const {checkedItems} = state;

    const collectionName = 'receipts';
    const firebase = Firebase.initialize();
    var db = firebase.app.firestore();

    const calculateBill = (receipt) => {
        var users = receipt.users.map((user) => {
            return {'email': user.email, 'sum': 0, name: user.name};
        })

        receipt.items.forEach((item) => {
            var pricePerItem = getPriceAfterSplit(item);

            // Add the price item for each user
            item.users.forEach((user) => {
                var userIndex = findIndex(users, user, 'email');
                var userTip = getUserTip(receipt.users, user);
                users[userIndex].sum += (pricePerItem + pricePerItem*(userTip/100));
            })
        })

        return users;
    }

    const getUserTip = (users, userId) => {
        var index = findIndex(users, userId, 'email');
        return users[index].tip;
    }

    const getPriceAfterSplit = (item) => {
        return (item.price / item.users.length)
    }

    const areAllUsersFinished = (users, numberOfPeople) => {

        return (getUserFinishedAmount(users)==numberOfPeople);
    }

    const getUserFinishedAmount = (users) => {

        var count = 0;

        for (const currentUser of users) {
            if (currentUser.isFinished)
                count++;
        }

        return count;
    }

    const findIndex = (items, itemId, field) => {
        return items.findIndex(item => {
            return item[field].toString() == itemId
        })
    }

    const associateItemsPerUser = (allItems, currentUserId, checkedItems) => {

        checkedItems.forEach((currItem) => {
            var itemIndex = findIndex(allItems, currItem, '_id');

            // If the item exists
            if (itemIndex !== -1) {

                var isExist = allItems[itemIndex].users.find((user)=>{
                   return user == currentUserId
                });

                // Add the user to users array of the current item if it doesn't exist
                if (!isExist)
                    allItems[itemIndex].users.push(currentUserId);
            }
        });

        return allItems;
    }

    function finishSelectItems(receiptPinCode, currentUserId, checkedItems, tip) {

        // Create reference to the receipt doc
        var receiptDocRef = db.collection(collectionName).doc(receiptPinCode);

        return new Promise((resolve, reject) => {
            db.runTransaction((transaction => {
                return transaction.get(receiptDocRef)
                    .then((doc) => {
                        if (!doc.exists)
                            throw "The receipt doesn't exist";
                        if (!areAllUsersFinished(doc.data().users, doc.data().numberOfPeople)) {

                            const cloneResponse = {...doc.data()};
                            cloneResponse.items = associateItemsPerUser(cloneResponse.items, currentUserId, checkedItems);

                            // Change the status of user to 'finished'
                            var userIndex = findIndex(cloneResponse.users, currentUserId, 'email');
                            cloneResponse.users[userIndex].isFinished = true;
                            cloneResponse.users[userIndex].tip = parseInt(tip);
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
        getUserFinishedAmount,
        calculateBill,
        areAllUsersFinished
    }
};

export default CalculateService;