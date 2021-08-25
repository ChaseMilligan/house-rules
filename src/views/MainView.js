import React, { useState } from "react";
import { Box, Button, Collapsible, Layer, Heading } from "grommet";
import { FormClose, Logout, Menu } from "grommet-icons";
import AppBar from "../components/AppBar";
import { auth } from "../config/firebase-config";
import { Switch, Route, Link } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

export default function MainView() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSignOut() {
    setLoading(true);
    const signOut = auth
      .signOut()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
    setLoading(false);
  }
  return (
    <>
      <AppBar>
        <Heading level="3" margin="none">
          House Rules
        </Heading>
        <Button icon={<Menu />} onClick={() => setShowSidebar(!showSidebar)} />
      </AppBar>
      <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
        <Switch>
          <Route exact path="/profile">
            <Profile />
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
                Home
              </Link>
              <Link to="/profile" onClick={() => setShowSidebar(false)}>
                Profile
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
