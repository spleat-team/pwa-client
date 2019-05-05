import React from 'react';
import FacebookLoginWithButton from "react-facebook-login";
import { Store } from './Store';

function LoginPage (props){

	const { state, dispatch } = React.useContext(Store);

	React.useEffect(() => {
		console.log("effect in LoginPage with props: ", props.isLogOut)
		if (props.isLogOut) {
			console.log("logged out...")
			dispatch({
				type: "USER_LOGOUT"
			});
		}
	});

	const responseFacebook = response => {
		console.log("back from facebook with : ", response);
		dispatch({
            type: "USER_LOGIN",
            payload: response
		});	
	  };
	
	const componentClicked = () => console.log("clicked");

	return (
		<div>
		{console.log("kakiiiiiiiiiiiiiiiiiiii", state)}
		{
			state.user && state.userLoggedIn ? (
				<div
					style={{
					  width: "400px",
					  margin: "auto",
					  background: "#f4f4f4",
					  padding: "20px"
					}}
				>
					<img src={state.user.picture} alt={state.user.name} />
					<h2>Welcome {state.user.name}</h2>
					Email: {state.user.email}
					
				</div>
				
			) : (
				// <Link to="/">
				<div style={{marginTop: "30%"}}>
				<p style={{marginLeft: "7%", marginRight: "7%", direction: "rtl"}}>לפני שנתחיל - היינו רוצים להכיר אותך קצת יותר טוב, מה דעתך על לחבר את הפייסבוק?</p>
					<div style={{marginTop: "30%"}}>
						<FacebookLoginWithButton
							appId="339944453372114"
							autoLoad={false}
							fields="name,email,picture"
							onClick={componentClicked}
							callback={responseFacebook}
						/>
					</div>
				</div>
				// </Link>
			)
		}
		
		</div>
	)
}

export default LoginPage;