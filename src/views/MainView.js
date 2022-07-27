import React, { useState } from 'react';
import { Box, Button, Collapsible, Layer, Heading, Nav, Anchor } from 'grommet';
import {
	FormClose,
	Logout,
	Menu,
	Notes,
	Trophy,
	Home as House,
	UserSettings
} from 'grommet-icons';
import { useEffect } from 'react';
import { auth } from '../config/firebase-config';
import { Switch, Route, Link } from 'react-router-dom';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Rules from './pages/Rules';
import Games from './pages/Games';
import { getUserByUid } from '../service/Users';
import Loading from '../components/Loading';

export default function MainView() {
	const [showSidebar, setShowSidebar] = useState(false);
	const [loading, setLoading] = useState(false);

	function handleSignOut() {
		setLoading(true);
		const signOut = auth
			.signOut()
			.then((res) => {
				setLoading(false);
				return res;
			})
			.catch((err) => {
				setLoading(false);
				return err;
			});
	}

	useEffect(() => {
		setLoading(true);
		getUserByUid(auth.currentUser.uid).then((user) => {
			console.log(user);
		});
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<Nav direction="row" background="brand" pad="medium" justify="around">
				<Anchor href="/rules" icon={<Notes />} hoverIndicator />

				<Anchor href="/" icon={<House />} hoverIndicator />

				<Anchor href="/games" icon={<Trophy />} hoverIndicator />

				<Anchor href="/profile" icon={<UserSettings />} hoverIndicator />
			</Nav>
			<Box
				className="nav-margin"
				direction="row"
				flex
				overflow={{ horizontal: 'hidden' }}
			>
				<Switch>
					<Route exact path="/profile">
						<Profile />
					</Route>
					<Route exact path="/rules">
						<Rules />
					</Route>
					<Route exact path="/games">
						<Games />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
				{!showSidebar ? (
					<Collapsible direction="horizontal" open={showSidebar}>
						<Box
							flex
							width="medium"
							background="light-2"
							elevation="small"
							align="center"
							justify="center"
						>
							{/*  */}
						</Box>
					</Collapsible>
				) : (
					<Layer>
						<Box
							background="light-2"
							tag="header"
							justify="end"
							align="center"
							direction="row"
						>
							<Button
								icon={<FormClose />}
								onClick={() => setShowSidebar(false)}
							/>
						</Box>
						<Box fill background="light-2" align="center" justify="center">
							<Link to="/" onClick={() => setShowSidebar(false)}>
								<h1>Home</h1>
							</Link>
							<Link to="/profile" onClick={() => setShowSidebar(false)}>
								<h1>Profile</h1>
							</Link>
							<Button
								primary
								label="Sign Out"
								icon={<Logout />}
								onClick={() => handleSignOut()}
							/>
						</Box>
					</Layer>
				)}
			</Box>
		</>
	);
}
