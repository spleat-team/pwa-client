import React from 'react';
import { Firebase } from '../Firebase/firebase';

const collectionName = 'receipts';
// const firebase = React.useContext(FirebaseContext);
const firebase = Firebase.initialize();
var db = firebase.app.firestore();

const createReceipt = (receipt, user) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .doc(receipt.pincode)
      .set({
        numberOfPeople: parseInt(receipt.numberOfPeople),
        users: [user],
        items: receipt.items,
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        console.error('firebase:error saving receipt', err);
        reject(err);
      });
  });
};

export default { createReceipt };
