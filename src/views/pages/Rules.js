import {
  TextInput,
  Box,
  Button,
  Heading,
  Form,
  FormField,
  Paragraph,
} from "grommet";
import { Add, Trash } from "grommet-icons";
import { auth } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { getUserByUid } from "../../service/Users";
import { updateDefaultRules } from "../../service/Rules";

export default function Rules() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(undefined);
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState();
  const [value, setValue] = useState();

  async function handleSubmit({ value }) {
    setLoading(true);
    setRules([...rules, value]);
    setLoading(false);
  }

  useEffect(async () => {
    setLoading(true);
    await updateDefaultRules(auth.currentUser.uid, rules);
    setLoading(false);
  }, [rules]);

  useEffect(async () => {
    setLoading(true);
    const fetchedUser = await getUserByUid(auth.currentUser.uid);
    setUser(fetchedUser);
    setRules(fetchedUser.defaultRules);
    setLoading(false);
  }, []);

  if (loading || user === undefined) {
    return <Loading />;
  }

  return (
    <Box flex align="center" justify="start">
      <div className="rules-container container-fluid">
        {user && user.activeRoomUid ? (
          <Box flex align="start" justify="center">
            <Heading level="2">Rules of the House</Heading>
          </Box>
        ) : (
          <Box flex align="start" justify="center">
            <Heading level="2">Your Default House Rules</Heading>
            <Box flex margin="2em 0px" align="center" justify="center">
              <Form
                value={value}
                onChange={(nextValue) => setValue(nextValue)}
                onReset={() => setValue()}
                onSubmit={handleSubmit}
              >
                <FormField name="rule" htmlFor="text-input-id" label="New Rule">
                  <TextInput
                    name="rule"
                    id="text-area-id"
                    placeholder="Add a new Rule..."
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </FormField>
                <Box direction="row" gap="medium">
                  <Button
                    type="submit"
                    primary
                    label="Add Rule"
                    icon={<Add />}
                  />
                </Box>
              </Form>
            </Box>
            {rules.length !== 0 && (
              <Box className="rules-list" margin="1em 0px" flex fill>
                {rules.map((rule, index) => (
                  <Box
                    className="rule-item"
                    margin=".5em 0px"
                    background="light-2"
                  >
                    <Box flex direction="row" align="center" justify="between">
                      <Heading level="2">{index + 1}.</Heading>
                      <Button size="large" icon={<Trash color="#FF4040" />} />
                    </Box>
                    <Paragraph>{rule}</Paragraph>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </div>
    </Box>
  );
}
