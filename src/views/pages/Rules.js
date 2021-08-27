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
import { updateActiveRoomRules, updateDefaultRules } from "../../service/Rules";
import { getUserActiveRoom } from "../../service/Rooms";

export default function Rules() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [room, setRoom] = useState();
  const [rules, setRules] = useState([]);
  const [errors, setErrors] = useState();
  const [value, setValue] = useState();

  async function handleSubmit({ value }) {
    setLoading(true);
    setRules([...rules, value]);
    setValue(null);
    setLoading(false);
  }

  async function handleDeleteDefaultRule(ruleToRemove) {
    setLoading(true);
    const filteredRules = rules.filter((rule) => rule !== ruleToRemove);
    setRules(filteredRules);
    setLoading(false);
  }

  useEffect(async () => {
    setLoading(true);
    if (user && user.activeRoomUid) {
      await updateActiveRoomRules(room.uid, rules);
    } else {
      await updateDefaultRules(auth.currentUser.uid, rules);
    }

    setLoading(false);
  }, [rules]);

  useEffect(async () => {
    setLoading(true);
    const fetchedUser = await getUserByUid(auth.currentUser.uid);
    console.log(auth.currentUser.uid);
    await getUserActiveRoom(auth.currentUser.uid).then((activeRoom) => {
      console.log(activeRoom);
      if (activeRoom) {
        setRules(activeRoom.rules);
        setRoom(activeRoom);
      } else {
        setRules(fetchedUser.defaultRules);
      }
    });
    setUser(fetchedUser);
    setLoading(false);
  }, []);

  console.log(room, user);

  if (loading || user === undefined) {
    return <Loading />;
  }

  return (
    <Box flex align="center" justify="start">
      <div className="rules-container container-fluid">
        {user && user.activeRoomUid ? (
          <Box flex align="start" justify="center">
            <Heading level="2">Rules of the House</Heading>
            {room.roomOwner.uid === auth.currentUser.uid && (
              <Box flex margin="2em 0px" align="center" justify="center">
                <Form
                  value={value}
                  onChange={(nextValue) => setValue(nextValue)}
                  onReset={() => setValue()}
                  onSubmit={handleSubmit}
                >
                  <FormField
                    name="rule"
                    htmlFor="text-input-id"
                    label="New Rule"
                  >
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
            )}
            {rules && rules.length !== 0 && (
              <Box className="rules-list" margin="1em 0px" flex fill>
                {rules.map((rule, index) => (
                  <Box
                    className="rule-item"
                    margin=".5em 0px"
                    background="light-2"
                  >
                    <Box flex direction="row" align="center" justify="between">
                      <Heading level="2">{index + 1}.</Heading>
                      {room.roomOwner.uid === auth.currentUser.uid && (
                        <Button
                          size="large"
                          icon={<Trash color="#FF4040" />}
                          onClick={() => handleDeleteDefaultRule(rule)}
                        />
                      )}
                    </Box>
                    <Paragraph>{rule}</Paragraph>
                  </Box>
                ))}
              </Box>
            )}
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
            {rules && rules.length !== 0 && (
              <Box className="rules-list" margin="1em 0px" flex fill>
                {rules.map((rule, index) => (
                  <Box
                    className="rule-item"
                    margin=".5em 0px"
                    background="light-2"
                  >
                    <Box flex direction="row" align="center" justify="between">
                      <Heading level="2">{index + 1}.</Heading>
                      <Button
                        size="large"
                        icon={<Trash color="#FF4040" />}
                        onClick={() => handleDeleteDefaultRule(rule)}
                      />
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
