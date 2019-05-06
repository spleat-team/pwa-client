import React from 'react';
import SelectingItem from './components/SelectingItem'
import { Store } from './Store';

export default function ItemsPage() {
	const { state, dispatch } = React.useContext(Store);
	
	const props = {
		items: state.items
  };

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
          <SelectingItem
              // item={this.props.items}
              name={"beer"}/>
          <SelectingItem name={"pizza"}/>
      </div>
  );
}