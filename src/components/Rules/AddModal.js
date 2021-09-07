import {
  TextInput,
  Box,
  Button,
  Heading,
  Form,
  FormField,
  Layer,
  Paragraph,
} from "grommet";
import { Add, Trash, LinkPrevious, Edit } from "grommet-icons";
import { useState } from "react";

export default function AddModal(props) {
  const [rules, setRules] = useState([]);
  const [ruleSetName, setRuleSetName] = useState();
  const [value, setValue] = useState();
  function handleAddRuleToSet() {
    setRules([...rules, value]);
    setValue("");
  }

  function handleDeleteRuleFromSet(ruleToRemove) {
    const filteredRules = rules.filter((rule) => rule !== ruleToRemove);
    setRules(filteredRules);
  }

  function handleSubmit() {
    props.onSubmit(ruleSetName, rules);
  }

  return (
    <Layer onEsc={props.onModalClose} onClickOutside={props.onModalClose}>
      <Box overflow="scroll" padding="0px 1em">
        <Box margin="2em 2em">
          <LinkPrevious color="dark-6" onClick={props.onModalClose} />
        </Box>
        <Box flex margin="0em 0px" align="center" justify="start">
          <Form
            value={value}
            onChange={(nextValue) => setValue(nextValue)}
            onReset={() => setValue()}
            onSubmit={handleSubmit}
          >
            <FormField
              name="name"
              htmlFor="rule-set-name"
              label="New Rule Set Name"
            >
              <TextInput
                name="name"
                id="rule-set-name"
                placeholder="New Rule Set Name..."
                value={ruleSetName}
                onChange={(event) => setRuleSetName(event.target.value)}
              />
            </FormField>
            <Box flex direction="row" align="end" justify="between">
              <FormField name="rule" htmlFor="rule" label="New Rule">
                <TextInput
                  name="rule"
                  id="rule"
                  placeholder="Enter Rule Here..."
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />
              </FormField>
              <Button label="" icon={<Add />} onClick={handleAddRuleToSet} />
            </Box>
            {rules && rules.length !== 0 && (
              <div className="rules-list">
                <Box margin="1em 0px" flex fill>
                  {rules.map((rule, index) => (
                    <Box
                      className="rule-item"
                      margin=".5em 0px"
                      background="light-2"
                      key={index}
                    >
                      <Box
                        flex
                        direction="row"
                        align="center"
                        justify="between"
                      >
                        <Heading level="3">{index + 1}.</Heading>
                        <Button
                          size="small"
                          icon={<Trash color="#FF4040" />}
                          onClick={() => handleDeleteRuleFromSet(rule)}
                        />
                      </Box>
                      <Paragraph margin=".25em 0px" size="small">
                        {rule}
                      </Paragraph>
                    </Box>
                  ))}
                </Box>
              </div>
            )}
            <Box direction="row" gap="medium">
              <Button
                flex
                fill
                type="submit"
                primary
                label="Create Rule Set"
                icon={<Add />}
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
}
