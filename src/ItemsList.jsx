import React from 'react';
import { Store } from './Store';

export default function ItemsPage() {
	const { state, dispatch } = React.useContext(Store);
	
	const props = {
		items: state.items
  };
  
  return (
      <div>
        <p>Hello world</p>
      </div>
  );
}