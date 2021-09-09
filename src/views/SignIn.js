import { useState } from "react";
import { Box, Image, Form, FormField, TextInput, Button } from "grommet";
import { Google, UserNew } from "grommet-icons";
import logo from "../images/HR_icon.png";
import { googleProvider } from "../config/authMethods";
import socialMediaAuth, { emailPassAuth } from "../service/auth";
import { Switch, Route, Link } from "react-router-dom";
import CreateUser from "./CreateUser";

export default function SignIn() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthClick = async (provider) => {
    setLoading(true);
    const res = await socialMediaAuth(provider);
    setLoading(false);
  };

  function handleSubmit({ value }) {
    setLoading(true);
    const { email, password } = value;
    emailPassAuth(email, password);
    setLoading(false);
  }

  return (
    <Box flex align="center" justify="center" pad="2em">
      <Box height="small" width="small">
        <Image fit="contain" src={logo} />
      </Box>
      <h1>House rules</h1>
      <Box className="form-container" margin="1em 0px">
        <Form
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          onReset={() => setValue("")}
          onSubmit={handleSubmit}
        >
          <FormField name="email" htmlFor="text-input-id" label="Email">
            <TextInput id="text-input-id" name="email" />
          </FormField>
          <FormField name="password" htmlFor="text-input-id" label="Password">
            <TextInput type="password" id="text-input-id" name="password" />
          </FormField>
          <Box
            flex
            direction="row"
            align="center"
            justify="between"
            gap="medium"
          >
            <Button type="submit" primary label="Sign In" />
            <a href="#">Forgot Password?</a>
          </Box>
        </Form>
        <Box flex="shrink" pad="1em 0px" direction="column">
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
                margin=".5em 0px"
              />
            </Box>
          </Link>
        </Box>
        <Switch>
          <Route path="/create-user">
            <CreateUser />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}
