import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { connect } from 'react-redux';
import { saveUserInState } from './redux/user/user.action';

import LandingPage from './pages/Landing/Landing.page';
import LoginPage from './pages/Login/Login.page';
import RegisterPage from './pages/Register/Register.page';
import NotFoundPage from './pages/NotFound/NotFound.page';
import UploadVideoPage from './pages/UploadVideo/UploadVideo.page';
import VideoDetailsPage from './pages/VideoDetails/VideoDetails.page';
import SubscriptionPage from './pages/Subscription/Subscription.page';
import UserDashboardPage from './pages/UserDashboard/UserDashboard.page';
import ChannelPage from './pages/Channel/Channel.page';

import Header from './components/Header/Header';
import AuthRoute from './components/AuthRoute/AuthRoute';

import axios from 'axios';

const App = ({ saveUserInState }) => {
	useEffect(() => {
		const checkLoggin = async () => {
			try {
				let token = await localStorage.getItem("auth-token");
				// if(!token) {
				// 	localStorage.setItem("auth-token", "");
				// 	token = "";
				// }

				if(token) {
					const response = await axios.post('http://localhost:2020/users/isTokenValid',null,{
						headers : {
							"x-auth-token": token
						}
					});

					const isTokenValid = await response.data;
					if(isTokenValid) {
						const user = await axios.get('http://localhost:2020/users', {
							headers: {
								"x-auth-token": token
							}
						});
						saveUserInState(token, user.data);
					}
				}
			} catch (error) {
				console.log("[Access token error]:", error);
			}
		}

		checkLoggin();
	}, [saveUserInState]);

	return (
		<>
			<Header />
			<Switch>
				<AuthRoute
					exact
					path="/user/dashboard"
					component={UserDashboardPage} 
				/>
				<AuthRoute 
					exact
					path="/subscription"
					component={SubscriptionPage}
				/>
				<AuthRoute 
					exact
					path="/video/upload"
					component={UploadVideoPage}
				/>
				<Route path="/video/:videoId" component={VideoDetailsPage} />
				<Route path="/channel/:channelId" component={ChannelPage} />
				<Route path="/login" component={LoginPage} />
				<Route path="/register" component={RegisterPage} />
				<Route exact path="/" component={LandingPage} />
				<Route path="*" component={NotFoundPage} />
			</Switch>
		</>
	);
};

const mapDispatchToProps = dispatch => ({
	saveUserInState: (token, user) => dispatch(saveUserInState(token, user))
})

export default connect(null, mapDispatchToProps)(App);
