import React, { useState } from "react";
import { Box, Button, Collapsible, Layer, Heading, Nav, Anchor } from "grommet";
import {
  FormClose,
  Logout,
  Menu,
  Notes,
  Trophy,
  Home as House,
  UserSettings,
} from "grommet-icons";
import AppBar from "../components/AppBar";
import { auth } from "../config/firebase-config";
import { Switch, Route, Link } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Rules from "./pages/Rules";

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

  return (
    <>
      <AppBar>
        <Heading level="3" margin="none">
          House Rules
        </Heading>
      </AppBar>
      <Box
        className="nav-margin"
        direction="row"
        flex
        overflow={{ horizontal: "hidden" }}
      >
        <Switch>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/rules">
            <Rules />
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
      <Nav direction="row" background="brand" pad="medium" justify="around">
        <Anchor href="/rules" icon={<Notes />} hoverIndicator />

        <Anchor href="/" icon={<House />} hoverIndicator />

        <Anchor href="/games" icon={<Trophy />} hoverIndicator />

        <Anchor href="/profile" icon={<UserSettings />} hoverIndicator />
      </Nav>
    </>
  );
}
