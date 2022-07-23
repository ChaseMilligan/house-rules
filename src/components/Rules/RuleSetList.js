import { Box, Button, Heading } from "grommet";
import { FormNextLink } from "grommet-icons";
import { useState } from "react";
import RuleSetModal from "./RuleSetModal";

export default function RuleSetList(props) {
  const [viewRuleSet, setViewRuleSet] = useState(false);
  const [ruleSet, setRuleSet] = useState();

  return (
    <Box margin="1em 0px" flex fill>
      {viewRuleSet && (
        <RuleSetModal
          canEdit={props.canEdit}
          onModalClose={() => setViewRuleSet(false)}
          ruleSet={ruleSet}
          handleDeleteRuleSet={props.handleDeleteRuleSet}
        />
      )}
      {props.ruleSets.map((ruleSet, index) => (
        <Box
          className="rule-item"
          margin=".5em 0px"
          background="light-2"
          key={index}
        >
          <Box flex direction="row" align="center" justify="between">
            <Heading level="3">{ruleSet.name}</Heading>
            <div>
              <Button
                size="small"
                icon={<FormNextLink color="dark-6" />}
                onClick={() => {
                  setRuleSet(ruleSet);
                  setViewRuleSet(true);
                }}
              />
            </div>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
