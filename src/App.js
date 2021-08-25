import React, { useState, useEffect } from "react";
import "./styles/index.css";
import { Box, Grommet, Spinner, ResponsiveContext, Paragraph } from "grommet";
import { auth } from "./config/firebase-config";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateUser from "./views/CreateUser";
import SignIn from "./views/SignIn";

import MainView from "./views/MainView";
import Profile from "./views/pages/Profile";
import Loading from "./components/Loading";

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

function App() {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    setLoading(true);
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setLoading(false);
      } else {
        setLoggedIn(false);
        setLoading(false);
      }
    });
  }, []);

  console.log(loading);

  return (
    <Router>
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {(size) => (
            <Box fill>
              {loading ? (
                <Loading />
              ) : (
                <Switch>
                  <Route exact path="/create-user">
                    <CreateUser />
                  </Route>
                  <Route path="/">
                    {loggedIn ? (
                      <>
                        <MainView size={size} />
                      </>
                    ) : (
                      <>
                        <SignIn />
                      </>
                    )}
                  </Route>
                </Switch>
              )}
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Router>
  );
}

export default App;
