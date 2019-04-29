import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import { Store } from './Store';

export default function App() {

    const { state, dispatch } = React.useContext(Store);

    

    // React.useEffect(() => {
		// 	state.episodes.length === 0 && checkReceiptAction();
    // },[state.episodes]);

    return (
      <React.Fragment>
    		<div>
      		<Link to='/'>Home</Link>{' '}
      		<Link to='/faves'>Favourite(s) {state.favourites.length}</Link>
				</div>
      </React.Fragment>
    );
  }