import React, { useState, useEffect } from "react";
import "./styles/index.css";
import { Box, Grommet, ResponsiveContext } from "grommet";
import { auth } from "./config/firebase-config";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreateUser from "./views/CreateUser";
import SignIn from "./views/SignIn";
import MainView from "./views/MainView";
import Loading from "./components/Loading";

import "./styles/components/ProfileCard.css";
import "./styles/components/Rules.css";

const theme = {
  global: {
    colors: {
      brand: "#191923",
      "accent-1": "#0E79B2",
      "accent-2": "#0E79B2",
      "accent-3": "#0E79B2",
      "accent-4": "#0E79B2",
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
