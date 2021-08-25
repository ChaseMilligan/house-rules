import React, { useState, useEffect } from "react";
import "./styles/index.css";
import logo from "./images/HR_icon.png";
import {
  Box,
  Button,
  Form,
  FormField,
  TextInput,
  Collapsible,
  Heading,
  Image,
  Grommet,
  Layer,
  Spinner,
  ResponsiveContext,
} from "grommet";
import { FormClose, Menu, Google, Logout, UserNew } from "grommet-icons";
import socialMediaAuth from "./service/auth";
import { googleProvider } from "./config/authMethods";
import { auth } from "./config/firebase-config";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateUser from "./CreateUser";

const theme = {
  global: {
    colors: {
      brand: "#423fc2",
      "accent-1": "#f0b347",
    },
    font: {
      family: "Roboto",
      size: "14px",
      height: "20px",
    },
  },
};

const AppBar = (props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    style={{ zIndex: "1" }}
    {...props}
  />
);

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState();
  const [value, setValue] = useState("");

  const handleAuthClick = async (provider) => {
    setLoading(true);
    const res = await socialMediaAuth(provider);
    setLoading(false);
  };

  function handleSignOut() {
    setLoading(true);
    const signOut = auth
      .signOut()
      .then((res) => {
        return "logged out", res;
      })
      .catch((err) => {
        return err;
      });
    setLoading(false);
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setLoading(true);
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    });
  }, []);

  if (loading || loggedIn === null) {
    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box flex align="center" justify="center">
              <Spinner />
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    );
  }

  return (
    <Router>
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box fill>
              {loggedIn ? (
                <>
                  <AppBar>
                    <Heading level="3" margin="none">
                      House Rules
                    </Heading>
                    <Button
                      icon={<Menu />}
                      onClick={() => setShowSidebar(!showSidebar)}
                    />
                  </AppBar>
                  <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
                    <Box flex align="center" justify="center">
                      {auth.currentUser ? (
                        <p>Signed in as: {auth.currentUser.displayName}</p>
                      ) : (
                        <p>You are not Logged in.</p>
                      )}
                    </Box>
                    {!showSidebar && size !== "small" ? (
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
                        <Box
                          fill
                          background="light-2"
                          align="center"
                          justify="center"
                        >
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
              ) : (
                <>
                  <Box flex align="center" justify="center">
                    <Box height="small" width="small">
                      <Image fit="contain" src={logo} />
                    </Box>
                    <h1>House rules</h1>
                    <Box margin="4em 0px">
                      <Form
                        value={value}
                        onChange={(nextValue) => setValue(nextValue)}
                        onReset={() => setValue("")}
                        onSubmit={({ value }) => {}}
                      >
                        <FormField
                          name="email"
                          htmlFor="text-input-id"
                          label="Email"
                        >
                          <TextInput id="text-input-id" name="email" />
                        </FormField>
                        <FormField
                          name="password"
                          htmlFor="text-input-id"
                          label="Password"
                        >
                          <TextInput
                            type="password"
                            id="text-input-id"
                            name="password"
                          />
                        </FormField>
                        <Box
                          flex
                          direction="row"
                          align="center"
                          justify="between"
                          gap="medium"
                        >
                          <Button type="submit" primary label="Sign In" />
                          <a href="#">Forget Password?</a>
                        </Box>
                      </Form>
                    </Box>
                    <Box flex="shrink" direction="column">
                      <Button
                        primary
                        label="Sign in with Google"
                        icon={<Google />}
                        onClick={() => handleAuthClick(googleProvider)}
                        margin=".5em 0px"
                      />
                      <Link to="/create-user">
                        <Box flex="shrink" direction="column">
                          <Button
                            secondary
                            label="Create Account"
                            icon={<UserNew />}
                            onClick={() => console.log("create user")}
                            margin=".5em 0px"
                          />
                        </Box>
                      </Link>
                    </Box>
                  </Box>
                  <Switch>
                    <Route path="/create-user">
                      <CreateUser />
                    </Route>
                  </Switch>
                </>
              )}
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Router>
  );
}

export default App;
