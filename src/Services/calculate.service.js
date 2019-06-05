import { React, useEffect } from 'react';
import { Firebase } from '../Firebase/firebase';
import { Store } from '../Store';

const CalculateService = () => {
  const collectionName = 'receipts';
  const firebase = Firebase.initialize();
  var db = firebase.app.firestore();

  const findIndex = (items, itemId, ...field) => {
    return items.findIndex(item => {
      if (field.length > 0) return item[field].toString() == itemId;
      else return item.toString() == itemId;
    });
  };

  const calculateBill = receipt => {
    var users = receipt.users.map(user => {
      return { email: user.email, sum: 0, name: user.name };
    });

    receipt.items.forEach(item => {
      var pricePerItem = getPriceAfterSplit(item);

      // Add the price item for each user
      item.users.forEach(user => {
        var userIndex = findIndex(users, user, 'email');
        var userTip = getUserDetails(receipt.users, user).tip;
        users[userIndex].sum += pricePerItem + pricePerItem * (userTip / 100);
      });
    });

    return users;
  };

  const getPriceAfterSplit = item => {
    return item.price / item.users.length;
  };

  const areAllUsersFinished = (users, numberOfPeople) => {
    return getFinishedUsersAmount(users) == numberOfPeople;
  };

  const getFinishedUsersAmount = users => {
    var count = 0;

    for (const currentUser of users) {
      if (currentUser.isFinished) {
        count++;
      }
    }

    return count;
  };

  const getUserDetails = (users, userId) => {
    return users[findIndex(users, userId, 'email')];
  };

  const associateItemsPerUser = (allItems, currentUserId, checkedItems) => {
    checkedItems.forEach(currItem => {
      var itemIndex = findIndex(allItems, currItem, '_id');

      // If the item exists
      if (itemIndex !== -1) {
        var isExist = allItems[itemIndex].users.find(user => {
          return user == currentUserId;
        });

        // Add the user to users array of the current item if it doesn't exist
        if (!isExist) allItems[itemIndex].users.push(currentUserId);
      }
    });

    return allItems;
  };

  function finishSelectItems(receiptPinCode, currentUserId, checkedItems, tip) {
    // Create reference to the receipt doc
    var receiptDocRef = db.collection(collectionName).doc(receiptPinCode);

    return new Promise((resolve, reject) => {
      db.runTransaction(transaction => {
        return transaction.get(receiptDocRef).then(doc => {
          if (!doc.exists) throw "The receipt doesn't exist";
          if (
            !areAllUsersFinished(doc.data().users, doc.data().numberOfPeople)
          ) {
            const cloneResponse = { ...doc.data() };
            cloneResponse.items = associateItemsPerUser(
              cloneResponse.items,
              currentUserId,
              checkedItems
            );

            // Change the status of user to 'finished'
            var userIndex = findIndex(
              cloneResponse.users,
              currentUserId,
              'email'
            );
            cloneResponse.users[userIndex].isFinished = true;
            cloneResponse.users[userIndex].tip = parseInt(tip);
            transaction.update(receiptDocRef, cloneResponse);
          }
        });
      }).catch(err => {
        console.error('firebase:error saving receipt', err);
        reject(err);
      });
    });
  }
  //
  return {
    findIndex,
    finishSelectItems,
    getFinishedUsersAmount,
    calculateBill,
    areAllUsersFinished,
    getUserDetails,
  };
};

export default CalculateService;
