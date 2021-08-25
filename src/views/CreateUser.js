import { useState } from "react";
import { Box, Image, Form, FormField, TextInput, Button } from "grommet";
import { UserNew, Login } from "grommet-icons";
import logo from "../images/HR_icon.png";
import { Link } from "react-router-dom";
import { createEmailPassAuth } from "../service/auth";

export default function CreateUser() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit({ value }) {
    setLoading(true);
    const { name, email, password } = value;
    createEmailPassAuth(email, name, password);
    setLoading(false);
  }
  return (
    <Box flex align="center" justify="center">
      <Box height="small" width="small">
        <Image fit="contain" src={logo} />
      </Box>
      <h1>Sign Up</h1>
      <Box margin="2em 0px">
        <Form
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          onReset={() => setValue("")}
          onSubmit={handleSubmit}
        >
          <FormField name="name" htmlFor="text-input-id" label="Name">
            <TextInput id="text-input-id" name="name" />
          </FormField>
          <FormField name="email" htmlFor="text-input-id" label="Email">
            <TextInput type="email" id="text-input-id" name="email" />
          </FormField>
          <FormField name="password" htmlFor="text-input-id" label="Password">
            <TextInput type="password" id="text-input-id" name="password" />
          </FormField>
          <Box
            flex
            direction="row"
            align="center"
            justify="center"
            gap="medium"
          >
            <Button
              margin=".5em 0px"
              type="submit"
              primary
              label="Sign Up"
              icon={<UserNew />}
            />
          </Box>
          <Box
            flex
            direction="row"
            align="center"
            justify="center"
            gap="medium"
          >
            <Link to="/">
              <Button
                margin=".5em 0px"
                type="submit"
                primary
                label="Back to Sign In"
                icon={<Login />}
              />
            </Link>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
