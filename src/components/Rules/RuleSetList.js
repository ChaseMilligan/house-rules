import { Box, Button, Heading } from 'grommet';
import update from 'immutability-helper';
import { FormNextLink, Drag } from 'grommet-icons';
import { useState, useCallback, useRef } from 'react';
import RuleSetModal from './RuleSetModal';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import RuleSet from './RuleSet';
import { rearrangeRuleSets } from "../../service/Rules";
import { auth } from "../../config/firebase-config";

export default function RuleSetList(props) {
	const [ruleSets, setRuleSets] = useState(props.ruleSets);
	const [viewRuleSet, setViewRuleSet] = useState(false);
	const [ruleSet, setRuleSet] = useState();

	function handleDragEnd(props) {
		const destinationIndex = props[0].destination.index;
		const sourceIndex = props[0].source.index;
		let newRuleSets = ruleSets;

		console.log(destinationIndex, sourceIndex);

		if (destinationIndex >= newRuleSets.length) {
        var k = destinationIndex - newRuleSets.length + 1;
        while (k--) {
            newRuleSets.push(undefined);
        }
    }
    newRuleSets.splice(destinationIndex, 0, newRuleSets.splice(sourceIndex, 1)[0]);
    console.log(newRuleSets);
		rearrangeRuleSets(newRuleSets, auth.currentUser.uid);
	}

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
			<DragDropContext
				onDragEnd={(...props) => handleDragEnd(props)}
			>
				<Droppable droppableId="drop-1">
					{(provided) => (
						<div
							className="drag-container"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{ruleSets.map((ruleSet, index) => (
								<RuleSet
									key={ruleSet.id}
									index={index}
									id={ruleSet.id}
									text={ruleSet.text}
									ruleSet={ruleSet}
									setRuleSet={setRuleSet}
									setViewRuleSet={setViewRuleSet}
									canEdit={props.canEdit}
								/>
							))}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</Box>
	);
}
