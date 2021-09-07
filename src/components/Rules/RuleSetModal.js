import {
  Box,
  Button,
  Heading,
  Layer,
  Paragraph,
  Form,
  FormField,
  TextInput,
} from "grommet";
import { LinkPrevious, Trash, Add } from "grommet-icons";
import { useState } from "react";
import { auth } from "../../config/firebase-config";
import { overwriteRules } from "../../service/Rules";

export default function RuleSetModal(props) {
  const [rules, setRules] = useState(props.ruleSet.rules.rules);
  const [value, setValue] = useState();

  async function handleDeleteRule(rule) {
    console.log(rule);
    const filteredRules = rules.filter((item) => item !== rule);
    await overwriteRules(auth.currentUser.uid, props.ruleSet, filteredRules);
    setRules(filteredRules);
  }

  async function handleAddRule({ value }) {
    console.log(value);
    const newRules = [...rules, value];
    await overwriteRules(auth.currentUser.uid, props.ruleSet, newRules);
    setValue("");
    setRules(newRules);
  }

  return (
    <Layer onEsc={props.onModalClose} onClickOutside={props.onModalClose}>
      <Box overflow="scroll" padding="0px 1em">
        <Box margin="2em 2em" flex="grow" direction="row" align="center">
          <LinkPrevious color="dark-6" onClick={props.onModalClose} />
          <Heading margin="0px .5em" level="2">
            {props.ruleSet.name}
          </Heading>
        </Box>
        <Box pad="0px 2em">
          {props.canEdit && (
            <Form
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              onReset={() => setValue()}
              onSubmit={handleAddRule}
            >
              <Box flex="grow" direction="row" align="end" justify="between">
                <FormField name="rule" htmlFor="rule" label="New Rule">
                  <TextInput
                    name="rule"
                    id="rule"
                    placeholder="Enter Rule Here..."
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </FormField>
                <Button type="submit" label="" icon={<Add />} />
              </Box>
            </Form>
          )}
          {rules &&
            rules.map((rule, index) => (
              <Box
                flex="grow"
                className="rule-item"
                margin="1em 0px"
                background="light-2"
              >
                <Box flex direction="row" align="center" justify="between">
                  <Heading level="2">{index + 1}.</Heading>
                  {props.canEdit && (
                    <Button
                      size="large"
                      icon={<Trash color="status-critical" />}
                      onClick={() => handleDeleteRule(rule)}
                    />
                  )}
                </Box>
                <Paragraph>{rule}</Paragraph>
              </Box>
            ))}

          <Box flex="grow" pad="1em 0em">
            {props.canEdit && (
              <Button
                margin=".5em 0px"
                primary
                size="medium"
                color="status-critical"
                label="Delete Rule Set"
                icon={<Trash />}
                onClick={() => props.handleDeleteRuleSet(props.ruleSet)}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Layer>
  );
}
