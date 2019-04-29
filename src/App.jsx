import React, { useState, useEffect } from "react";
// import { Link } from '@reach/router';
import { Store } from './Store';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import logo from './logo.png';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch
  } from 'react-router-dom';
import { css } from '@emotion/core';
import { SyncLoader } from 'react-spinners';
import ScanPage from "./ScanPage";
import itemsList from './ItemsList';
import NotFoundComponent from './NotFoundComponent';

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

function App(props) {

	const { state, dispatch } = React.useContext(Store);
	const [loading, setLoading] = useState(0);
  
    React.useEffect(() => {
		console.log(state);
	},[loading]);
	
//   const getReceiptCoordinates = () => {
// 	if (state.hasReceiptInPhoto && !state.receiptCoordinates) {
// 	  console.log("Searching for coordinates..")
// 	  this.sendPhoto(state.photo, 'detectReceipt').then((response)=>{
// 		this.setState({
// 		  receiptCoordinates: response.data,
// 		  crop: {
// 			width: response.data[1][0] - response.data[0][0],
// 			height: response.data[1][1] - response.data[0][1],
// 			x: response.data[0][0],
// 			y: response.data[0][1]
// 		  }
// 		});
// 	  });
// 	}
//   }

	return (
		<React.Fragment>
			<Router>
				<div className="App">
					<Link to='/'>Home</Link>{' '}
					<img src={logo} className="App-logo" alt="Spleat Logo"/>
					<div className='sweet-loading' style={{margin: 20}}>
						<SyncLoader
							css={override}
							sizeUnit={"px"}
							size={8}
							color={'#123abc'}
							loading={state.loading}
						/>
					</div>
					<button onClick={() => dispatch({type: 'TOGGLE_LOADING'})}>Push me</button>
					<Switch>
						<Route exact path='/' component={ScanPage}></Route>
						<Route exact path='/itemsList' component={itemsList}></Route>
						<Route component={NotFoundComponent}></Route>
					</Switch>
				</div>
			</Router>
		</React.Fragment>
	);
}

export default App;