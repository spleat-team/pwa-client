import React, { useState, useEffect } from "react";
import { Store } from './Store';
import "react-image-crop/dist/ReactCrop.css";
import logo from './logo.png';
import './App.css';
import {
	BrowserRouter,
	Route,
	Switch
  } from 'react-router-dom';
import { css } from '@emotion/core';
import { SyncLoader } from 'react-spinners';
import ScanPage from "./components/ScanPage";
import itemsList from './ItemsList';
import NotFoundComponent from './components/NotFoundComponent';
import LoginPage from './LoginPage'

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

function App(props) {

	const { state, dispatch } = React.useContext(Store);
	const [shouldAuthenticate, setShouldAuthenticate] = useState(false)
  
    useEffect(() => {
		if (!state.userLoggedIn) {
			if (!window.location.href.includes('/login')) {
				console.log("going to /login...")
				// setShouldAuthenticate(true);
				// this.history.pushState(null, 'login');
			}
			else {
				console.log("already in /login...")
			}
		} else {
			console.log("user is already logged in...")
		}
	}, [state.userLoggedIn]);


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
			<BrowserRouter>
			{
				console.log(window.location.href)
			}
				<div className="App">
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
					{ 
						// shouldAuthenticate && <Redirect to="/login"/>
					}
					<Switch>
						<Route exact path='/' component={ScanPage}></Route>
						<Route path='/login' component={LoginPage}></Route>
						<Route path='/logout' render={() => {
							return <LoginPage isLogOut={true}/>
						}}></Route>
						<Route path='/itemsList' component={itemsList}></Route>
						<Route component={NotFoundComponent}></Route>
					</Switch>
				</div>
			</BrowserRouter>
		</React.Fragment>
	);
}

export default App;